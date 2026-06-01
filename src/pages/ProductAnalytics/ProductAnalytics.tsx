import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./ProductAnalytics.css";

type ProductAnalyticsProps = {
  mode?: "admin" | "team";
};

type Platform = {
  id: number;
  nama: string;
};

type ProductStock = {
  id?: number;
  product_id: number;
  platform_id: number;
  stock: number;
  minimum_stock: number;
};

type Product = {
  id: number;
  user_id: number;
  nama_produk: string;
  sku: string;
  category: string;
  price: number;
  units_sold: number;
  revenue: number;
  trend: string;
  platforms: Platform[];
  stocks: ProductStock[];
};

type ProductResponse = {
  message: string;
  data: Product[];
};

type EditForm = {
  nama_produk: string;
  sku: string;
  category: string;
  price: string;
  stock_awal: string;
  minimum_stock: string;
  platform_ids: number[];
};

const platformOptions = [
  { id: 1, name: "Shopee" },
  { id: 2, name: "Tokopedia" },
  { id: 3, name: "TikTok Shop" },
  { id: 4, name: "Instagram" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const getPlatformClass = (platform: string) => {
  return platform.toLowerCase().replaceAll(" ", "-");
};

const getTotalStock = (product: Product) => {
  return (
    product.stocks?.reduce(
      (total, item) => total + Number(item.stock || 0),
      0
    ) || 0
  );
};

const getTotalMinimumStock = (product: Product) => {
  return (
    product.stocks?.reduce(
      (total, item) => total + Number(item.minimum_stock || 0),
      0
    ) || 0
  );
};

const getTrendType = (trend: string) => {
  const normalizedTrend = trend.toLowerCase();

  if (normalizedTrend.includes("slow")) {
    return "down";
  }

  return "up";
};

const getStatus = (product: Product) => {
  const totalStock = getTotalStock(product);
  const totalMinimumStock = getTotalMinimumStock(product);

  if (totalStock <= totalMinimumStock) {
    return {
      label: "Low Stock",
      type: "normal",
    };
  }

  if (product.trend.toLowerCase().includes("fast")) {
    return {
      label: "Fast-Moving",
      type: "fast",
    };
  }

  return {
    label: "Normal",
    type: "normal",
  };
};

const ProductAnalytics = ({ mode = "admin" }: ProductAnalyticsProps) => {
  const navigate = useNavigate();
  const isTeam = mode === "team";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    nama_produk: "",
    sku: "",
    category: "",
    price: "",
    stock_awal: "",
    minimum_stock: "5",
    platform_ids: [],
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await apiRequest<ProductResponse>("/products");
      setProducts(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load products"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProducts = products.length;

  const fastMovingCount = useMemo(() => {
    return products.filter((product) =>
      product.trend.toLowerCase().includes("fast")
    ).length;
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((product) => {
      const totalStock = getTotalStock(product);
      const totalMinimumStock = getTotalMinimumStock(product);

      return totalStock <= totalMinimumStock;
    }).length;
  }, [products]);

  const summaryCards = [
    {
      title: "Total Products",
      value: String(totalProducts),
      subtitle: "Active SKUs",
      icon: "/assets/dashboard/icons/total-products.svg",
      className: "blue",
    },
    {
      title: "Fast-Moving Items",
      value: String(fastMovingCount),
      subtitle: "High demand products",
      icon: "/assets/dashboard/icons/fast-moving-items.svg",
      className: "green",
    },
    {
      title: "Low Stock Alert",
      value: String(lowStockCount),
      subtitle: "Need restocking",
      icon: "/assets/dashboard/icons/low-stock-alert.svg",
      className: "orange",
    },
  ];

  const handleOpenEdit = (product: Product) => {
    const totalStock = getTotalStock(product);
    const totalMinimumStock = getTotalMinimumStock(product);
    const stockCount = product.stocks?.length || product.platforms?.length || 1;

    setEditingProduct(product);
    setEditErrorMessage("");

    setEditForm({
      nama_produk: product.nama_produk,
      sku: product.sku,
      category: product.category || "",
      price: String(product.price || ""),
      stock_awal: String(Math.floor(totalStock / stockCount)),
      minimum_stock: String(Math.floor(totalMinimumStock / stockCount) || 5),
      platform_ids: product.platforms.map((platform) => platform.id),
    });
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
    setEditErrorMessage("");
  };

  const handleToggleEditPlatform = (platformId: number) => {
    setEditForm((previous) => {
      const exists = previous.platform_ids.includes(platformId);

      return {
        ...previous,
        platform_ids: exists
          ? previous.platform_ids.filter((id) => id !== platformId)
          : [...previous.platform_ids, platformId],
      };
    });
  };

  const handleUpdateProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingProduct) {
      return;
    }

    if (editForm.platform_ids.length === 0) {
      setEditErrorMessage("Please select at least one sales platform");
      return;
    }

    setIsUpdating(true);
    setEditErrorMessage("");

    try {
      await apiRequest(`/products/${editingProduct.id}`, {
        method: "PUT",
        body: {
          nama_produk: editForm.nama_produk,
          sku: editForm.sku,
          category: editForm.category,
          price: Number(editForm.price),
          stock_awal: Number(editForm.stock_awal),
          minimum_stock: Number(editForm.minimum_stock),
          platform_ids: editForm.platform_ids,
        },
      });

      await fetchProducts();
      handleCloseEdit();
    } catch (error) {
      setEditErrorMessage(
        error instanceof Error ? error.message : "Failed to update product"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/products/${productId}`, {
        method: "DELETE",
      });

      setProducts((previousProducts) =>
        previousProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete product");
    }
  };

  return (
    <div className="product-analytics-page">
      <section className="pa-header">
        <div>
          <h2>Product Performance</h2>
          <p>Analyze individual product sales and inventory trends</p>
        </div>

        {!isTeam && (
          <button
            className="pa-add-btn"
            type="button"
            onClick={() => navigate("/product-analytics/add-product")}
          >
            <span>+</span>
            Add Product
          </button>
        )}
      </section>

      <section className="pa-card pa-table-card">
        <div className="pa-card-title">
          <h3>Top-Selling Products</h3>
          <p>Complete product performance breakdown</p>
        </div>

        {errorMessage && (
          <p style={{ color: "#b42318", marginTop: "16px" }}>{errorMessage}</p>
        )}

        <table className="pa-products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Platform</th>
              <th>Revenue</th>
              <th>Trend</th>
              <th>Status</th>
              {!isTeam && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={isTeam ? 5 : 6}>Loading products...</td>
              </tr>
            )}

            {!isLoading && products.length === 0 && (
              <tr>
                <td colSpan={isTeam ? 5 : 6}>No products found.</td>
              </tr>
            )}

            {!isLoading &&
              products.map((product) => {
                const firstPlatform = product.platforms?.[0];
                const platformName = firstPlatform?.nama || "No Platform";
                const extraPlatformCount =
                  product.platforms.length > 1 ? product.platforms.length - 1 : 0;

                const trendType = getTrendType(product.trend);
                const status = getStatus(product);

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="pa-product-name">{product.nama_produk}</div>
                      <div className="pa-product-sku">{product.sku}</div>
                    </td>

                    <td>
                      <span
                        className={`pa-platform-badge ${getPlatformClass(
                          platformName
                        )}`}
                      >
                        {platformName}
                      </span>

                      {extraPlatformCount > 0 && (
                        <span style={{ marginLeft: "6px", fontSize: "11px" }}>
                          +{extraPlatformCount}
                        </span>
                      )}
                    </td>

                    <td>{formatCurrency(Number(product.revenue || 0))}</td>

                    <td>
                      <span className={`pa-trend ${trendType}`}>
                        <img
                          className="pa-trend-icon"
                          src={`/assets/dashboard/icons/${
                            trendType === "up" ? "up.svg" : "down.svg"
                          }`}
                          alt=""
                        />
                        {product.trend}
                      </span>
                    </td>

                    <td>
                      <span className={`pa-status-badge ${status.type}`}>
                        {status.label}
                      </span>
                    </td>

                    {!isTeam && (
                      <td>
                        <div className="pa-actions">
                          <button
                            type="button"
                            aria-label="Edit product"
                            onClick={() => handleOpenEdit(product)}
                          >
                            <img
                              className="pa-action-icon"
                              src="/assets/dashboard/icons/edit.svg"
                              alt=""
                            />
                          </button>

                          <button
                            type="button"
                            aria-label="Delete product"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <img
                              className="pa-action-icon"
                              src="/assets/dashboard/icons/delete.svg"
                              alt=""
                            />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
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

      {editingProduct && (
        <div className="pa-modal-backdrop">
          <form className="pa-edit-modal" onSubmit={handleUpdateProduct}>
            <div className="pa-edit-modal-header">
              <div>
                <h3>Edit Product</h3>
                <p>Update product information, platform, and stock</p>
              </div>

              <button type="button" onClick={handleCloseEdit}>
                ×
              </button>
            </div>

            {editErrorMessage && (
              <p className="pa-edit-error">{editErrorMessage}</p>
            )}

            <div className="pa-edit-form-grid">
              <div className="pa-edit-form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={editForm.nama_produk}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      nama_produk: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="pa-edit-form-group">
                <label>SKU</label>
                <input
                  type="text"
                  value={editForm.sku}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      sku: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="pa-edit-form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      category: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="pa-edit-form-group">
                <label>Price</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      price: event.target.value,
                    }))
                  }
                  min="0"
                  required
                />
              </div>

              <div className="pa-edit-form-group">
                <label>Stock per Platform</label>
                <input
                  type="number"
                  value={editForm.stock_awal}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      stock_awal: event.target.value,
                    }))
                  }
                  min="0"
                  required
                />
              </div>

              <div className="pa-edit-form-group">
                <label>Minimum Stock per Platform</label>
                <input
                  type="number"
                  value={editForm.minimum_stock}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      minimum_stock: event.target.value,
                    }))
                  }
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="pa-edit-platform-section">
              <label>Sales Platform</label>

              <div className="pa-edit-platform-grid">
                {platformOptions.map((platform) => (
                  <label className="pa-edit-platform-option" key={platform.id}>
                    <input
                      type="checkbox"
                      checked={editForm.platform_ids.includes(platform.id)}
                      onChange={() => handleToggleEditPlatform(platform.id)}
                    />
                    <span>{platform.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pa-edit-modal-actions">
              <button
                className="pa-edit-cancel-btn"
                type="button"
                onClick={handleCloseEdit}
              >
                Cancel
              </button>

              <button
                className="pa-edit-save-btn"
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductAnalytics;