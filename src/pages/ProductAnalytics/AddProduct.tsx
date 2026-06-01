import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./AddProduct.css";

type PlatformOption = {
  id: number;
  name: string;
};

type CreateProductResponse = {
  message: string;
  data: unknown;
};

const platforms: PlatformOption[] = [
  { id: 1, name: "Shopee" },
  { id: 2, name: "Tokopedia" },
  { id: 3, name: "TikTok Shop" },
  { id: 4, name: "Instagram" },
];

const AddProduct = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minimumStock, setMinimumStock] = useState("5");
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<number[]>([
    1, 2, 3, 4,
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleBack = () => {
    navigate("/product-analytics");
  };

  const handleTogglePlatform = (platformId: number) => {
    setSelectedPlatformIds((previous) => {
      if (previous.includes(platformId)) {
        return previous.filter((id) => id !== platformId);
      }

      return [...previous, platformId];
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (selectedPlatformIds.length === 0) {
      setErrorMessage("Please select at least one sales platform");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest<CreateProductResponse>("/products", {
        method: "POST",
        body: {
          nama_produk: productName,
          sku,
          category,
          price: Number(price),
          stock_awal: Number(stock),
          minimum_stock: Number(minimumStock),
          platform_ids: selectedPlatformIds,
        },
      });

      navigate("/product-analytics");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to add product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-page">
      <header className="add-product-navbar">
        <button
          className="add-product-back-button"
          type="button"
          onClick={handleBack}
          aria-label="Back to Product Analytics"
        >
          <img
            className="add-product-back-icon"
            src="/assets/dashboard/icons/panah-kiri.svg"
            alt=""
          />
        </button>

        <div className="add-product-title">
          <h1>Add New Product</h1>
          <p>Enter product details manually</p>
        </div>
      </header>

      <form className="add-product-main" onSubmit={handleSubmit}>
        <section className="add-product-card">
          <h2>Product Information</h2>

          {errorMessage && (
            <p style={{ color: "#b42318", margin: "0 0 18px" }}>
              {errorMessage}
            </p>
          )}

          <div className="add-product-form-grid">
            <div className="add-product-form-group">
              <label>
                Product Name <span>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Product Name"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                required
              />
            </div>

            <div className="add-product-form-group">
              <label>
                SKU <span>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter SKU"
                value={sku}
                onChange={(event) => setSku(event.target.value)}
                required
              />
            </div>

            <div className="add-product-form-group">
              <label>
                Category <span>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className="add-product-card">
          <div className="add-product-platform-heading">
            <h2>
              <img
                className="add-product-platform-icon"
                src="/assets/dashboard/icons/store.svg"
                alt=""
              />
              Sales Platform <span>*</span>
            </h2>
            <p>Select one or more platforms where this product is sold</p>
          </div>

          <div className="add-product-platform-grid">
            {platforms.map((platform) => (
              <label className="add-product-platform-option" key={platform.id}>
                <input
                  type="checkbox"
                  checked={selectedPlatformIds.includes(platform.id)}
                  onChange={() => handleTogglePlatform(platform.id)}
                />
                <span className="add-product-fake-radio" />
                <strong>{platform.name}</strong>
              </label>
            ))}
          </div>
        </section>

        <section className="add-product-card">
          <h2>Product Data</h2>

          <div className="add-product-form-grid">
            <div className="add-product-form-group">
              <label>
                Product Price <span>*</span>
              </label>
              <input
                type="number"
                placeholder="Rp"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                min="0"
                required
              />
            </div>

            <div className="add-product-form-group">
              <label>
                Product Stock <span>*</span>
              </label>
              <input
                type="number"
                placeholder="0"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                min="0"
                required
              />
            </div>

            <div className="add-product-form-group">
              <label>
                Minimum Stock <span>*</span>
              </label>
              <input
                type="number"
                placeholder="5"
                value={minimumStock}
                onChange={(event) => setMinimumStock(event.target.value)}
                min="0"
                required
              />
            </div>
          </div>
        </section>

        <div className="add-product-actions">
          <button
            className="add-product-cancel-btn"
            type="button"
            onClick={handleBack}
          >
            Cancel
          </button>

          <button
            className="add-product-submit-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;