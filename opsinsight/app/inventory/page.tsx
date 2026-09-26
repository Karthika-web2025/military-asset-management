import Sidebar from "@/app/components/sidebar";
import db from "@/app/lib/db";

export default async function Inventory() {
  // Fetch inventory data from Neon PostgreSQL
  const inventory = await db.orm.public.Inventory.all();

  // Calculate low inventory items
  const lowInventory = inventory.filter(
    (item) => item.quantity < item.reorderPoint
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <main className="ml-64">
        {/* Header */}
        <header className="bg-slate-900 text-white px-8 py-5">
          <h1 className="text-2xl font-bold">OpsInsight</h1>

          <p className="text-slate-400 text-sm">
            Operations Analytics & Decision Support
          </p>
        </header>

        {/* Page Content */}
        <section className="p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Inventory
            </h2>

            <p className="text-slate-500 mt-2">
              Monitor inventory levels and identify potential risks.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total SKUs */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500">
                Total SKUs
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {inventory.length}
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                Inventory items
              </p>
            </div>

            {/* Low Inventory */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500">
                Low Inventory
              </p>

              <h3 className="text-3xl font-bold text-red-600 mt-2">
                {lowInventory.length}
              </h3>

              <p className="text-red-500 text-sm mt-2">
                Below reorder point
              </p>
            </div>

            {/* Healthy Inventory */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500">
                Healthy Inventory
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {inventory.length - lowInventory.length}
              </h3>

              <p className="text-green-600 text-sm mt-2">
                At or above reorder point
              </p>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-slate-900">
                Inventory Levels
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Current inventory quantity and reorder thresholds.
              </p>
            </div>

            {inventory.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-400">
                  No inventory records found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left px-6 py-4 font-semibold text-slate-700">
                        SKU
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-slate-700">
                        Quantity
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-slate-700">
                        Reorder Point
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-slate-700">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {inventory.map((item) => {
                      const isLow =
                        item.quantity < item.reorderPoint;

                      return (
                        <tr
                          key={item.id}
                          className="border-b last:border-b-0 hover:bg-slate-50"
                        >
                          {/* SKU */}
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {item.sku}
                          </td>

                          {/* Quantity */}
                          <td className="px-6 py-4 text-slate-700">
                            {item.quantity}
                          </td>

                          {/* Reorder Point */}
                          <td className="px-6 py-4 text-slate-700">
                            {item.reorderPoint}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {isLow ? (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                Healthy
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}