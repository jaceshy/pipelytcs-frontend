import "./PlatformComparison.css";

const topCards = [
  {
    title: "Best Platform Today",
    badge: "Shopee",
    value: "Rp 45,000,000",
    subtitle: "Daily Revenue",
    icon: "/assets/dashboard/icons/trophy.svg",
    badgeClass: "shopee",
  },
  {
    title: "Highest Conversion",
    badge: "TikTok Shop",
    value: "5.6%",
    subtitle: "Conversion Rate",
    icon: "/assets/dashboard/icons/award.svg",
    badgeClass: "tiktok",
  },
  {
    title: "Best Growth Rate",
    badge: "TikTok Shop",
    value: "+28.4%",
    subtitle: "Monthly Growth",
    icon: "/assets/dashboard/icons/five-ellipses.svg",
    badgeClass: "tiktok",
  },
];

const revenueSeries = [
  {
    name: "Shopee",
    className: "line-shopee",
    points: [
      [70, 110],
      [283, 100],
      [515, 86],
      [748, 76],
    ],
  },
  {
    name: "Tokopedia",
    className: "line-tokopedia",
    points: [
      [70, 135],
      [283, 124],
      [515, 132],
      [748, 116],
    ],
  },
  {
    name: "TikTok Shop",
    className: "line-tiktok",
    points: [
      [70, 170],
      [283, 158],
      [515, 147],
      [748, 137],
    ],
  },
  {
    name: "Instagram",
    className: "line-instagram",
    points: [
      [70, 198],
      [283, 188],
      [515, 179],
      [748, 168],
    ],
  },
];

const feeBars = [
  ["Shopee", 215],
  ["Tokopedia", 157],
  ["TikTok", 115],
  ["Instagram", 88],
];

const trafficBars = [
  ["Shopee", 246],
  ["Tokopedia", 176],
  ["TikTok", 135],
  ["Instagram", 105],
];

const platformMetrics = [
  {
    platform: "Shopee",
    revenue: "Rp 145,000,000",
    orders: "487",
    aov: "Rp 298,000",
    growth: "+12.3%",
    badgeClass: "shopee",
  },
  {
    platform: "TikTok Shop",
    revenue: "Rp 76,000,000",
    orders: "267",
    aov: "Rp 285,000",
    growth: "+28.4%",
    badgeClass: "tiktok",
  },
  {
    platform: "Instagram",
    revenue: "Rp 54,000,000",
    orders: "171",
    aov: "Rp 316,000",
    growth: "+15.2%",
    badgeClass: "instagram",
  },
  {
    platform: "Tokopedia",
    revenue: "Rp 98,000,000",
    orders: "312",
    aov: "Rp 314,000",
    growth: "+8.7%",
    badgeClass: "tokopedia",
  },
];

const PlatformComparison = () => {
  return (
    <div className="platform-comparison-page">
      <section className="pc-heading">
        <h2>Platform Comparison</h2>
        <p>Compare performance across Shopee, Tokopedia, TikTok Shop, and Instagram</p>
      </section>

      <section className="pc-summary-row">
        {topCards.map((card) => (
          <div className="pc-summary-card" key={card.title}>
            <div className="pc-summary-title">
              <div className="pc-summary-icon-box">
                <img src={card.icon} alt="" />
              </div>
              <span>{card.title}</span>
            </div>

            <span className={`pc-platform-badge ${card.badgeClass}`}>
              {card.badge}
            </span>

            <h3>{card.value}</h3>
            <p>{card.subtitle}</p>
          </div>
        ))}
      </section>

      <section className="pc-card pc-revenue-card">
        <div className="pc-card-heading">
          <h3>Revenue Comparison (Last 4 Weeks)</h3>
          <p>Weekly revenue trends across all platforms</p>
        </div>

        <div className="pc-line-chart-wrap">
          <svg className="pc-line-chart" viewBox="0 0 780 285">
            <text x="0" y="16">60000</text>
            <text x="0" y="76">45000</text>
            <text x="0" y="136">30000</text>
            <text x="4" y="196">15000</text>
            <text x="37" y="256">0</text>

            <line x1="62" y1="10" x2="62" y2="257" />
            <line x1="62" y1="257" x2="750" y2="257" />

            <line x1="58" y1="70" x2="66" y2="70" />
            <line x1="58" y1="130" x2="66" y2="130" />
            <line x1="58" y1="190" x2="66" y2="190" />
            <line x1="58" y1="10" x2="66" y2="10" />

            <text x="42" y="282">Week 1</text>
            <text x="254" y="282">Week 2</text>
            <text x="486" y="282">Week 3</text>
            <text x="718" y="282">Week 4</text>

            {revenueSeries.map((series) => (
              <g key={series.name}>
                <polyline
                  className={series.className}
                  points={series.points.map(([x, y]) => `${x},${y}`).join(" ")}
                />

                {series.points.map(([x, y]) => (
                  <circle
                    key={`${series.name}-${x}`}
                    className={series.className}
                    cx={x}
                    cy={y}
                    r="7"
                  />
                ))}
              </g>
            ))}
          </svg>
        </div>

        <div className="pc-chart-legend pc-main-legend">
          <span className="legend-item shopee">
            <i /> Shopee
          </span>
          <span className="legend-item tokopedia">
            <i /> Tokopedia
          </span>
          <span className="legend-item tiktok">
            <i /> TikTok Shop
          </span>
          <span className="legend-item instagram">
            <i /> Instagram
          </span>
        </div>
      </section>

      <section className="pc-two-columns">
        <div className="pc-card pc-small-card">
          <div className="pc-card-heading">
            <h3>Platform Fees Comparison</h3>
            <p>Total fees charged by each platform</p>
          </div>

          <div className="pc-bar-chart-area fee-chart">
            <div className="pc-bar-y-labels">
              <span>8000</span>
              <span>6000</span>
              <span>4000</span>
              <span>2000</span>
              <span>0</span>
            </div>

            <div className="pc-bar-chart">
              {feeBars.map(([label, height]) => (
                <div className="pc-bar-item" key={label}>
                  <div className="fee-bar" style={{ height: `${height}px` }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pc-chart-legend small-legend fees">
            <span className="legend-item fees">
              <i /> Fees
            </span>
          </div>
        </div>

        <div className="pc-card pc-small-card traffic-card">
          <div className="pc-card-heading">
            <h3>Traffic vs Revenue Analysis</h3>
            <p>Comparing visitor traffic and generated revenue</p>
          </div>

          <div className="pc-bar-chart-area traffic-chart">
            <div className="pc-bar-y-labels traffic-labels">
              <span>160000</span>
              <span>120000</span>
              <span>80000</span>
              <span>4000</span>
              <span>0</span>
            </div>

            <div className="pc-bar-chart">
              {trafficBars.map(([label, height]) => (
                <div className="pc-bar-item traffic-item" key={label}>
                  <div className="traffic-bar" style={{ height: `${height}px` }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pc-chart-legend small-legend revenue">
            <span className="legend-item revenue">
              <i /> Revenue
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
            {platformMetrics.map((row) => (
              <tr key={row.platform}>
                <td>
                  <span className={`pc-table-badge ${row.badgeClass}`}>
                    {row.platform}
                  </span>
                </td>
                <td>{row.revenue}</td>
                <td>{row.orders}</td>
                <td>{row.aov}</td>
                <td className="pc-growth">{row.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PlatformComparison;