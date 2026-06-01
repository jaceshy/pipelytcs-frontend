import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./SalesInsights.css";

type SalesInsightsProps = {
  mode?: "admin" | "team";
};

type DropdownType = "platform" | "period" | null;

type SalesSummary = {
  average_order_value: number;
  customer_retention_rate: number;
  repeat_purchase_rate: number;
  growth_rate: number;
  total_revenue: number;
  total_units_sold: number;
  total_orders: number;
  unique_customers: number;
  returning_customers: number;
};

type SalesTrendItem = {
  tanggal: string;
  total_revenue: number;
  total_units_sold: number;
};

type CategoryRevenueItem = {
  category: string;
  total_revenue: number;
};

type PerformanceMetric = {
  metric: string;
  this_period: number;
  last_period: number;
  change: number;
  type: "currency" | "number";
};

type TopBuyer = {
  rank: number;
  buyer_email: string;
  total_order: number;
  total_units: number;
  total_purchase: number;
};

type PlatformInsight = {
  id: number;
  nama_platform: string;
  total_revenue: number;
  total_units_sold: number;
};

type SalesInsightResponse = {
  message: string;
  summary: SalesSummary;
  sales_trend: SalesTrendItem[];
  category_revenue: CategoryRevenueItem[];
  platform_insight: PlatformInsight[];
  performance_metrics: PerformanceMetric[];
  top_buyers: TopBuyer[];
};

const platformOptions = [
  { label: "All Platforms", value: "all" },
  { label: "Shopee", value: "1" },
  { label: "Tokopedia", value: "2" },
  { label: "TikTok Shop", value: "3" },
  { label: "Instagram", value: "4" },
];

const periodOptions = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "Last 12 Months", value: "365" },
];

const emptySummary: SalesSummary = {
  average_order_value: 0,
  customer_retention_rate: 0,
  repeat_purchase_rate: 0,
  growth_rate: 0,
  total_revenue: 0,
  total_units_sold: 0,
  total_orders: 0,
  unique_customers: 0,
  returning_customers: 0,
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatPercent = (value: number) => {
  return `${Number(value || 0).toFixed(1)}%`;
};

const formatChange = (value: number) => {
  const sign = Number(value || 0) >= 0 ? "+" : "";
  return `${sign}${Number(value || 0).toFixed(1)}%`;
};

const formatDateLabel = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatMetricValue = (value: number, type: "currency" | "number") => {
  if (type === "currency") {
    return formatCurrency(value);
  }

  return new Intl.NumberFormat("id-ID").format(Number(value || 0));
};

const makeChartPoints = (
  data: SalesTrendItem[],
  key: "total_revenue" | "total_units_sold"
) => {
  if (data.length === 0) {
    return "";
  }

  const maxValue = Math.max(...data.map((item) => Number(item[key] || 0)), 1);
  const step = data.length > 1 ? 640 / (data.length - 1) : 0;

  return data
    .map((item, index) => {
      const x = data.length > 1 ? 60 + index * step : 380;
      const y = 260 - (Number(item[key] || 0) / maxValue) * 230;

      return `${x},${y}`;
    })
    .join(" ");
};

const SalesInsights = ({ mode = "admin" }: SalesInsightsProps) => {
  const navigate = useNavigate();
  const isTeam = mode === "team";

  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[1]);
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);

  const [summary, setSummary] = useState<SalesSummary>(emptySummary);
  const [salesTrend, setSalesTrend] = useState<SalesTrendItem[]>([]);
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenueItem[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [topBuyers, setTopBuyers] = useState<TopBuyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSalesInsights = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const query = new URLSearchParams({
        period_days: selectedPeriod.value,
        platform_id: selectedPlatform.value,
      });

      const response = await apiRequest<SalesInsightResponse>(
        `/sales-insights?${query.toString()}`
      );

      setSummary(response.summary || emptySummary);
      setSalesTrend(response.sales_trend || []);
      setCategoryRevenue(response.category_revenue || []);
      setPerformanceMetrics(response.performance_metrics || []);
      setTopBuyers(response.top_buyers || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load sales insights"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesInsights();
  }, [selectedPlatform.value, selectedPeriod.value]);

  const stats = [
    {
      title: "Average Order Value",
      value: formatCurrency(summary.average_order_value),
      change: formatChange(summary.growth_rate),
      icon: "/assets/dashboard/icons/total-sales.svg",
    },
    {
      title: "Customer Retention",
      value: formatPercent(summary.customer_retention_rate),
      change: `${summary.returning_customers} returning`,
      icon: "/assets/dashboard/icons/customer-retention.svg",
    },
    {
      title: "Repeat Purchase Rate",
      value: formatPercent(summary.repeat_purchase_rate),
      change: `${summary.unique_customers} customers`,
      icon: "/assets/dashboard/icons/repeat-purchase-rate.svg",
    },
    {
      title: "Growth Rate",
      value: formatPercent(summary.growth_rate),
      change: selectedPeriod.label,
      icon: "/assets/dashboard/icons/sales-growth.svg",
    },
  ];

  const revenuePoints = useMemo(() => {
    return makeChartPoints(salesTrend, "total_revenue");
  }, [salesTrend]);

  const unitsPoints = useMemo(() => {
    return makeChartPoints(salesTrend, "total_units_sold");
  }, [salesTrend]);

  const maxCategoryRevenue = Math.max(
    ...categoryRevenue.map((item) => Number(item.total_revenue || 0)),
    1
  );

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
            <span>{selectedPlatform.label}</span>
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
                  key={option.value}
                  type="button"
                  className={`custom-dropdown-option ${
                    selectedPlatform.value === option.value ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedPlatform(option);
                    setOpenDropdown(null);
                  }}
                >
                  {option.label}
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
            <span>{selectedPeriod.label}</span>
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
                  key={option.value}
                  type="button"
                  className={`custom-dropdown-option ${
                    selectedPeriod.value === option.value ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedPeriod(option);
                    setOpenDropdown(null);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <p style={{ color: "#b42318", marginTop: "18px" }}>{errorMessage}</p>
      )}

      <section className="sales-stats">
        {stats.map((stat) => (
          <div className="sales-stat-card" key={stat.title}>
            <div className="sales-stat-top">
              <p>{stat.title}</p>
              <img className="sales-stat-icon" src={stat.icon} alt="" />
            </div>

            <h3>{isLoading ? "..." : stat.value}</h3>
            <small>{isLoading ? "Loading" : stat.change}</small>
          </div>
        ))}
      </section>

      <section className="sales-card sales-main-chart">
        <div className="sales-card-header">
          <div>
            <h3>Sales & Units Performance</h3>
            <p>Revenue and quantity from selected period</p>
          </div>

          <button className="week-btn" type="button">
            <img
              className="week-btn-icon"
              src="/assets/dashboard/icons/calendar.svg"
              alt=""
            />
            <span>{selectedPeriod.label}</span>
          </button>
        </div>

        <div className="line-chart-box">
          <svg viewBox="0 0 720 310">
            <line x1="60" y1="10" x2="60" y2="260" />
            <line x1="60" y1="260" x2="700" y2="260" />

            {salesTrend.length > 0 && (
              <>
                <polyline points={revenuePoints} />
                <polyline className="units-line" points={unitsPoints} />

                {salesTrend.map((item, index) => {
                  const revenuePoint = revenuePoints.split(" ")[index]?.split(",");
                  const unitsPoint = unitsPoints.split(" ")[index]?.split(",");

                  return (
                    <g key={item.tanggal}>
                      {revenuePoint && (
                        <circle cx={revenuePoint[0]} cy={revenuePoint[1]} r="6" />
                      )}

                      {unitsPoint && (
                        <circle
                          className="units-dot"
                          cx={unitsPoint[0]}
                          cy={unitsPoint[1]}
                          r="6"
                        />
                      )}
                    </g>
                  );
                })}
              </>
            )}

            <text x="0" y="15">High</text>
            <text x="0" y="135">Mid</text>
            <text x="40" y="266">0</text>

            {salesTrend.map((item, index) => {
              const step = salesTrend.length > 1 ? 640 / (salesTrend.length - 1) : 0;
              const x = salesTrend.length > 1 ? 40 + index * step : 350;

              return (
                <text key={item.tanggal} x={x} y="295">
                  {formatDateLabel(item.tanggal)}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="chart-legend">
          <span className="blue-box" />
          <span>Revenue</span>
          <span className="purple-box" />
          <span>Units Sold</span>
        </div>
      </section>

      <section className="sales-two-columns">
        <div className="sales-card small-chart-card">
          <h3>Revenue by Category</h3>
          <p>Top performing product categories</p>

          <div className="bar-chart-area">
            <div className="bar-y-labels">
              <span>High</span>
              <span>Mid</span>
              <span>Low</span>
              <span>0</span>
            </div>

            <div className="bar-chart">
              {categoryRevenue.length === 0 && (
                <p style={{ margin: "0 0 20px 10px" }}>No category data</p>
              )}

              {categoryRevenue.map((item) => {
                const height = Math.max(
                  (Number(item.total_revenue || 0) / maxCategoryRevenue) * 250,
                  20
                );

                return (
                  <div className="bar-item" key={item.category}>
                    <div style={{ height }} />
                    <span>{item.category}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="chart-legend purple-only">
            <span className="purple-box" />
            <span>Revenue</span>
          </div>
        </div>

        <div className="sales-card small-chart-card">
          <h3>Customer Summary</h3>
          <p>Retention and repeat purchase overview</p>

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
                <line x1="35" y1="5" x2="35" y2="210" />
                <line x1="35" y1="210" x2="280" y2="210" />

                <polyline
                  points={`35,${210 - summary.customer_retention_rate * 2} 150,${
                    210 - summary.repeat_purchase_rate * 2
                  } 270,${210 - summary.growth_rate * 2}`}
                />

                <circle cx="35" cy={210 - summary.customer_retention_rate * 2} r="6" />
                <circle cx="150" cy={210 - summary.repeat_purchase_rate * 2} r="6" />
                <circle cx="270" cy={210 - summary.growth_rate * 2} r="6" />
              </svg>

              <div className="retention-x-labels">
                <span>Retention</span>
                <span>Repeat</span>
                <span>Growth</span>
              </div>
            </div>
          </div>

          <div className="chart-legend green-only">
            <span className="green-box" />
            <span>Percentage</span>
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
              <th>This Period</th>
              <th>Last Period</th>
              <th>Change</th>
            </tr>
          </thead>

          <tbody>
            {performanceMetrics.map((row) => (
              <tr key={row.metric}>
                <td>{row.metric}</td>
                <td>{formatMetricValue(row.this_period, row.type)}</td>
                <td>{formatMetricValue(row.last_period, row.type)}</td>
                <td className="positive-change">{formatChange(row.change)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="sales-card sales-table-card">
        <h3>Top Buyer</h3>
        <p>Top buyer per selected period</p>

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
            {topBuyers.length === 0 && (
              <tr>
                <td colSpan={4}>No buyer data found.</td>
              </tr>
            )}

            {topBuyers.map((buyer) => (
              <tr key={buyer.buyer_email}>
                <td>{buyer.rank}</td>
                <td>{buyer.buyer_email}</td>
                <td>{buyer.total_order}</td>
                <td>{formatCurrency(buyer.total_purchase)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default SalesInsights;