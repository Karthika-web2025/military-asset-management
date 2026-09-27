import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2>Military AMS</h2>

      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/purchases">Purchases</NavLink>
        <NavLink to="/transfers">Transfers</NavLink>
        {/* <NavLink to="/assignments">Assignments</NavLink> */}
        <NavLink to="/assignments">
  Assignments & Expenditures
</NavLink>
      </nav>

      <button onClick={logout}>Logout</button>
    </aside>
  );
}

export default Sidebar;