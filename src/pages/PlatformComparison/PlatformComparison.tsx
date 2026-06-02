import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../services/api";
import "./PlatformComparison.css";

type PlatformMetric = {
  id: number;
  nama_platform: string;
  total_revenue: number;
  total_units_sold: number;
  total_orders: number;
  aov: number;
  growth_rate: number;
  estimated_traffic: number;
  conversion_rate: number;
  fee_rate: number;
  fee_total: number;
};

type DailyRevenue = {
  tanggal: string;
  platform_id: number;
  nama_platform: string;
  total_revenue: number;
  total_units_sold: number;
};

type PlatformComparisonResponse = {
  message: string;
  summary: {
    best_platform_today: PlatformMetric | null;
    highest_conversion: PlatformMetric | null;
    best_growth_rate: PlatformMetric | null;
  };
  platform_metrics: PlatformMetric[];
  daily_revenue: DailyRevenue[];
};

// const platformColors: Record<string, string> = {
//   shopee: "#ff6b35",
//   tokopedia: "#4ecb71",
//   tiktok: "#000000",
//   instagram: "#ea3ead",
// };

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

const getPlatformClass = (platformName?: string) => {
  const name = (platformName || "").toLowerCase();

  if (name.includes("tokopedia")) return "tokopedia";
  if (name.includes("tiktok")) return "tiktok";
  if (name.includes("instagram")) return "instagram";
  return "shopee";
};

const makeLinePoints = (
  platformId: number,
  dates: string[],
  dailyRevenue: DailyRevenue[],
  maxRevenue: number
) => {
  if (dates.length === 0) {
    return "";
  }

  const step = dates.length > 1 ? 690 / (dates.length - 1) : 0;

  return dates
    .map((date, index) => {
      const item = dailyRevenue.find(
        (row) => row.platform_id === platformId && row.tanggal === date
      );

      const value = Number(item?.total_revenue || 0);
      const x = dates.length > 1 ? 70 + index * step : 400;
      const y = 245 - (value / maxRevenue) * 210;

      return `${x},${y}`;
    })
    .join(" ");
};

const PlatformComparison = () => {
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetric[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [summary, setSummary] = useState<
    PlatformComparisonResponse["summary"] | null
  >(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPlatformComparison = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await apiRequest<PlatformComparisonResponse>("/platforms");

      setSummary(response.summary);
      setPlatformMetrics(response.platform_metrics || []);
      setDailyRevenue(response.daily_revenue || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load platform comparison"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformComparison();
  }, []);

  const dates = useMemo(() => {
    return Array.from(new Set(dailyRevenue.map((item) => item.tanggal))).sort();
  }, [dailyRevenue]);

  const maxRevenue = useMemo(() => {
    return Math.max(
      ...dailyRevenue.map((item) => Number(item.total_revenue || 0)),
      1
    );
  }, [dailyRevenue]);

  const maxFee = Math.max(
    ...platformMetrics.map((item) => Number(item.fee_total || 0)),
    1
  );

  const maxTraffic = Math.max(
    ...platformMetrics.map((item) => Number(item.estimated_traffic || 0)),
    1
  );

  const bestPlatform = summary?.best_platform_today;
  const highestConversion = summary?.highest_conversion;
  const bestGrowth = summary?.best_growth_rate;

  return (
    <div className="platform-comparison-page">
      <section className="pc-heading">
        <h2>Platform Comparison</h2>
        <p>Compare performance across Shopee, Tokopedia, TikTok Shop, and Instagram</p>
      </section>

      {errorMessage && (
        <p style={{ color: "#b42318", marginTop: "18px" }}>{errorMessage}</p>
      )}

      <section className="pc-summary-row">
        <div className="pc-summary-card">
          <div className="pc-summary-title">
            <div className="pc-summary-icon-box">
              <img src="/assets/dashboard/icons/platform-comparison.svg" alt="" />
            </div>
            <span>Best Platform Today</span>
          </div>

          <span
            className={`pc-platform-badge ${getPlatformClass(
              bestPlatform?.nama_platform
            )}`}
          >
            {isLoading ? "..." : bestPlatform?.nama_platform || "No Data"}
          </span>

          <h3>{formatCurrency(Number(bestPlatform?.total_revenue || 0))}</h3>
          <p>Daily Revenue</p>
        </div>

        <div className="pc-summary-card">
          <div className="pc-summary-title">
            <div className="pc-summary-icon-box">
              <img src="/assets/dashboard/icons/customer-retention.svg" alt="" />
            </div>
            <span>Highest Conversion</span>
          </div>

          <span
            className={`pc-platform-badge ${getPlatformClass(
              highestConversion?.nama_platform
            )}`}
          >
            {isLoading ? "..." : highestConversion?.nama_platform || "No Data"}
          </span>

          <h3>{Number(highestConversion?.conversion_rate || 0).toFixed(1)}%</h3>
          <p>Conversion Rate</p>
        </div>

        <div className="pc-summary-card">
          <div className="pc-summary-title">
            <div className="pc-summary-icon-box">
              <img src="/assets/dashboard/icons/sales-growth.svg" alt="" />
            </div>
            <span>Best Growth Rate</span>
          </div>

          <span
            className={`pc-platform-badge ${getPlatformClass(
              bestGrowth?.nama_platform
            )}`}
          >
            {isLoading ? "..." : bestGrowth?.nama_platform || "No Data"}
          </span>

          <h3>{formatPercent(Number(bestGrowth?.growth_rate || 0))}</h3>
          <p>Monthly Growth</p>
        </div>
      </section>

      <section className="pc-card pc-revenue-card">
        <div className="pc-card-heading">
          <h3>Revenue Comparison (Last 30 Days)</h3>
          <p>Daily revenue trends across all platforms</p>
        </div>

        <div className="pc-line-chart-wrap">
          <svg className="pc-line-chart" viewBox="0 0 809 285">
            <line x1="70" y1="15" x2="70" y2="245" />
            <line x1="70" y1="245" x2="780" y2="245" />

            <text x="10" y="25">High</text>
            <text x="10" y="130">Mid</text>
            <text x="45" y="250">0</text>

            {dates.map((date, index) => {
              const step = dates.length > 1 ? 690 / (dates.length - 1) : 0;
              const x = dates.length > 1 ? 55 + index * step : 380;

              if (index % Math.ceil(Math.max(dates.length / 4, 1)) !== 0) {
                return null;
              }

              return (
                <text key={date} x={x} y="280">
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </text>
              );
            })}

            {platformMetrics.map((platform) => {
              const platformClass = getPlatformClass(platform.nama_platform);
              const points = makeLinePoints(
                platform.id,
                dates,
                dailyRevenue,
                maxRevenue
              );

              if (!points) {
                return null;
              }

              return (
                <g key={platform.id}>
                  <polyline className={`line-${platformClass}`} points={points} />

                  {points.split(" ").map((point) => {
                    const [x, y] = point.split(",");

                    return (
                      <circle
                        key={`${platform.id}-${point}`}
                        className={`line-${platformClass}`}
                        cx={x}
                        cy={y}
                        r="5"
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="pc-chart-legend pc-main-legend">
          {platformMetrics.map((platform) => (
            <span
              className={`legend-item ${getPlatformClass(platform.nama_platform)}`}
              key={platform.id}
            >
              <i />
              {platform.nama_platform}
            </span>
          ))}
        </div>
      </section>

      <section className="pc-two-columns">
        <div className="pc-card pc-small-card">
          <div className="pc-card-heading">
            <h3>Platform Fees Comparison</h3>
            <p>Estimated fees charged by each platform</p>
          </div>

          <div className="pc-bar-chart-area fee-chart">
            <div className="pc-bar-y-labels">
              <span>High</span>
              <span>Mid</span>
              <span>Low</span>
              <span>0</span>
            </div>

            <div className="pc-bar-chart">
              {platformMetrics.map((platform) => {
                const height = Math.max(
                  (Number(platform.fee_total || 0) / maxFee) * 240,
                  platform.fee_total > 0 ? 20 : 0
                );

                return (
                  <div className="pc-bar-item" key={platform.id}>
                    <div className="fee-bar" style={{ height }} />
                    <span>{platform.nama_platform}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pc-chart-legend small-legend">
            <span className="legend-item fees">
              <i />
              Fees
            </span>
          </div>
        </div>

        <div className="pc-card pc-small-card">
          <div className="pc-card-heading">
            <h3>Traffic vs Revenue Analysis</h3>
            <p>Estimated traffic proxy by platform</p>
          </div>

          <div className="pc-bar-chart-area traffic-chart">
            <div className="pc-bar-y-labels traffic-labels">
              <span>High</span>
              <span>Mid</span>
              <span>Low</span>
              <span>0</span>
            </div>

            <div className="pc-bar-chart">
              {platformMetrics.map((platform) => {
                const height = Math.max(
                  (Number(platform.estimated_traffic || 0) / maxTraffic) * 240,
                  platform.estimated_traffic > 0 ? 20 : 0
                );

                return (
                  <div className="pc-bar-item traffic-item" key={platform.id}>
                    <div className="traffic-bar" style={{ height }} />
                    <span>{platform.nama_platform}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pc-chart-legend small-legend">
            <span className="legend-item revenue">
              <i />
              Traffic
            </span>
          </div>
        </div>
      </section>

      <section className="pc-card pc-table-card">
        <div className="pc-card-heading">
          <h3>Detailed Platform Metrics</h3>
          <p>Complete comparison of all key metrics</p>
        </div>

        <table className="pc-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Revenue</th>
              <th>Orders</th>
              <th>AOV</th>
              <th>Growth</th>
            </tr>
          </thead>

          <tbody>
            {platformMetrics.length === 0 && (
              <tr>
                <td colSpan={5}>No platform data found.</td>
              </tr>
            )}

            {platformMetrics.map((platform) => (
              <tr key={platform.id}>
                <td>
                  <span
                    className={`pc-table-badge ${getPlatformClass(
                      platform.nama_platform
                    )}`}
                  >
                    {platform.nama_platform}
                  </span>
                </td>
                <td>{formatCurrency(platform.total_revenue)}</td>
                <td>{formatNumber(platform.total_orders)}</td>
                <td>{formatCurrency(platform.aov)}</td>
                <td className="pc-growth">{formatPercent(platform.growth_rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PlatformComparison;