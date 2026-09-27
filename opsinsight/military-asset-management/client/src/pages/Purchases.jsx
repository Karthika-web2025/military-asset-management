import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [baseId, setBaseId] = useState(1);
  const [equipmentTypeId, setEquipmentTypeId] = useState(1);
  const [quantity, setQuantity] = useState("");

  const loadPurchases = async () => {
    try {
      const response = await api.get("/purchases");
      setPurchases(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/purchases", {
        baseId,
        equipmentTypeId,
        quantity: Number(quantity),
      });

      setQuantity("");
      loadPurchases();
      alert("Purchase recorded successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to record purchase"
      );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <h1>Purchases</h1>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Record Purchase</h2>

          <input
            type="number"
            placeholder="Base ID"
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
          />

          <input
            type="number"
            placeholder="Equipment Type ID"
            value={equipmentTypeId}
            onChange={(e) =>
              setEquipmentTypeId(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />

          <button type="submit">Record Purchase</button>
        </form>

        <div className="table-card">
          <h2>Purchase History</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Base</th>
                <th>Equipment</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.id}</td>
                  <td>{purchase.base.name}</td>
                  <td>{purchase.equipmentType.name}</td>
                  <td>{purchase.quantity}</td>
                  <td>
                    {new Date(
                      purchase.purchaseDate
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Purchases;