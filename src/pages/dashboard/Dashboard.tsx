import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../services/api";
import "./Dashboard.css";

type DashboardSummary = {
  total_sales: number;
  sales_growth: number;
  units_sold: number;
  units_sold_growth: number;
  average_order_value: number;
  average_order_value_growth: number;
  total_orders: number;
  total_products: number;
  total_platforms: number;
};

type SalesTrendItem = {
  tanggal: string;
  total_revenue: number;
  total_units_sold: number;
};

type PlatformPerformance = {
  id: number;
  nama_platform: string;
  total_revenue: number;
  total_units_sold: number;
  percentage: number;
};

type TopProduct = {
  id: number;
  nama_produk: string;
  sku: string;
  trend: string;
  nama_platform: string;
  total_revenue: number;
  total_units_sold: number;
};

type DashboardResponse = {
  message: string;
  summary: DashboardSummary;
  sales_trend: SalesTrendItem[];
  platform_performance: PlatformPerformance[];
  top_products: TopProduct[];
};

const emptySummary: DashboardSummary = {
  total_sales: 0,
  sales_growth: 0,
  units_sold: 0,
  units_sold_growth: 0,
  average_order_value: 0,
  average_order_value_growth: 0,
  total_orders: 0,
  total_products: 0,
  total_platforms: 0,
};

const platformColors = ["#ff6b35", "#4ecb71", "#1a1a1a", "#ea3ead"];

const platformLabelClasses = ["orange", "green-dot", "black", "pink"];
const pieNumberClasses = ["num-36", "num-24", "num-19", "num-21"];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("id-ID").format(Number(value || 0));
};

const formatPercent = (value: number) => {
  const sign = Number(value || 0) >= 0 ? "+" : "";
  return `${sign}${Number(value || 0).toFixed(1)}%`;
};

const formatDateLabel = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getPlatformBadgeClass = (platform: string) => {
  return platform.toLowerCase().replaceAll(" ", "-");
};

const getGrowthType = (trend: string) => {
  return trend.toLowerCase().includes("slow") ? "down" : "up";
};

const makeSalesChartPoints = (data: SalesTrendItem[]) => {
  if (data.length === 0) {
    return "";
  }

  const maxRevenue = Math.max(
    ...data.map((item) => Number(item.total_revenue || 0)),
    1
  );

  const step = data.length > 1 ? 265 / (data.length - 1) : 0;

  return data
    .map((item, index) => {
      const x = data.length > 1 ? 20 + index * step : 150;
      const y = 220 - (Number(item.total_revenue || 0) / maxRevenue) * 200;

      return `${x},${y}`;
    })
    .join(" ");
};

const makePieGradient = (platforms: PlatformPerformance[]) => {
  if (platforms.length === 0) {
    return "conic-gradient(#e5e7eb 0deg 360deg)";
  }

  let currentDegree = 0;

  const segments = platforms.slice(0, 4).map((platform, index) => {
    const percentage = Number(platform.percentage || 0);
    const degree = (percentage / 100) * 360;
    const start = currentDegree;
    const end = currentDegree + degree;

    currentDegree = end;

    return `${platformColors[index]} ${start}deg ${end}deg`;
  });

  if (currentDegree < 360) {
    segments.push(`#e5e7eb ${currentDegree}deg 360deg`);
  }

  return `conic-gradient(from -90deg, ${segments.join(", ")})`;
};

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [salesTrend, setSalesTrend] = useState<SalesTrendItem[]>([]);
  const [platformPerformance, setPlatformPerformance] = useState<
    PlatformPerformance[]
  >([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDashboard = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await apiRequest<DashboardResponse>("/dashboard");

      setSummary(response.summary || emptySummary);
      setSalesTrend(response.sales_trend || []);
      setPlatformPerformance(response.platform_performance || []);
      setTopProducts(response.top_products || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load dashboard"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const salesChartPoints = useMemo(() => {
    return makeSalesChartPoints(salesTrend);
  }, [salesTrend]);

  const pieGradient = useMemo(() => {
    return makePieGradient(platformPerformance);
  }, [platformPerformance]);

  const stats = [
    {
      title: "Total Sales",
      value: formatCurrency(summary.total_sales),
      change: `${formatPercent(summary.sales_growth)} from last period`,
      icon: "/assets/dashboard/icons/total-sales.svg",
      colorClass: summary.sales_growth >= 0 ? "green" : "red",
    },
    {
      title: "Sales Growth",
      value: `${Number(summary.sales_growth || 0).toFixed(1)}%`,
      change: "vs previous period",
      icon: "/assets/dashboard/icons/sales-growth.svg",
      colorClass: summary.sales_growth >= 0 ? "green" : "red",
    },
    {
      title: "Units Sold",
      value: formatNumber(summary.units_sold),
      change: `${formatPercent(summary.units_sold_growth)} from last period`,
      icon: "/assets/dashboard/icons/units-sold.svg",
      colorClass: summary.units_sold_growth >= 0 ? "green" : "red",
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(summary.average_order_value),
      change: `${formatPercent(summary.average_order_value_growth)} from avg`,
      icon: "/assets/dashboard/icons/avg-order-value.svg",
      colorClass: summary.average_order_value_growth >= 0 ? "green" : "red",
    },
  ];

  return (
    <div className="dashboard-page-content">
      <section className="dashboard-heading">
        <h2>Sales Overview</h2>
        <p>Your complete sales performance across all platforms</p>
      </section>

      {errorMessage && (
        <p style={{ color: "#b42318", marginTop: "18px" }}>{errorMessage}</p>
      )}

      <section className="stats-row">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <div className="stat-title">
              <span>{stat.title}</span>
              <img src={stat.icon} alt={stat.title} />
            </div>

            <h3>{isLoading ? "..." : stat.value}</h3>
            <p className={stat.colorClass}>{isLoading ? "Loading" : stat.change}</p>
          </div>
        ))}
      </section>

      <section className="charts-row">
        <div className="dashboard-card chart-card">
          <h3>Sales Trend (Last 30 Days)</h3>
          <p>Daily revenue performance</p>

          <div className="sales-chart-box">
            <div className="y-labels">
              <span>High</span>
              <span>Mid</span>
              <span>Low</span>
              <span>0</span>
            </div>

            <svg className="line-chart" viewBox="0 0 310 260">
              <line x1="20" y1="10" x2="20" y2="220" />
              <line x1="20" y1="220" x2="295" y2="220" />

              {salesTrend.length > 0 && (
                <>
                  <polyline points={salesChartPoints} />

                  {salesChartPoints.split(" ").map((point) => {
                    const [x, y] = point.split(",");

                    return <circle key={point} cx={x} cy={y} r="4" />;
                  })}
                </>
              )}
            </svg>

            <div className="x-labels">
              {salesTrend.slice(0, 6).map((item) => (
                <span key={item.tanggal}>{formatDateLabel(item.tanggal)}</span>
              ))}

              {salesTrend.length === 0 && (
                <>
                  <span>-</span>
                  <span>-</span>
                  <span>-</span>
                </>
              )}
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
            <div className="pie-chart" style={{ background: pieGradient }} />

            {platformPerformance.slice(0, 4).map((platform, index) => (
              <span
                key={platform.id}
                className={`pie-num ${pieNumberClasses[index]}`}
                style={{ color: platformColors[index] }}
              >
                {Number(platform.percentage || 0).toFixed(0)}%
              </span>
            ))}
          </div>

          <div className="pie-legend">
            {platformPerformance.slice(0, 4).map((platform, index) => (
              <span
                key={platform.id}
                className={platformLabelClasses[index]}
              >
                {platform.nama_platform}
              </span>
            ))}

            {platformPerformance.length === 0 && (
              <span className="black">No platform data</span>
            )}
          </div>
        </div>
      </section>

      <section className="dashboard-card products-card">
        <h3>Top 5 Best-Selling Products</h3>
        <p>Highest performing items this month</p>

        <div className="product-list">
          {topProducts.length === 0 && (
            <p style={{ margin: 0 }}>No product sales data found.</p>
          )}

          {topProducts.map((product, index) => {
            const trendType = getGrowthType(product.trend);

            return (
              <div className="product-item" key={`${product.id}-${product.nama_platform}`}>
                <div className="rank-box">#{index + 1}</div>

                <div className="product-detail">
                  <h4>{product.nama_produk}</h4>
                  <div>
                    <span
                      className={`badge ${getPlatformBadgeClass(
                        product.nama_platform
                      )}`}
                    >
                      {product.nama_platform}
                    </span>
                    <small>
                      {formatNumber(product.total_units_sold)} units •{" "}
                      {formatCurrency(product.total_revenue)}
                    </small>
                  </div>
                </div>

                <div className={`growth ${trendType}`}>
                  {trendType === "up" ? "↑" : "↓"} {product.trend}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;