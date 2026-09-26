import Sidebar from "@/app/components/sidebar";
import { db } from "@/app/lib/db";

export default async function Incidents() {
  // Fetch incidents from Neon PostgreSQL
  const incidents = await db.orm.public.Incident.all();

  // Incident calculations
  const totalIncidents = incidents.length;

  const openIncidents = incidents.filter(
    (incident) => incident.status !== "Closed"
  ).length;

  const criticalIncidents = incidents.filter(
    (incident) =>
      incident.status !== "Closed" &&
      incident.severity.toLowerCase() === "critical"
  ).length;

  const resolvedIncidents = incidents.filter(
    (incident) => incident.status === "Closed"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <main className="ml-64">
        {/* Header */}
        <header className="bg-slate-900 text-white px-8 py-5">
          <h1 className="text-2xl font-bold">
            OpsInsight
          </h1>

          <p className="text-slate-400 text-sm">
            Operations Analytics & Decision Support
          </p>
        </header>

        {/* Page Content */}
        <section className="p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Incidents
            </h2>

            <p className="text-slate-500 mt-2">
              Track operational issues and resolutions.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            {/* Total Incidents */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500">
                Total Incidents
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {totalIncidents}
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                All recorded incidents
              </p>
            </div>

            {/* Open Incidents */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500">
                Open Incidents
              </p>

              <h3 className="text-3xl font-bold text-orange-600 mt-2">
                {openIncidents}
              </h3>

              <p className="text-orange-600 text-sm mt-2">
                Require attention
              </p>
            </div>

            {/* Critical Incidents */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500">
                Critical
              </p>

              <h3 className="text-3xl font-bold text-red-600 mt-2">
                {criticalIncidents}
              </h3>

              <p className="text-red-600 text-sm mt-2">
                Critical open incidents
              </p>
            </div>

            {/* Resolved */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-slate-500">
                Resolved
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {resolvedIncidents}
              </h3>

              <p className="text-green-600 text-sm mt-2">
                Closed incidents
              </p>
            </div>
          </div>

          {/* Incident Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-slate-900">
                Incident Details
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Current operational incidents and their status.
              </p>
            </div>

            {incidents.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-400">
                  No incidents found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead>
                    <tr className="border-b bg-slate-50">

                      <th className="text-left px-6 py-4 font-semibold text-slate-700">
                        ID
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-slate-700">
                        Incident
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-slate-700">
                        Severity
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-slate-700">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-slate-700">
                        Created At
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {incidents.map((incident) => {

                      const severity =
                        incident.severity.toLowerCase();

                      const status =
                        incident.status.toLowerCase();

                      return (
                        <tr
                          key={incident.id}
                          className="border-b last:border-b-0 hover:bg-slate-50"
                        >

                          {/* ID */}
                          <td className="px-6 py-4 text-slate-700">
                            {incident.id}
                          </td>

                          {/* Title */}
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-900">
                              {incident.title}
                            </p>
                          </td>

                          {/* Severity */}
                          <td className="px-6 py-4">

                            {severity === "critical" ? (
                              <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                Critical
                              </span>
                            ) : severity === "high" ? (
                              <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                                High
                              </span>
                            ) : severity === "medium" ? (
                              <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                Medium
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                {incident.severity}
                              </span>
                            )}

                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">

                            {status === "closed" ? (
                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                Closed
                              </span>
                            ) : status === "in progress" ? (
                              <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                In Progress
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                                {incident.status}
                              </span>
                            )}

                          </td>

                          {/* Created At */}
                          <td className="px-6 py-4 text-slate-600">
                            {new Date(
                              incident.createdAt
                            ).toLocaleString()}
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