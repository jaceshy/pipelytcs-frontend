import { useNavigate } from "react-router-dom";
import "./ProductAnalytics.css";

const products = [
  {
    name: "Wireless Earbuds Pro",
    sku: "SKU-0001",
    platform: "Shopee",
    revenue: "Rp 68,400,000",
    trend: "15.2%",
    trendType: "up",
    status: "Fast-Moving",
    statusType: "fast",
  },
  {
    name: "Smart Watch Series 5",
    sku: "SKU-0002",
    platform: "Tokopedia",
    revenue: "Rp 143,500,000",
    trend: "22.1%",
    trendType: "up",
    status: "Fast-Moving",
    statusType: "fast",
  },
  {
    name: "Running Shoes Premium",
    sku: "SKU-0003",
    platform: "TikTok Shop",
    revenue: "Rp 46,800,000",
    trend: "8.4%",
    trendType: "up",
    status: "Fast-Moving",
    statusType: "fast",
  },
  {
    name: "Laptop Stand Adjustable",
    sku: "SKU-0004",
    platform: "Instagram",
    revenue: "Rp 19,800,000",
    trend: "5.2%",
    trendType: "down",
    status: "Normal",
    statusType: "normal",
  },
  {
    name: "USB-C Hub 7-in-1",
    sku: "SKU-0005",
    platform: "Shopee",
    revenue: "Rp 17,600,000",
    trend: "12.8%",
    trendType: "up",
    status: "Fast-Moving",
    statusType: "fast",
  },
];

const summaryCards = [
  {
    title: "Total Products",
    value: "5",
    subtitle: "Active SKUs",
    icon: "/assets/dashboard/icons/total-products.svg",
    className: "blue",
  },
  {
    title: "Fast-Moving Items",
    value: "4",
    subtitle: "High demand products",
    icon: "/assets/dashboard/icons/fast-moving-items.svg",
    className: "green",
  },
  {
    title: "Low Stock Alert",
    value: "5",
    subtitle: "Need restocking",
    icon: "/assets/dashboard/icons/low-stock-alert.svg",
    className: "orange",
  },
];

const getPlatformClass = (platform: string) => {
  return platform.toLowerCase().replaceAll(" ", "-");
};

const ProductAnalytics = () => {
  const navigate = useNavigate();

  return (
    <div className="product-analytics-page">
      <section className="pa-header">
        <div>
          <h2>Product Performance</h2>
          <p>Analyze individual product sales and inventory trends</p>
        </div>

        <button
          className="pa-add-btn"
          type="button"
          onClick={() => navigate("/product-analytics/add-product")}
        >
          <span>+</span>
          Add Product
        </button>
      </section>

      <section className="pa-card pa-table-card">
        <div className="pa-card-title">
          <h3>Top-Selling Products</h3>
          <p>Complete product performance breakdown</p>
        </div>

        <table className="pa-products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Platform</th>
              <th>Revenue</th>
              <th>Trend</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.sku}>
                <td>
                  <div className="pa-product-name">{product.name}</div>
                  <div className="pa-product-sku">{product.sku}</div>
                </td>

                <td>
                  <span className={`pa-platform-badge ${getPlatformClass(product.platform)}`}>
                    {product.platform}
                  </span>
                </td>

                <td>{product.revenue}</td>

                <td>
                    <span className={`pa-trend ${product.trendType}`}>
                        <img
                        className="pa-trend-icon"
                        src={`/assets/dashboard/icons/${product.trendType === "up" ? "up.svg" : "down.svg"}`}
                        alt=""
                        />
                        {product.trend}
                    </span>
                    </td>

                <td>
                  <span className={`pa-status-badge ${product.statusType}`}>
                    {product.status}
                  </span>
                </td>

                <td>
                    <div className="pa-actions">
                        <button type="button" aria-label="Edit product">
                        <img
                            className="pa-action-icon"
                            src="/assets/dashboard/icons/edit.svg"
                            alt=""
                        />
                        </button>

                        <button type="button" aria-label="Delete product">
                        <img
                            className="pa-action-icon"
                            src="/assets/dashboard/icons/delete.svg"
                            alt=""
                        />
                        </button>
                    </div>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="pa-summary-row">
        {summaryCards.map((card) => (
          <div className={`pa-summary-card ${card.className}`} key={card.title}>
            <img src={card.icon} alt="" />
            <h3>{card.title}</h3>
            <strong>{card.value}</strong>
            <p>{card.subtitle}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ProductAnalytics;