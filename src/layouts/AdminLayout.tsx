import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

const createInitialAvatar = (name: string) => {
  const initial = (name || "A").charAt(0).toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#4078fb"/>
          <stop offset="1" stop-color="#695de8"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#g)"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="white">
        ${initial}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const AdminLayout = () => {
  const { user } = useAuth();

  const avatarStorageKey = useMemo(() => {
    return user?.id ? `pipelytcs_avatar_${user.id}` : "pipelytcs_avatar_guest";
  }, [user?.id]);

  const [avatarSrc, setAvatarSrc] = useState("");

  useEffect(() => {
    setAvatarSrc(localStorage.getItem(avatarStorageKey) || "");

    const handleAvatarUpdated = () => {
      setAvatarSrc(localStorage.getItem(avatarStorageKey) || "");
    };

    window.addEventListener("pipelytcs-avatar-updated", handleAvatarUpdated);

    return () => {
      window.removeEventListener("pipelytcs-avatar-updated", handleAvatarUpdated);
    };
  }, [avatarStorageKey]);

  const profileImage = avatarSrc || createInitialAvatar(user?.nama || "Admin");

  return (
    <div className="admin-layout">
      <header className="admin-navbar">
        <h1>Pipelytcs</h1>

        <Link to="/settings" className="admin-profile">
          <div className="admin-avatar">
            <img src={profileImage} alt={user?.nama || "Admin"} />
            <span />
          </div>

          <div className="admin-profile-text">
            <strong>{user?.nama || "Admin"}</strong>
            <small>Admin</small>
          </div>
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