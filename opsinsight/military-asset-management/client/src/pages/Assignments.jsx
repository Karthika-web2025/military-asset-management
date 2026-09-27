import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);

  const [assetId, setAssetId] = useState(1);
  const [userId, setUserId] = useState(1);
  const [quantity, setQuantity] = useState("");

  const [expenseAssetId, setExpenseAssetId] = useState(1);
  const [expenseQuantity, setExpenseQuantity] = useState("");
  const [reason, setReason] = useState("");

  const loadData = async () => {
    try {
      const [assignmentResponse, expenditureResponse] =
        await Promise.all([
          api.get("/assignments"),
          api.get("/expenditures"),
        ]);

      setAssignments(assignmentResponse.data.data);
      setExpenditures(expenditureResponse.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignment = async (e) => {
    e.preventDefault();

    try {
      await api.post("/assignments", {
        assetId: Number(assetId),
        userId: Number(userId),
        quantity: Number(quantity),
      });

      setQuantity("");
      loadData();

      alert("Asset assigned successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to assign asset"
      );
    }
  };

  const handleExpenditure = async (e) => {
    e.preventDefault();

    try {
      await api.post("/expenditures", {
        assetId: Number(expenseAssetId),
        quantity: Number(expenseQuantity),
        reason,
      });

      setExpenseQuantity("");
      setReason("");
      loadData();

      alert("Expenditure recorded successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to record expenditure"
      );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <h1>Assignments & Expenditures</h1>

        <form
          className="form-card"
          onSubmit={handleAssignment}
        >
          <h2>Assign Asset</h2>

          <input
            type="number"
            placeholder="Asset ID"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
          />

          <input
            type="number"
            placeholder="Personnel User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />

          <button type="submit">
            Assign Asset
          </button>
        </form>

        <div className="table-card">
          <h2>Assignment History</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Asset</th>
                <th>User</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {assignments.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.asset.name}</td>
                  <td>{item.user.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {new Date(
                      item.assignedAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          className="form-card"
          onSubmit={handleExpenditure}
        >
          <h2>Record Expenditure</h2>

          <input
            type="number"
            placeholder="Asset ID"
            value={expenseAssetId}
            onChange={(e) =>
              setExpenseAssetId(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Quantity"
            value={expenseQuantity}
            onChange={(e) =>
              setExpenseQuantity(e.target.value)
            }
            min="1"
          />

          <input
            type="text"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <button type="submit">
            Record Expenditure
          </button>
        </form>

        <div className="table-card">
          <h2>Expenditure History</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Asset</th>
                <th>Quantity</th>
                <th>Reason</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {expenditures.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.asset.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.reason || "-"}</td>
                  <td>
                    {new Date(
                      item.expendedAt
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

export default Assignments;