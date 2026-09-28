import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    baseId: "",
    equipmentTypeId: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: "",
    dateTo: "",
    baseId: "",
    equipmentTypeId: "",
  });

  const [showMovementDetails, setShowMovementDetails] = useState(false);

  useEffect(() => {
    loadFilterData();
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [appliedFilters]);

  // Load Bases and Equipment Types from existing Assets API
  const loadFilterData = async () => {
    try {
      const response = await api.get("/assets");

      const assets = response.data.data || [];

      const uniqueBases = [];
      const uniqueEquipmentTypes = [];

      assets.forEach((asset) => {
        // Add unique base
        if (
          asset.base &&
          !uniqueBases.some((base) => base.id === asset.base.id)
        ) {
          uniqueBases.push(asset.base);
        }

        // Add unique equipment type
        if (
          asset.equipmentType &&
          !uniqueEquipmentTypes.some(
            (equipmentType) =>
              equipmentType.id === asset.equipmentType.id
          )
        ) {
          uniqueEquipmentTypes.push(asset.equipmentType);
        }
      });

      setBases(uniqueBases);
      setEquipmentTypes(uniqueEquipmentTypes);
    } catch (error) {
      console.error("Failed to load filter data:", error);
    }
  };

  // Load dashboard data
  const loadDashboard = async () => {
    try {
      const params = {};

      if (appliedFilters.dateFrom) {
        params.dateFrom = appliedFilters.dateFrom;
      }

      if (appliedFilters.dateTo) {
        params.dateTo = appliedFilters.dateTo;
      }

      if (appliedFilters.baseId) {
        params.baseId = appliedFilters.baseId;
      }

      if (appliedFilters.equipmentTypeId) {
        params.equipmentTypeId =
          appliedFilters.equipmentTypeId;
      }

      const response = await api.get("/dashboard", {
        params,
      });

      setDashboard(response.data.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  // Reset filters
  const resetFilters = () => {
    const emptyFilters = {
      dateFrom: "",
      dateTo: "",
      baseId: "",
      equipmentTypeId: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  // Loading state
  if (!dashboard) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="loading">
            Loading dashboard...
          </div>
        </main>
      </div>
    );
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

  const movementDetails = dashboard.netMovementDetails || {
    purchases: [],
    transferIn: [],
    transferOut: [],
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <h1>Dashboard</h1>

        {/* =========================
            Filters
        ========================= */}
        <div className="dashboard-filters">
          {/* Date From */}
          <div className="filter-group">
            <label>Date From</label>

            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
          </div>

          {/* Date To */}
          <div className="filter-group">
            <label>Date To</label>

            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </div>

          {/* Base */}
          <div className="filter-group">
            <label>Base</label>

            <select
              name="baseId"
              value={filters.baseId}
              onChange={handleFilterChange}
            >
              <option value="">All Bases</option>

              {bases.map((base) => (
                <option
                  key={base.id}
                  value={base.id}
                >
                  {base.name}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Type */}
          <div className="filter-group">
            <label>Equipment Type</label>

            <select
              name="equipmentTypeId"
              value={filters.equipmentTypeId}
              onChange={handleFilterChange}
            >
              <option value="">
                All Equipment Types
              </option>

              {equipmentTypes.map((equipmentType) => (
                <option
                  key={equipmentType.id}
                  value={equipmentType.id}
                >
                  {equipmentType.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button onClick={applyFilters}>
              Apply Filters
            </button>

            <button
              className="reset-button"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>

        {/* =========================
            Dashboard Cards
        ========================= */}
        <div className="dashboard-grid">
          {cards.map(([title, value]) => {
            const isNetMovement =
              title === "Net Movement";

            return (
              <div
                className={`dashboard-card ${
                  isNetMovement
                    ? "clickable-card"
                    : ""
                }`}
                key={title}
                onClick={() => {
                  if (isNetMovement) {
                    setShowMovementDetails(true);
                  }
                }}
              >
                <h3>{title}</h3>

                <strong>{value}</strong>

                {isNetMovement && (
                  <small>
                    Click to view details
                  </small>
                )}
              </div>
            );
          })}
        </div>

        {/* =========================
            Net Movement Popup
        ========================= */}
        {showMovementDetails && (
          <div
            className="modal-overlay"
            onClick={() =>
              setShowMovementDetails(false)
            }
          >
            <div
              className="modal-content"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {/* Modal Header */}
              <div className="modal-header">
                <h2>Net Movement Details</h2>

                <button
                  className="close-button"
                  onClick={() =>
                    setShowMovementDetails(false)
                  }
                >
                  ×
                </button>
              </div>

              {/* =========================
                  Purchases
              ========================= */}
              <div className="movement-section">
                <h3>
                  Purchases: {dashboard.purchases}
                </h3>

                {movementDetails.purchases.length ===
                0 ? (
                  <p>No purchases found.</p>
                ) : (
                  <div className="movement-list">
                    {movementDetails.purchases.map(
                      (item) => (
                        <div
                          className="movement-item"
                          key={`purchase-${item.id}`}
                        >
                          <strong>
                            {item.quantity} units
                          </strong>

                          <span>
                            {item.equipmentType}
                          </span>

                          <span>
                            {item.base}
                          </span>

                          <span>
                            {new Date(
                              item.purchaseDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* =========================
                  Transfer In
              ========================= */}
              <div className="movement-section">
                <h3>
                  Transfer In: {dashboard.transferIn}
                </h3>

                {movementDetails.transferIn.length ===
                0 ? (
                  <p>
                    No transfer-in records found.
                  </p>
                ) : (
                  <div className="movement-list">
                    {movementDetails.transferIn.map(
                      (item) => (
                        <div
                          className="movement-item"
                          key={`transfer-in-${item.id}`}
                        >
                          <strong>
                            {item.quantity} units
                          </strong>

                          <span>
                            {item.equipmentType}
                          </span>

                          <span>
                            {item.fromBase} →{" "}
                            {item.toBase}
                          </span>

                          <span>
                            {new Date(
                              item.transferDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* =========================
                  Transfer Out
              ========================= */}
              <div className="movement-section">
                <h3>
                  Transfer Out:{" "}
                  {dashboard.transferOut}
                </h3>

                {movementDetails.transferOut.length ===
                0 ? (
                  <p>
                    No transfer-out records found.
                  </p>
                ) : (
                  <div className="movement-list">
                    {movementDetails.transferOut.map(
                      (item) => (
                        <div
                          className="movement-item"
                          key={`transfer-out-${item.id}`}
                        >
                          <strong>
                            {item.quantity} units
                          </strong>

                          <span>
                            {item.equipmentType}
                          </span>

                          <span>
                            {item.fromBase} →{" "}
                            {item.toBase}
                          </span>

                          <span>
                            {new Date(
                              item.transferDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
