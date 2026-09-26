import Link from "next/link";
import Sidebar from "@/app/components/sidebar";
import db from "@/app/lib/db";

export default async function Home() {
  const [orders, inventory, risks] = await Promise.all([
    db.orm.public.Order.all(),
    db.orm.public.Inventory.all(),
    db.orm.public.Risk.all(),
  ]);

  // ==============================
  // ORDER CALCULATIONS
  // ==============================

  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const pendingOrders = orders.filter(
  (order) => order.status === "Pending"
).length;

const processingOrders = orders.filter(
  (order) => order.status === "Processing"
).length;

  const completionRate =
    totalOrders > 0
      ? ((completedOrders / totalOrders) * 100).toFixed(1)
      : "0.0";

  // ==============================
  // INVENTORY CALCULATIONS
  // ==============================

  const lowInventory = inventory.filter(
    (item) => item.quantity < item.reorderPoint
  ).length;

  // ==============================
  // RISK CALCULATIONS
  // ==============================

  const openRisks = risks.filter(
    (risk) => risk.status !== "Closed"
  ).length;

  const criticalRisks = risks.filter(
    (risk) =>
      risk.status !== "Closed" &&
      risk.severity.toLowerCase() === "critical"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <main className="ml-64">

        {/* Header */}
        <header className="bg-slate-900 px-8 py-5 text-white">
          <h1 className="text-2xl font-bold">
            OpsInsight
          </h1>

          <p className="text-sm text-slate-400">
            Operations Analytics & Decision Support
          </p>
        </header>

        {/* Dashboard */}
        <section className="p-8">

          {/* Page Title */}
          <h2 className="mb-2 text-3xl font-bold text-slate-900">
            Operations Dashboard
          </h2>

          <p className="mb-8 text-slate-500">
            Monitor operational performance and identify potential risks.
          </p>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Total Orders */}
           {/* Total Orders */}
<Link href="/orders">
  <div className="cursor-pointer rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
    <p className="text-slate-500">
      Total Orders
    </p>

    <h3 className="mt-2 text-3xl font-bold text-slate-900">
      {totalOrders}
    </h3>

    <p className="mt-2 text-sm text-slate-500">
      Total operational orders
    </p>
  </div>
</Link>

            {/* Completed Orders */}
          {/* Completed Orders */}
<Link href="/orders?status=Completed">
  <div className="cursor-pointer rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
    <p className="text-slate-500">
      Completed Orders
    </p>

    <h3 className="mt-2 text-3xl font-bold text-slate-900">
      {completedOrders}
    </h3>

    <p className="mt-2 text-sm text-green-600">
      {completionRate}% completion
    </p>
  </div>
</Link>

            {/* Low Inventory */}
           {/* Low Inventory */}
<Link href="/inventory">
  <div className="cursor-pointer rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
    <p className="text-slate-500">
      Low Inventory
    </p>

    <h3 className="mt-2 text-3xl font-bold text-slate-900">
      {lowInventory}
    </h3>

    <p className="mt-2 text-sm text-yellow-600">
      SKUs below reorder point
    </p>
  </div>
</Link>

            {/* Open Risks */}
          {/* Open Risks */}
<Link href="/incidents">
  <div className="cursor-pointer rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
    <p className="text-slate-500">
      Open Risks
    </p>

    <h3 className="mt-2 text-3xl font-bold text-slate-900">
      {openRisks}
    </h3>

    <p className="mt-2 text-sm text-red-600">
      {criticalRisks} critical
    </p>
  </div>
</Link>

          </div>

          {/* MAIN CONTENT */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Operational Performance */}
            <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">

              <h3 className="text-xl font-semibold text-slate-900">
                Operational Performance
              </h3>

              <div className="mt-6 space-y-5">

  {/* Completed */}
  <div>
    <div className="mb-2 flex justify-between">
      <span className="text-sm font-medium text-slate-700">
        Completed
      </span>

      <span className="text-sm font-semibold text-slate-900">
        {completedOrders}
      </span>
    </div>

    <div className="h-3 w-full rounded-full bg-slate-200">
      <div
        className="h-3 rounded-full bg-green-500"
        style={{
          width: `${
            totalOrders > 0
              ? (completedOrders / totalOrders) * 100
              : 0
          }%`,
        }}
      />
    </div>
  </div>

  {/* Processing */}
  <div>
    <div className="mb-2 flex justify-between">
      <span className="text-sm font-medium text-slate-700">
        Processing
      </span>

      <span className="text-sm font-semibold text-slate-900">
        {processingOrders}
      </span>
    </div>

    <div className="h-3 w-full rounded-full bg-slate-200">
      <div
        className="h-3 rounded-full bg-blue-500"
        style={{
          width: `${
            totalOrders > 0
              ? (processingOrders / totalOrders) * 100
              : 0
          }%`,
        }}
      />
    </div>
  </div>

  {/* Pending */}
  <div>
    <div className="mb-2 flex justify-between">
      <span className="text-sm font-medium text-slate-700">
        Pending
      </span>

      <span className="text-sm font-semibold text-slate-900">
        {pendingOrders}
      </span>
    </div>

    <div className="h-3 w-full rounded-full bg-slate-200">
      <div
        className="h-3 rounded-full bg-yellow-500"
        style={{
          width: `${
            totalOrders > 0
              ? (pendingOrders / totalOrders) * 100
              : 0
          }%`,
        }}
      />
    </div>
  </div>

</div>

            </div>

            {/* Critical Issues */}
            <div className="rounded-xl bg-white p-6 shadow-sm cursor-pointer hover:shadow-md transition">

              <h3 className="mb-5 text-xl font-semibold text-slate-900">
                Critical Issues
              </h3>

              <div className="space-y-4">

                {/* Critical Risks */}
                <div className="border-l-4 border-red-500 bg-red-50 p-4">
                  <p className="font-semibold text-red-700">
                    Critical Risks
                  </p>

                  <p className="text-sm text-slate-600">
                    {criticalRisks} critical risks require attention
                  </p>
                </div>

                {/* Low Inventory */}
                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                  <p className="font-semibold text-yellow-700">
                    Low Inventory
                  </p>

                  <p className="text-sm text-slate-600">
                    {lowInventory} SKUs below reorder point
                  </p>
                </div>

                {/* Open Risks */}
                <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                  <p className="font-semibold text-orange-700">
                    Open Risks
                  </p>

                  <p className="text-sm text-slate-600">
                    {openRisks} risks require attention
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}