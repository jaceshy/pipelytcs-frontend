import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const platforms = ["Shopee", "Tokopedia", "Tiktok Shop", "Instagram"];

const AddProduct = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/product-analytics");
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

      <main className="add-product-main">
        <section className="add-product-card">
          <h2>Product Information</h2>

          <div className="add-product-form-grid">
            <div className="add-product-form-group">
              <label>
                Product Name <span>*</span>
              </label>
              <input type="text" placeholder="Enter Product Name" />
            </div>

            <div className="add-product-form-group">
              <label>
                SKU <span>*</span>
              </label>
              <input type="text" placeholder="Enter SKU" />
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
              <label className="add-product-platform-option" key={platform}>
                <input type="checkbox" />
                <span className="add-product-fake-radio" />
                <strong>{platform}</strong>
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
              <input type="text" placeholder="Rp" />
            </div>

            <div className="add-product-form-group">
              <label>
                Product Stock <span>*</span>
              </label>
              <input type="number" placeholder="0" />
            </div>
          </div>
        </section>

        <div className="add-product-actions">
          <button className="add-product-cancel-btn" type="button" onClick={handleBack}>
            Cancel
          </button>

          <button className="add-product-submit-btn" type="button">
            Add Product
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;