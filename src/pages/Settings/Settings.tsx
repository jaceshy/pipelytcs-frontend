import "./Settings.css";

const profileFields = [
  {
    label: "Full Name",
    value: "Jeanette Faye",
    icon: "/assets/dashboard/icons/people.svg",
  },
  {
    label: "Email",
    value: "jeanettefaye@pipelytcs.com",
    icon: "/assets/dashboard/icons/email.svg",
  },
  {
    label: "Phone",
    value: "+62 812-3456-7890",
    icon: "/assets/dashboard/icons/phone.svg",
  },
  {
    label: "Address",
    value: "Jakarta Selatan, Indonesia",
    icon: "/assets/dashboard/icons/address.svg",
  },
];

import { useEffect, useState } from "react";
import "./Settings.css";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
};

const defaultProfile: ProfileData = {
  fullName: "Jeanette Faye",
  email: "jeanettefaye@pipelytcs.com",
  phone: "+62 812-3456-7890",
  address: "Jakarta Selatan, Indonesia",
  bio: "Passionate e-commerce entrepreneur specializing in fashion and beauty products across Southeast Asia markets.",
};

const Settings = () => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [draftProfile, setDraftProfile] = useState<ProfileData>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("pipelytcs_profile");

    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile) as ProfileData;
      setProfile(parsedProfile);
      setDraftProfile(parsedProfile);
    }
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setDraftProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setDraftProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftProfile(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(draftProfile);
    localStorage.setItem("pipelytcs_profile", JSON.stringify(draftProfile));
    setIsEditing(false);
  };

  return (
    <div className="settings-page">
      <section className="settings-card profile-card">
        <div className="settings-card-header">
          <div className="settings-title">
            <div className="settings-title-icon">
              <img src="/assets/dashboard/icons/people.svg" alt="" />
            </div>
            <h2>User Profile</h2>
          </div>

          {!isEditing ? (
            <button className="edit-profile-btn" type="button" onClick={handleEdit}>
              <img src="/assets/dashboard/icons/edit.svg" alt="" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="profile-edit-actions">
              <button className="profile-cancel-btn" type="button" onClick={handleCancel}>
                Cancel
              </button>

              <button className="profile-save-btn" type="button" onClick={handleSave}>
                Save Profile
              </button>
            </div>
          )}
        </div>

        <div className="profile-identity">
          <img
            className="profile-photo"
            src="/assets/dashboard/avatar.png"
            alt={profile.fullName}
          />

          <div>
            <h1>{isEditing ? draftProfile.fullName : profile.fullName}</h1>
            <p>{isEditing ? draftProfile.email : profile.email}</p>
          </div>
        </div>

        <div className="profile-field-grid">
          <div className="profile-field">
            <div className="profile-field-label">
              <img src="/assets/dashboard/icons/people.svg" alt="" />
              <span>Full Name</span>
            </div>

            {isEditing ? (
              <input
                className="profile-field-input"
                type="text"
                value={draftProfile.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
              />
            ) : (
              <div className="profile-field-value">{profile.fullName}</div>
            )}
          </div>

          <div className="profile-field">
            <div className="profile-field-label">
              <img src="/assets/dashboard/icons/email.svg" alt="" />
              <span>Email</span>
            </div>

            {isEditing ? (
              <input
                className="profile-field-input"
                type="email"
                value={draftProfile.email}
                onChange={(event) => handleChange("email", event.target.value)}
              />
            ) : (
              <div className="profile-field-value">{profile.email}</div>
            )}
          </div>

          <div className="profile-field">
            <div className="profile-field-label">
              <img src="/assets/dashboard/icons/phone.svg" alt="" />
              <span>Phone</span>
            </div>

            {isEditing ? (
              <input
                className="profile-field-input"
                type="text"
                value={draftProfile.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
              />
            ) : (
              <div className="profile-field-value">{profile.phone}</div>
            )}
          </div>

          <div className="profile-field">
            <div className="profile-field-label">
              <img src="/assets/dashboard/icons/address.svg" alt="" />
              <span>Address</span>
            </div>

            {isEditing ? (
              <input
                className="profile-field-input"
                type="text"
                value={draftProfile.address}
                onChange={(event) => handleChange("address", event.target.value)}
              />
            ) : (
              <div className="profile-field-value">{profile.address}</div>
            )}
          </div>
        </div>

        <div className="profile-bio">
          <label>Bio</label>

          {isEditing ? (
            <textarea
              className="profile-bio-textarea"
              value={draftProfile.bio}
              onChange={(event) => handleChange("bio", event.target.value)}
            />
          ) : (
            <div className="profile-bio-value">{profile.bio}</div>
          )}
        </div>
      </section>

      <section className="settings-card export-card">
        <div className="settings-title">
          <div className="settings-title-icon">
            <img src="/assets/dashboard/icons/download.svg" alt="" />
          </div>
          <h2>Export Data</h2>
        </div>

        <p>Download your sales data and analytics reports</p>

        <button className="export-btn" type="button">
          Export as CSV
        </button>
      </section>
    </div>
  );
};

export default Settings;