import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [assetId, setAssetId] = useState(1);
  const [fromBaseId, setFromBaseId] = useState(1);
  const [toBaseId, setToBaseId] = useState(2);
  const [quantity, setQuantity] = useState("");

  const loadTransfers = async () => {
    try {
      const response = await api.get("/transfers");
      setTransfers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/transfers", {
        assetId: Number(assetId),
        fromBaseId: Number(fromBaseId),
        toBaseId: Number(toBaseId),
        quantity: Number(quantity),
      });

      setQuantity("");
      loadTransfers();

      alert("Transfer completed successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create transfer"
      );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <h1>Transfers</h1>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Create Transfer</h2>

          <input
            type="number"
            placeholder="Asset ID"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
          />

          <input
            type="number"
            placeholder="From Base ID"
            value={fromBaseId}
            onChange={(e) => setFromBaseId(e.target.value)}
          />

          <input
            type="number"
            placeholder="To Base ID"
            value={toBaseId}
            onChange={(e) => setToBaseId(e.target.value)}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />

          <button type="submit">
            Transfer Asset
          </button>
        </form>

        <div className="table-card">
          <h2>Transfer History</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Asset</th>
                <th>From</th>
                <th>To</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td>{transfer.id}</td>
                  <td>{transfer.asset.name}</td>
                  <td>{transfer.fromBase.name}</td>
                  <td>{transfer.toBase.name}</td>
                  <td>{transfer.quantity}</td>
                  <td>{transfer.status}</td>
                  <td>
                    {new Date(
                      transfer.transferDate
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

export default Transfers;