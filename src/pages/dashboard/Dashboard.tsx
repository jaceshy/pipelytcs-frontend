import { useEffect, useState } from "react";
import "./Dashboard.css";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  TrendingUp,
  Box,
  Settings,
  Globe,
  ChevronDown,
  DollarSign,
  Moon,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const menuItems = [
  { labelKey: "dashboard", icon: <LayoutDashboard size={20} />, active: true },
  { labelKey: "salesInsights", icon: <TrendingUp size={20} /> },
  { labelKey: "platformComparison", icon: <Box size={20} /> },
  { labelKey: "productAnalytics", icon: <Box size={20} /> },
  { labelKey: "settings", icon: <Settings size={20} /> },
];

const stats = [
  {
    titleKey: "totalSales",
    value: formatRupiah(404000),
    noteKey: "totalSalesNote",
    noteClass: "green",
    icon: <DollarSign size={14} strokeWidth={2.2} />,
  },
  {
    titleKey: "salesGrowth",
    value: "18.4%",
    noteKey: "salesGrowthNote",
    noteClass: "green",
    icon: <TrendingUp size={14} strokeWidth={2.2} />,
  },
  {
    titleKey: "unitsSold",
    value: "1,237",
    noteKey: "unitsSoldNote",
    noteClass: "green",
    icon: <Box size={14} strokeWidth={2.2} />,
  },
  {
    titleKey: "avgOrderValue",
    value: formatRupiah(327),
    noteKey: "avgOrderValueNote",
    noteClass: "red",
    icon: <Settings size={14} strokeWidth={2.2} />,
  },
];

const salesTrendData = [
  { date: "Dec 1", sales: 41000 },
  { date: "Dec 5", sales: 50000 },
  { date: "Dec 10", sales: 46000 },
  { date: "Dec 15", sales: 61000 },
  { date: "Dec 20", sales: 58000 },
  { date: "Dec 25", sales: 74000 },
  { date: "Dec 30", sales: 69000 },
];

const revenueData = [
  { name: "Shopee", value: 36 },
  { name: "Tokopedia", value: 24 },
  { name: "Instagram", value: 13 },
  { name: "Website", value: 8 },
  { name: "TikTok Shop", value: 19 },
];

const revenueColors = ["#FF6B35", "#4ECB71", "#E94560", "#3A7DFF", "#1A1A1A"];

const peakHoursData = [
  { time: "9-12", orders: 2500 },
  { time: "12-15", orders: 3600 },
  { time: "15-18", orders: 4400 },
  { time: "18-21", orders: 6900 },
  { time: "21-24", orders: 3200 },
];

const products = [
  {
    rank: "#1",
    name: "Wireless Earbuds Pro",
    platform: "Shopee",
    platformClass: "shopee",
    detail: `342 units • ${formatRupiah(68400)}`,
    growth: "+15%",
    up: true,
  },
  {
    rank: "#2",
    name: "Smart Watch Series 5",
    platform: "Tokopedia",
    platformClass: "tokopedia",
    detail: `287 units • ${formatRupiah(143500)}`,
    growth: "+15%",
    up: true,
  },
  {
    rank: "#3",
    name: "Running Shoes Premium",
    platform: "TikTok Shop",
    platformClass: "tiktok",
    detail: `234 units • ${formatRupiah(46800)}`,
    growth: "+15%",
    up: true,
  },
  {
    rank: "#4",
    name: "Laptop Stand Adjustable",
    platform: "Instagram",
    platformClass: "instagram",
    detail: `198 units • ${formatRupiah(19800)}`,
    growth: "-5%",
    up: false,
  },
  {
    rank: "#5",
    name: "USB-C Hub 7-in-1",
    platform: "Shopee",
    platformClass: "shopee",
    detail: `176 units • ${formatRupiah(17600)}`,
    growth: "+15%",
    up: true,
  },
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    i18n.changeLanguage("en");
  }, [i18n]);

  return (
    <div className="dashboard-page">
      <header className="dashboard-navbar">
        <div className="brand">Pipelytcs</div>

        <div className="navbar-actions">
          <div className="lang-switch">
            <button
              type="button"
              className="lang-button"
              onClick={() => setLangOpen((v) => !v)}
            >
              <Globe size={18} />
              <span>{i18n.language === "id" ? "Indonesia" : "English"}</span>
              <ChevronDown size={14} />
            </button>

            {langOpen && (
              <div className="lang-menu">
                <button
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage("en");
                    setLangOpen(false);
                  }}
                >
                  English
                </button>

                <button
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage("id");
                    setLangOpen(false);
                  }}
                >
                  Indonesia
                </button>
              </div>
            )}
          </div>
          <Moon size={18} />
          <Bell size={18} />

          <div className="admin-box">
            <div className="avatar-wrap">
              <img src="/ian.jpg" alt="Admin" className="avatar-img" />
              <span className="online-dot" />
              </div>
            <strong>Admin</strong>
          </div>
        </div>
      </header>

      <aside className="dashboard-sidebar">
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <div
            key={item.labelKey}
            className={`sidebar-item ${item.active ? "active" : ""}`}
            >
              {item.icon}
              <span>{t(item.labelKey)}</span>
              </div>
            ))}
            </nav>
            </aside>

      <main className="dashboard-main">
        <section className="overview-header">
          <h1>{t("salesOverview")}</h1>
          <p>{t("salesOverviewDesc")}</p>
        </section>

        <section className="stats-grid">
          {stats.map((item) => (
            <article key={item.titleKey} className="stat-card">
              <div className="stat-title-row">
                <h3>{t(item.titleKey)}</h3>
                <div className="stat-icon">{item.icon}</div>
              </div>
              <div className="stat-value">{item.value}</div>
              <div className={`stat-note ${item.noteClass}`}>{t(item.noteKey)}</div>
            </article>
          ))}
        </section>

        <section className="charts-row">
          <article className="panel panel-large">
            <div className="panel-heading">
              <h2>{t("salesTrendTitle")}</h2>
              <p>{t("salesTrendDesc")}</p>
            </div>

            <div className="chart-box line-box">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.12)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(0,0,0,0.45)" }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(0,0,0,0.45)" }}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value) => [formatRupiah(Number(value)), "Sales"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.15)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#695DE8"
                    strokeWidth={3}
                    dot={{ r: 3.5, fill: "#695DE8", stroke: "#695DE8" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-legend">
              <span className="legend-swatch sales"></span>
              <span>Sales</span>
            </div>
          </article>

          <article className="panel panel-large">
            <div className="panel-heading">
              <h2>{t("revenueByPlatformTitle")}</h2>
              <p>{t("revenueByPlatformDesc")}</p>
            </div>

            <div className="chart-box pie-box">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    labelLine={false}
                    label={({ percent }) => `${Math.round((percent ?? 0) * 100)}%`}
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={entry.name} fill={revenueColors[index % revenueColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Revenue"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.15)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="pie-legend">
              {revenueData.map((item, index) => (
                <div key={item.name} className="pie-legend-item">
                  <span
                    className="legend-dot"
                    style={{ backgroundColor: revenueColors[index % revenueColors.length] }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="panel panel-wide">
          <div className="panel-heading">
            <h2>{t("peakSalesHoursTitle")}</h2>
            <p>{t("peakSalesHoursDesc")}</p>
          </div>

          <div className="chart-box bar-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.12)" />
                <XAxis dataKey="time" tickLine={false} axisLine={{ stroke: "rgba(0,0,0,0.45)" }} />
                <YAxis tickLine={false} axisLine={{ stroke: "rgba(0,0,0,0.45)" }} />
                <Tooltip
                  formatter={(value) => [Number(value).toLocaleString(), "Orders"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.15)" }}
                />
                <Bar dataKey="orders" fill="#1ABC9C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            <span className="legend-swatch orders"></span>
            <span>Orders</span>
          </div>
        </section>

        <section className="panel panel-wide">
          <div className="panel-heading">
           <h2>{t("topProductsTitle")}</h2>
           <p>{t("topProductsDesc")}</p>
          </div>

          <div className="products-list">
            {products.map((item) => (
              <article key={item.rank} className="product-row">
                <div className="rank-box">{item.rank}</div>

                <div className="product-main">
                  <div className="product-name">{item.name}</div>

                  <div className="product-meta">
                    <span className={`platform-pill ${item.platformClass}`}>{item.platform}</span>
                    <span className="product-detail">{item.detail}</span>
                  </div>
                </div>

                <div className={`product-growth ${item.up ? "up" : "down"}`}>
                  {item.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{item.growth}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}