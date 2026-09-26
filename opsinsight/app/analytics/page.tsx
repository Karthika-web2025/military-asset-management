import Sidebar from "@/app/components/sidebar";
import db from "@/app/lib/db";

export default async function Analytics() {
  // Fetch data from Neon PostgreSQL
  const [orders, inventory, risks] = await Promise.all([
    db.orm.public.Order.all(),
    db.orm.public.Inventory.all(),
    db.orm.public.Risk.all(),
  ]);

  // =====================================
  // ORDER ANALYTICS
  // =====================================

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

  // =====================================
  // INVENTORY ANALYTICS
  // =====================================

  const totalInventoryItems = inventory.length;

  const lowInventoryItems = inventory.filter(
    (item) => item.quantity < item.reorderPoint
  ).length;

  const inventoryHealthRate =
    totalInventoryItems > 0
      ? (
          ((totalInventoryItems - lowInventoryItems) /
            totalInventoryItems) *
          100
        ).toFixed(1)
      : "0.0";

  // =====================================
  // RISK ANALYTICS
  // =====================================

  const totalRisks = risks.length;

  const openRisks = risks.filter(
    (risk) => risk.status !== "Closed"
  ).length;

  const criticalRisks = risks.filter(
    (risk) =>
      risk.status !== "Closed" &&
      risk.severity.toLowerCase() === "critical"
  ).length;

  const resolvedRisks = risks.filter(
    (risk) => risk.status === "Closed"
  ).length;

  // =====================================
  // UI
  // =====================================

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
              Analytics
            </h2>

            <p className="text-slate-500 mt-2">
              Analyze operational trends and performance.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Total Orders */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500 text-sm">
                Total Orders
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {totalOrders}
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                All operational orders
              </p>
            </div>

            {/* Completed Orders */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500 text-sm">
                Completed Orders
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {completedOrders}
              </h3>

              <p className="text-green-600 text-sm mt-2">
                {completionRate}% completion rate
              </p>
            </div>

            {/* Inventory Health */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500 text-sm">
                Inventory Health
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {inventoryHealthRate}%
              </h3>

              <p className="text-blue-600 text-sm mt-2">
                {lowInventoryItems} items below reorder point
              </p>
            </div>

            {/* Open Risks */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500 text-sm">
                Open Risks
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {openRisks}
              </h3>

              <p className="text-red-600 text-sm mt-2">
                {criticalRisks} critical
              </p>
            </div>

          </div>

          {/* Analytics Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

            {/* Order Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm">

              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Order Status
              </h3>

              <div className="space-y-5">

                {/* Completed */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">
                      Completed
                    </span>

                    <span className="font-semibold text-slate-900">
                      {completedOrders}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{
                        width: `${totalOrders > 0
                          ? (completedOrders / totalOrders) * 100
                          : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Processing */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">
                      Processing
                    </span>

                    <span className="font-semibold text-slate-900">
                      {processingOrders}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{
                        width: `${totalOrders > 0
                          ? (processingOrders / totalOrders) * 100
                          : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Pending */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">
                      Pending
                    </span>

                    <span className="font-semibold text-slate-900">
                      {pendingOrders}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{
                        width: `${totalOrders > 0
                          ? (pendingOrders / totalOrders) * 100
                          : 0}%`,
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Inventory Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-sm">

              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Inventory Analysis
              </h3>

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-slate-50 p-5 rounded-lg">
                  <p className="text-slate-500 text-sm">
                    Total Items
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {totalInventoryItems}
                  </p>
                </div>

                <div className="bg-yellow-50 p-5 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    Low Inventory
                  </p>

                  <p className="text-2xl font-bold text-yellow-700 mt-2">
                    {lowInventoryItems}
                  </p>
                </div>

                <div className="bg-green-50 p-5 rounded-lg">
                  <p className="text-green-700 text-sm">
                    Healthy Items
                  </p>

                  <p className="text-2xl font-bold text-green-700 mt-2">
                    {totalInventoryItems - lowInventoryItems}
                  </p>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    Health Rate
                  </p>

                  <p className="text-2xl font-bold text-blue-700 mt-2">
                    {inventoryHealthRate}%
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Risk Analysis */}
          <div className="bg-white p-6 rounded-xl shadow-sm mt-6">

            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              Risk Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="border-l-4 border-red-500 bg-red-50 p-5">
                <p className="text-red-700 font-semibold">
                  Critical Risks
                </p>

                <p className="text-3xl font-bold text-red-700 mt-2">
                  {criticalRisks}
                </p>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-5">
                <p className="text-orange-700 font-semibold">
                  Open Risks
                </p>

                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {openRisks}
                </p>
              </div>

              <div className="border-l-4 border-green-500 bg-green-50 p-5">
                <p className="text-green-700 font-semibold">
                  Resolved Risks
                </p>

                <p className="text-3xl font-bold text-green-700 mt-2">
                  {resolvedRisks}
                </p>
              </div>

            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-500 text-sm">
                Total risks tracked
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalRisks}
              </p>
            </div>

          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm mt-6">

            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Operational Summary
            </h3>

            <p className="text-slate-600 leading-7">
              The analytics dashboard provides a consolidated view of
              order performance, inventory health, and operational risks.
              Currently, there are{" "}
              <span className="font-semibold text-slate-900">
                {totalOrders}
              </span>{" "}
              total orders, with{" "}
              <span className="font-semibold text-green-600">
                {completionRate}%
              </span>{" "}
              completed. Inventory health is{" "}
              <span className="font-semibold text-blue-600">
                {inventoryHealthRate}%
              </span>
              , while{" "}
              <span className="font-semibold text-red-600">
                {openRisks}
              </span>{" "}
              risks remain open.
            </p>

          </div>

        </section>
      </main>
    </div>
  );
}