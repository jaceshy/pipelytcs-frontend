import { NavLink, useNavigate } from "react-router-dom";
import "./SalesInsights.css";

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

const stats = [
  ["Average Order Value", "Rp 327.000", "+5.2%"],
  ["Customer Retention", "82.4%", "+3.1%"],
  ["Repeat Purchase Rate", "45.6%", "+2.8%"],
  ["Growth Rate", "18.9%", "Monthly"],
];

const SalesInsights = () => {
    const navigate = useNavigate();
  return (
    <div className="sales-page">
      <nav className="sales-navbar">
        <h1>Pipelytcs</h1>

        <div className="sales-profile">
          <div className="sales-avatar">
            <img src="/assets/dashboard/avatar.png" alt="Admin" />
            <span />
          </div>
          <strong>Admin</strong>
        </div>
      </nav>

      <div className="sales-layout">
       <aside className="sales-sidebar">
        {sidebarMenus.map((menu) => (
            <NavLink
            key={menu.label}
            to={menu.path}
            className={({ isActive }) =>
                `sales-sidebar-item ${isActive ? "active" : ""}`
            }
            >
            <img src={menu.icon} alt={menu.label} />
            <p>{menu.label}</p>
            </NavLink>
        ))}
        </aside>

        <main className="sales-main">
          <section className="sales-header">
            <div>
              <h2>Sales Performance Insights</h2>
              <p>Deep dive into your sales metrics and customer behavior</p>
            </div>
            <button
                className="add-purchase-btn"
                onClick={() => navigate("/sales-insights/add-purchase")}
                >
                + Add Purchase
                </button>
          </section>

          <div className="sales-filters">
            <button>All Platforms ⌄</button>
            <button>Last 30 Days ⌄</button>
          </div>

          <section className="sales-stats">
            {stats.map(([title, value, change]) => (
              <div className="sales-stat-card" key={title}>
                <div className="sales-stat-top">
                  <p>{title}</p>
                  <span>↗</span>
                </div>
                <h3>{value}</h3>
                <small>{change}</small>
              </div>
            ))}
          </section>

          <section className="sales-card sales-main-chart">
            <div className="sales-card-header">
              <div>
                <h3>Sales & Units Performance</h3>
                <p>Weekly comparison of revenue and quantity</p>
              </div>
              <button className="week-btn">▣ Last 4 Weeks</button>
            </div>

            <div className="line-chart-box">
              <svg viewBox="0 0 720 310">
                <line x1="60" y1="10" x2="60" y2="260" />
                <line x1="60" y1="260" x2="700" y2="260" />
                <polyline points="60,125 270,100 480,112 700,75" />
                <polyline className="units-line" points="60,260 270,260 480,260 700,260" />
                {[60, 270, 480, 700].map((x, i) => (
                  <circle key={i} cx={x} cy={[125, 100, 112, 75][i]} r="7" />
                ))}
                {[60, 270, 480, 700].map((x, i) => (
                  <circle className="units-dot" key={`u-${i}`} cx={x} cy="260" r="7" />
                ))}
                <text x="0" y="15">80000</text>
                <text x="0" y="75">60000</text>
                <text x="0" y="135">40000</text>
                <text x="0" y="200">20000</text>
                <text x="40" y="266">0</text>
                <text x="40" y="292">Week 1</text>
                <text x="245" y="292">Week 2</text>
                <text x="455" y="292">Week 3</text>
                <text x="675" y="292">Week 4</text>
              </svg>
            </div>

            <div className="chart-legend">
              <span className="blue-box" /> Revenue
              <span className="purple-box" /> Units Sold
            </div>
          </section>

          <section className="sales-two-columns">
            <div className="sales-card small-chart-card">
              <h3>Revenue by Category</h3>
              <p>Top performing product categories</p>
              <div className="bar-chart">
                {["Electronic", "Fashion", "Beauty", "Home", "Sports"].map((x, i) => (
                  <div className="bar-item" key={x}>
                    <div style={{ height: [220, 175, 135, 92, 78][i] }} />
                    <span>{x}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend purple-only">
                <span className="purple-box" /> Revenue
              </div>
            </div>

            <div className="sales-card small-chart-card">
              <h3>Customer Retention Trend</h3>
              <p>Monthly retention rate percentage</p>
              <div className="retention-chart">
                <svg viewBox="0 0 340 250">
                  <line x1="35" y1="10" x2="35" y2="215" />
                  <line x1="35" y1="215" x2="320" y2="215" />
                  <polyline points="35,90 90,78 145,70 200,58 255,48 315,40" />
                  {[35, 90, 145, 200, 255, 315].map((x, i) => (
                    <circle key={i} cx={x} cy={[90, 78, 70, 58, 48, 40][i]} r="6" />
                  ))}
                </svg>
              </div>
              <div className="chart-legend green-only">
                <span className="green-box" /> Retention Rate (%)
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SalesInsights;