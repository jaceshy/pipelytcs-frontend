import { useNavigate } from "react-router-dom";
import "./AddPurchase.css";

const platforms = ["Shopee", "Tokopedia", "Tiktok Shop", "Instagram"];

const AddPurchase = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/sales-insights");
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

      <main className="add-purchase-main">
        <section className="purchase-card">
          <h2>Purchase Information</h2>

          <div className="form-group">
            <label>
              Buyer Email <span>*</span>
            </label>
            <input type="email" placeholder="Enter Buyer Email" />
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
            <p>Select one or more platforms where this product is sold</p>
          </div>

          <div className="platform-grid">
            {platforms.map((platform) => (
              <label className="platform-option" key={platform}>
                <input type="checkbox" />
                <span className="fake-radio" />
                <strong>{platform}</strong>
              </label>
            ))}
          </div>
        </section>

        <section className="purchase-card purchase-data-card">
          <h2>Purchase Data</h2>

          <div className="purchase-form-grid">
            <div className="form-group">
              <label>
                SKU <span>*</span>
              </label>
              <input type="text" placeholder="Enter SKU" />
            </div>

            <div className="form-group">
              <label>
                Purchase Date <span>*</span>
              </label>
              <input type="date" />
            </div>

            <div className="form-group">
              <label>
                Product Value <span>*</span>
              </label>
              <input type="number" placeholder="0" />
            </div>

            <div className="form-group">
              <label>
                Quantity <span>*</span>
              </label>
              <input type="number" placeholder="0" />
            </div>
          </div>
        </section>

        <div className="purchase-actions">
          <button className="cancel-btn" type="button" onClick={handleBack}>
            Cancel
          </button>

          <button className="submit-btn" type="button">
            Add Purchase
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddPurchase;