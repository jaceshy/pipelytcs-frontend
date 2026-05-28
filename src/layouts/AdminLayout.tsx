import { Link, NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

const sidebarMenus = [
  {
    label: "Dashboard",
    icon: "/assets/dashboard/icons/dashboard.svg",
    path: "/dashboard",
  },
  {
    label: "Sales Insights",
    icon: "/assets/dashboard/icons/sales-insights.svg",
    path: "/sales-insights",
  },
  {
    label: "Platform Comparison",
    icon: "/assets/dashboard/icons/platform-comparison.svg",
    path: "/platform-comparison",
  },
  {
    label: "Product Analytics",
    icon: "/assets/dashboard/icons/product-analytics.svg",
    path: "/product-analytics",
  },
  {
    label: "Settings",
    icon: "/assets/dashboard/icons/settings.svg",
    path: "/settings",
  },
];

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <header className="admin-navbar">
        <h1>Pipelytcs</h1>

        <Link to="/settings" className="admin-profile">
          <div className="admin-avatar">
            <img src="/assets/dashboard/avatar.png" alt="Admin" />
            <span />
          </div>

          <strong>Admin</strong>
        </Link>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          {sidebarMenus.map((menu) => (
            <NavLink
              key={menu.label}
              to={menu.path}
              className={({ isActive }) =>
                `admin-sidebar-item ${isActive ? "active" : ""}`
              }
            >
              <img src={menu.icon} alt={menu.label} />
              <span>{menu.label}</span>
            </NavLink>
          ))}
        </aside>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;