import "./Dashboard.css";

const sidebarMenus = [
  { label: "Dashboard", icon: "/assets/dashboard/icons/dashboard.svg", active: true },
  { label: "Sales Insights", icon: "/assets/dashboard/icons/sales-insights.svg" },
  { label: "Platform Comparison", icon: "/assets/dashboard/icons/platform-comparison.svg" },
  { label: "Product Analytics", icon: "/assets/dashboard/icons/product-analytics.svg" },
  { label: "Settings", icon: "/assets/dashboard/icons/settings.svg" },
];

const products = [
  ["#1", "Wireless Earbuds Pro", "Shopee", "342 units", "Rp 68,400,000", "+15%", "up"],
  ["#2", "Smart Watch Series 5", "Tokopedia", "287 units", "Rp 143,500,000", "+15%", "up"],
  ["#3", "Running Shoes Premium", "TikTok Shop", "234 units", "Rp 46,800,000", "+15%", "up"],
  ["#4", "Laptop Stand Adjustable", "Instagram", "198 units", "Rp 19,800,000", "-5%", "down"],
  ["#5", "USB-C Hub 7-in-1", "Shopee", "176 units", "Rp 17,600,000", "+15%", "up"],
];

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <header className="dashboard-navbar">
        <h1>Pipelytcs</h1>

        <div className="dashboard-profile">
          <div className="avatar">
            <img src="/assets/dashboard/avatar.png" alt="Admin" />
            <span />
          </div>
          <strong>Admin</strong>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          {sidebarMenus.map((menu) => (
            <div key={menu.label} className={`sidebar-item ${menu.active ? "active" : ""}`}>
              <img src={menu.icon} alt={menu.label} />
              <span>{menu.label}</span>
            </div>
          ))}
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-heading">
            <h2>Sales Overview</h2>
            <p>Your complete sales performance across all platforms</p>
          </section>

          <section className="stats-row">
            <div className="stat-card stat-large">
              <div className="stat-title">
                <span>Total Sales</span>
                <img src="/assets/dashboard/icons/total-sales.svg" alt="Total Sales" />
              </div>
              <h3>Rp 404,000,000</h3>
              <p>+12.5% from last month</p>
            </div>

            <div className="stat-card">
              <div className="stat-title">
                <span>Sales Growth</span>
                <img src="/assets/dashboard/icons/sales-growth.svg" alt="Sales Growth" />
              </div>
              <h3>18.4%</h3>
              <p className="green">vs previous period</p>
            </div>

            <div className="stat-card">
              <div className="stat-title">
                <span>Units Sold</span>
                <img src="/assets/dashboard/icons/units-sold.svg" alt="Units Sold" />
              </div>
              <h3>1,237</h3>
              <p className="green">+8.2% this week</p>
            </div>

            <div className="stat-card">
              <div className="stat-title">
                <span>Avg Order Value</span>
                <img src="/assets/dashboard/icons/avg-order-value.svg" alt="Avg Order Value" />
              </div>
              <h3>Rp 327,000</h3>
              <p className="red">-2.1% from avg</p>
            </div>
          </section>

          <section className="charts-row">
            <div className="dashboard-card chart-card">
              <h3>Sales Trend (Last 30 Days)</h3>
              <p>Daily revenue performance</p>

              <div className="sales-chart-box">
                <div className="y-labels">
                  <span>80000</span>
                  <span>60000</span>
                  <span>40000</span>
                  <span>20000</span>
                  <span>0</span>
                </div>

                <svg className="line-chart" viewBox="0 0 310 260">
                  <line x1="20" y1="10" x2="20" y2="220" />
                  <line x1="20" y1="220" x2="295" y2="220" />
                  <polyline points="20,110 65,85 110,98 155,55 195,68 235,20 285,35" />
                  {[20, 65, 110, 155, 195, 235, 285].map((x, i) => (
                    <circle
                      key={x}
                      cx={x}
                      cy={[110, 85, 98, 55, 68, 20, 35][i]}
                      r="4"
                    />
                  ))}
                </svg>

                <div className="x-labels">
                  <span>Dec 1</span>
                  <span>Dec 5</span>
                  <span>Dec 10</span>
                  <span>Dec 15</span>
                  <span>Dec 20</span>
                  <span>Dec 30</span>
                </div>
              </div>

              <div className="sales-legend">
                <span />
                <b>Sales</b>
              </div>
            </div>

            <div className="dashboard-card chart-card">
              <h3>Revenue by Platform</h3>
              <p>Distribution across all channels</p>

              <div className="pie-wrapper">
                <div className="pie-chart" />
                <span className="pie-num num-36">36%</span>
                <span className="pie-num num-24">24%</span>
                <span className="pie-num num-19">19%</span>
                <span className="pie-num num-21">21%</span>
              </div>

              <div className="pie-legend">
                <span className="orange">Shopee</span>
                <span className="green-dot">Tokopedia</span>
                <span className="black">TikTok Shop</span>
                <span className="pink">Instagram</span>
              </div>
            </div>
          </section>

          <section className="dashboard-card products-card">
            <h3>Top 5 Best-Selling Products</h3>
            <p>Highest performing items this month</p>

            <div className="product-list">
              {products.map(([rank, name, platform, units, revenue, growth, trend]) => (
                <div className="product-item" key={rank}>
                  <div className="rank-box">{rank}</div>

                  <div className="product-detail">
                    <h4>{name}</h4>
                    <div>
                      <span className={`badge ${platform.toLowerCase().replaceAll(" ", "-")}`}>
                        {platform}
                      </span>
                      <small>{units} • {revenue}</small>
                    </div>
                  </div>

                  <div className={`growth ${trend}`}>
                    {trend === "up" ? "↑" : "↓"} {growth}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;