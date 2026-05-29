import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SalesInsights.css";

type SalesInsightsProps = {
  mode?: "admin" | "team";
};

const stats = [
  {
    title: "Average Order Value",
    value: "Rp 327.000",
    change: "+5.2%",
    icon: "/assets/dashboard/icons/total-sales.svg",
  },
  {
    title: "Customer Retention",
    value: "82.4%",
    change: "+3.1%",
    icon: "/assets/dashboard/icons/customer-retention.svg",
  },
  {
    title: "Repeat Purchase Rate",
    value: "45.6%",
    change: "+2.8%",
    icon: "/assets/dashboard/icons/repeat-purchase-rate.svg",
  },
  {
    title: "Growth Rate",
    value: "18.9%",
    change: "Monthly",
    icon: "/assets/dashboard/icons/sales-growth.svg",
  },
];

const performanceMetrics = [
  ["Total Revenue", "Rp 404,000,000", "Rp 359,000,000", "+12.5%"],
  ["Total Orders", "1,237", "1,142", "+8.3%"],
  ["Average Order Value", "Rp 327,000", "Rp 314,000", "+4.1%"],
  ["New Customers", "342", "298", "+14.8%"],
  ["Returning Customers", "895", "844", "+6.0%"],
];

const topBuyers = [
  ["1", "maylatahmida2007@gmail.com", "998", "Rp 98,700,000"],
  ["2", "jacindaqueen67@gmail.com", "877", "Rp 78,000,000"],
  ["3", "imtinandarling@gmail.com", "540", "Rp 40,800,000"],
  ["4", "gosongsyef@gmail.com", "180", "Rp 12,980,000"],
  ["5", "bismillah1234@gmail.com", "178", "Rp 9,998,000"],
];

const platformOptions = ["Shopee", "Tokopedia", "Tiktok Shop", "Instagram Shop"];

const periodOptions = [
  "Last 7 Days",
  "Last 30 Days",
  "Last 90 Days",
  "Last 12 Months",
];

type DropdownType = "platform" | "period" | null;

const SalesInsights = ({ mode = "admin" }: SalesInsightsProps) => {
  const navigate = useNavigate();
  const isTeam = mode === "team";

  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);

  return (
    <div className="sales-page-content">
      <section className="sales-header">
        <div>
          <h2>Sales Performance Insights</h2>
          <p>Deep dive into your sales metrics and customer behavior</p>
        </div>

        {!isTeam && (
          <button
            className="add-purchase-btn"
            type="button"
            onClick={() => navigate("/sales-insights/add-purchase")}
          >
            + Add Purchase
          </button>
        )}
      </section>

      <div className="sales-filters">
        <div className="custom-dropdown">
          <button
            type="button"
            className={`custom-dropdown-trigger ${
              openDropdown === "platform" ? "active" : ""
            }`}
            onClick={() =>
              setOpenDropdown(openDropdown === "platform" ? null : "platform")
            }
          >
            <span>{selectedPlatform}</span>
            <img
              className="dropdown-chevron-img"
              src="/assets/dashboard/icons/dropdown.svg"
              alt=""
            />
          </button>

          {openDropdown === "platform" && (
            <div className="custom-dropdown-menu">
              {platformOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`custom-dropdown-option ${
                    selectedPlatform === option ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedPlatform(option);
                    setOpenDropdown(null);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="custom-dropdown">
          <button
            type="button"
            className={`custom-dropdown-trigger ${
              openDropdown === "period" ? "active" : ""
            }`}
            onClick={() =>
              setOpenDropdown(openDropdown === "period" ? null : "period")
            }
          >
            <span>{selectedPeriod}</span>
            <img
              className="dropdown-chevron-img"
              src="/assets/dashboard/icons/dropdown.svg"
              alt=""
            />
          </button>

          {openDropdown === "period" && (
            <div className="custom-dropdown-menu">
              {periodOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`custom-dropdown-option ${
                    selectedPeriod === option ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedPeriod(option);
                    setOpenDropdown(null);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="sales-stats">
        {stats.map((stat) => (
          <div className="sales-stat-card" key={stat.title}>
            <div className="sales-stat-top">
              <p>{stat.title}</p>
              <img className="sales-stat-icon" src={stat.icon} alt="" />
            </div>

            <h3>{stat.value}</h3>
            <small>{stat.change}</small>
          </div>
        ))}
      </section>

      <section className="sales-card sales-main-chart">
        <div className="sales-card-header">
          <div>
            <h3>Sales & Units Performance</h3>
            <p>Weekly comparison of revenue and quantity</p>
          </div>

          <button className="week-btn" type="button">
            <img
              className="week-btn-icon"
              src="/assets/dashboard/icons/calendar.svg"
              alt=""
            />
            <span>Last 4 Weeks</span>
          </button>
        </div>

        <div className="line-chart-box">
          <svg viewBox="0 0 720 310">
            <line x1="60" y1="10" x2="60" y2="260" />
            <line x1="60" y1="260" x2="700" y2="260" />

            <polyline points="60,125 270,100 480,112 700,75" />
            <polyline
              className="units-line"
              points="60,260 270,260 480,260 700,260"
            />

            {[60, 270, 480, 700].map((x, i) => (
              <circle key={x} cx={x} cy={[125, 100, 112, 75][i]} r="7" />
            ))}

            {[60, 270, 480, 700].map((x) => (
              <circle
                className="units-dot"
                key={`units-${x}`}
                cx={x}
                cy="260"
                r="7"
              />
            ))}

            <text x="0" y="15">
              80000
            </text>
            <text x="0" y="75">
              60000
            </text>
            <text x="0" y="135">
              40000
            </text>
            <text x="0" y="200">
              20000
            </text>
            <text x="40" y="266">
              0
            </text>

            <text x="40" y="292">
              Week 1
            </text>
            <text x="245" y="292">
              Week 2
            </text>
            <text x="455" y="292">
              Week 3
            </text>
            <text x="675" y="292">
              Week 4
            </text>
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

          <div className="bar-chart-area">
            <div className="bar-y-labels">
              <span>140000</span>
              <span>105000</span>
              <span>70000</span>
              <span>35000</span>
              <span>0</span>
            </div>

            <div className="bar-chart">
              {[
                ["Electronic", 220],
                ["Fashion", 175],
                ["Beauty", 135],
                ["Home", 92],
                ["Sports", 78],
              ].map(([category, height]) => (
                <div className="bar-item" key={category}>
                  <div style={{ height: `${height}px` }} />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-legend purple-only">
            <span className="purple-box" /> Revenue
          </div>
        </div>

        <div className="sales-card small-chart-card">
          <h3>Customer Retention Trend</h3>
          <p>Monthly retention rate percentage</p>

          <div className="retention-chart-area">
            <div className="retention-y-labels">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            <div className="retention-chart">
              <svg viewBox="0 0 285 240">
                <line x1="0" y1="10" x2="0" y2="205" />
                <line x1="0" y1="205" x2="260" y2="205" />

                <polyline points="0,88 52,76 104,68 156,54 208,42 260,34" />

                {[0, 52, 104, 156, 208, 260].map((x, i) => (
                  <circle
                    key={x}
                    cx={x}
                    cy={[88, 76, 68, 54, 42, 34][i]}
                    r="6"
                  />
                ))}
              </svg>

              <div className="retention-x-labels">
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
              </div>
            </div>
          </div>

          <div className="chart-legend green-only">
            <span className="green-box" /> Retention Rate (%)
          </div>
        </div>
      </section>

      <section className="sales-card sales-table-card">
        <h3>Detailed Performance Metrics</h3>
        <p>Comprehensive breakdown of key indicators</p>

        <table className="sales-data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>This Month</th>
              <th>Last Month</th>
              <th>Change</th>
            </tr>
          </thead>

          <tbody>
            {performanceMetrics.map(([metric, thisMonth, lastMonth, change]) => (
              <tr key={metric}>
                <td>{metric}</td>
                <td>{thisMonth}</td>
                <td>{lastMonth}</td>
                <td className="positive-change">{change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="sales-card sales-table-card">
        <h3>Top Buyer</h3>
        <p>Top Buyer per month</p>

        <table className="sales-data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Buyer Email</th>
              <th>Total Order</th>
              <th>Total Purchase</th>
            </tr>
          </thead>

          <tbody>
            {topBuyers.map(([rank, email, totalOrder, totalPurchase]) => (
              <tr key={email}>
                <td>{rank}</td>
                <td>{email}</td>
                <td>{totalOrder}</td>
                <td>{totalPurchase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default SalesInsights;