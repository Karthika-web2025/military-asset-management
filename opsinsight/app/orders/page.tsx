import Link from "next/link";
import Sidebar from "@/app/components/sidebar";
import db from "../lib/db";

type OrdersProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function Orders({ searchParams }: OrdersProps) {
  const params = await searchParams;
  const statusFilter = params.status;

  let orders = await db.orm.public.Order
    .orderBy((order) => order.createdAt.desc())
    .all();

  // Filter orders when a status is selected
  if (statusFilter) {
    orders = orders.filter(
      (order) => order.status === statusFilter
    );
  }

  return (
    <main className="ml-64 min-h-screen bg-slate-100 p-8">
      <Sidebar />

      <h1 className="text-3xl font-bold text-slate-900">
        Orders
      </h1>

      <p className="mt-2 text-slate-500">
        Monitor and analyze operational orders.
      </p>

      {/* Status Filters */}
      <div className="mt-6 flex gap-3">

        <Link
          href="/orders"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            !statusFilter
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          All
        </Link>

        <Link
          href="/orders?status=Completed"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            statusFilter === "Completed"
              ? "bg-green-600 text-white"
              : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          Completed
        </Link>

        <Link
          href="/orders?status=Processing"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            statusFilter === "Processing"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          Processing
        </Link>

        <Link
          href="/orders?status=Pending"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            statusFilter === "Pending"
              ? "bg-yellow-500 text-white"
              : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          Pending
        </Link>

      </div>

      {/* Active Filter */}
      {statusFilter && (
        <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-blue-700">
          Showing orders with status:{" "}
          <span className="font-semibold">
            {statusFilter}
          </span>
        </div>
      )}

      {/* Orders Table */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">
                Order No
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                Created At
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    {order.orderNo}
                  </td>

                  <td className="px-6 py-4">
                    {order.status}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleString(
                      "en-IN",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </main>
  );
}