import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setDashboard(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  if (!dashboard) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const cards = [
    ["Opening Balance", dashboard.openingBalance],
    ["Purchases", dashboard.purchases],
    ["Transfer In", dashboard.transferIn],
    ["Transfer Out", dashboard.transferOut],
    ["Net Movement", dashboard.netMovement],
    ["Assigned", dashboard.assigned],
    ["Expended", dashboard.expended],
    ["Closing Balance", dashboard.closingBalance],
  ];

   return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <h1>Dashboard</h1>

        <div className="dashboard-grid">
          {cards.map(([title, value]) => (
            <div className="dashboard-card" key={title}>
              <h3>{title}</h3>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


export default Dashboard;