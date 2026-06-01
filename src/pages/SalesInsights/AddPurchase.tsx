import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./AddPurchase.css";

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

type PurchaseResponse = {
  message: string;
  data: unknown;
};

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const AddPurchase = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [selectedSku, setSelectedSku] = useState("");
  const [selectedPlatformId, setSelectedPlatformId] = useState("");
  const [tanggal, setTanggal] = useState(getTodayDate());
  const [quantity, setQuantity] = useState("1");
  const [orderValue, setOrderValue] = useState("");

  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedProduct = useMemo(() => {
    return products.find((product) => product.sku === selectedSku) || null;
  }, [products, selectedSku]);

  const availablePlatforms = selectedProduct?.platforms || [];

  const selectedStock = useMemo(() => {
    if (!selectedProduct || !selectedPlatformId) {
      return null;
    }

    return (
      selectedProduct.stocks?.find(
        (stock) => stock.platform_id === Number(selectedPlatformId)
      ) || null
    );
  }, [selectedProduct, selectedPlatformId]);

  const handleBack = () => {
    navigate("/sales-insights");
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    setErrorMessage("");

    try {
      const response = await apiRequest<ProductResponse>("/products");
      setProducts(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load products"
      );
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!selectedProduct) {
      setSelectedPlatformId("");
      setOrderValue("");
      return;
    }

    const firstPlatform = selectedProduct.platforms?.[0];

    if (firstPlatform) {
      setSelectedPlatformId(String(firstPlatform.id));
    }

    const calculatedValue =
      Number(selectedProduct.price || 0) * Number(quantity || 0);

    setOrderValue(String(calculatedValue));
  }, [selectedProduct, quantity]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!selectedSku) {
      setErrorMessage("Please select a product");
      return;
    }

    if (!selectedPlatformId) {
      setErrorMessage("Please select a sales platform");
      return;
    }

    if (selectedStock && Number(quantity) > Number(selectedStock.stock)) {
      setErrorMessage("Quantity is higher than available stock");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest<PurchaseResponse>("/purchases", {
        method: "POST",
        body: {
          buyer_email: buyerEmail,
          sku: selectedSku,
          platform_id: Number(selectedPlatformId),
          tanggal,
          quantity: Number(quantity),
          order_value: Number(orderValue),
        },
      });

      navigate("/sales-insights");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to add purchase"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-purchase-page">
      <header className="add-purchase-navbar">
        <button
          className="back-button"
          type="button"
          onClick={handleBack}
          aria-label="Back to Sales Insights"
        >
          <img
            className="back-button-icon"
            src="/assets/dashboard/icons/panah-kiri.svg"
            alt=""
          />
        </button>

        <div className="add-purchase-title">
          <h1>Add Purchase</h1>
          <p>Enter purchase details manually</p>
        </div>
      </header>

      <form className="add-purchase-main" onSubmit={handleSubmit}>
        <section className="purchase-card">
          <h2>Purchase Information</h2>

          {errorMessage && (
            <p style={{ color: "#b42318", margin: "0 0 18px" }}>
              {errorMessage}
            </p>
          )}

          <div className="purchase-form-grid">
            <div className="form-group">
              <label>
                Buyer Email <span>*</span>
              </label>
              <input
                type="email"
                placeholder="Enter Buyer Email"
                value={buyerEmail}
                onChange={(event) => setBuyerEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Purchase Date <span>*</span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(event) => setTanggal(event.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className="purchase-card purchase-data-card">
          <h2>Product Data</h2>

          <div className="purchase-form-grid">
            <div className="form-group">
              <label>
                Product <span>*</span>
              </label>
              <select
                className="purchase-select"
                value={selectedSku}
                onChange={(event) => setSelectedSku(event.target.value)}
                disabled={isLoadingProducts}
                required
              >
                <option value="">
                  {isLoadingProducts ? "Loading products..." : "Select Product"}
                </option>

                {products.map((product) => (
                  <option key={product.id} value={product.sku}>
                    {product.nama_produk} - {product.sku}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>SKU</label>
              <input type="text" value={selectedProduct?.sku || ""} disabled />
            </div>

            <div className="form-group">
              <label>Product Price</label>
              <input
                type="number"
                value={selectedProduct?.price || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Available Stock</label>
              <input
                type="number"
                value={selectedStock?.stock ?? ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label>
                Quantity <span>*</span>
              </label>
              <input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Product Value <span>*</span>
              </label>
              <input
                type="number"
                placeholder="0"
                value={orderValue}
                onChange={(event) => setOrderValue(event.target.value)}
                min="0"
                required
              />
            </div>
          </div>
        </section>

        <section className="purchase-card">
          <div className="platform-heading">
            <h2>
              <img
                className="platform-heading-icon"
                src="/assets/dashboard/icons/store.svg"
                alt=""
              />
              Sales Platform <span>*</span>
            </h2>
            <p>Select the platform where this purchase happened</p>
          </div>

          <div className="platform-grid">
            {availablePlatforms.length === 0 && (
              <p style={{ margin: 0, color: "rgba(0, 0, 0, 0.65)" }}>
                Select a product first to show available platforms.
              </p>
            )}

            {availablePlatforms.map((platform) => (
              <label className="platform-option" key={platform.id}>
                <input
                  type="radio"
                  name="platform_id"
                  checked={selectedPlatformId === String(platform.id)}
                  onChange={() => setSelectedPlatformId(String(platform.id))}
                />
                <span className="fake-radio" />
                <strong>{platform.nama}</strong>
              </label>
            ))}
          </div>
        </section>

        <div className="purchase-actions">
          <button className="cancel-btn" type="button" onClick={handleBack}>
            Cancel
          </button>

          <button className="submit-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding Purchase..." : "Add Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchase;