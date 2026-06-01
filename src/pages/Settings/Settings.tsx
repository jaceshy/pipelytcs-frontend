import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";
import "./Settings.css";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
};

type ProfileResponse = {
  message: string;
  user: {
    id: number;
    nama: string;
    email: string;
    role: "admin" | "team";
    status: string;
  };
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const createInitialAvatar = (name: string) => {
  const initial = (name || "U").charAt(0).toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#4078fb"/>
          <stop offset="1" stop-color="#695de8"/>
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#g)"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="70" font-weight="700" fill="white">
        ${initial}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, token, logout, updateUser } = useAuth();

  const defaultProfile = useMemo<ProfileData>(
    () => ({
      fullName: user?.nama || "Pipelytcs User",
      email: user?.email || "user@pipelytcs.com",
      phone: "+62 812-3456-7890",
      address: "Jakarta Selatan, Indonesia",
      bio: "Passionate e-commerce entrepreneur specializing in fashion and beauty products across Southeast Asia markets.",
    }),
    [user?.nama, user?.email]
  );

  const profileStorageKey = useMemo(() => {
    return user?.id
      ? `pipelytcs_profile_${user.id}`
      : "pipelytcs_profile_guest";
  }, [user?.id]);

  const avatarStorageKey = useMemo(() => {
    return user?.id
      ? `pipelytcs_avatar_${user.id}`
      : "pipelytcs_avatar_guest";
  }, [user?.id]);

  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [draftProfile, setDraftProfile] = useState<ProfileData>(defaultProfile);

  const [avatarSrc, setAvatarSrc] = useState("");
  const [draftAvatarSrc, setDraftAvatarSrc] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem(profileStorageKey);
    const savedAvatar = localStorage.getItem(avatarStorageKey) || "";

    setAvatarSrc(savedAvatar);
    setDraftAvatarSrc(savedAvatar);

    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile) as ProfileData;

      const mergedProfile = {
        ...parsedProfile,
        fullName: user?.nama || parsedProfile.fullName,
        email: user?.email || parsedProfile.email,
      };

      setProfile(mergedProfile);
      setDraftProfile(mergedProfile);
      localStorage.setItem(profileStorageKey, JSON.stringify(mergedProfile));
      return;
    }

    setProfile(defaultProfile);
    setDraftProfile(defaultProfile);
  }, [
    defaultProfile,
    profileStorageKey,
    avatarStorageKey,
    user?.nama,
    user?.email,
  ]);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setDraftProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setDraftProfile(profile);
    setDraftAvatarSrc(avatarSrc);
    setProfileMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftProfile(profile);
    setDraftAvatarSrc(avatarSrc);
    setProfileMessage("");
    setIsEditing(false);
  };

  const handleChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProfileMessage("Please choose an image file");
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      setProfileMessage("Image size must be under 1.5 MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setDraftAvatarSrc(String(reader.result || ""));
      setProfileMessage("");
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setDraftAvatarSrc("");
  };

  const handleSave = async () => {
    setIsSavingProfile(true);
    setProfileMessage("");

    try {
      const response = await apiRequest<ProfileResponse>("/profile", {
        method: "PUT",
        body: {
          nama: draftProfile.fullName,
          email: draftProfile.email,
        },
      });

      const updatedProfile = {
        ...draftProfile,
        fullName: response.user.nama,
        email: response.user.email,
      };

      setProfile(updatedProfile);
      setDraftProfile(updatedProfile);

      localStorage.setItem(profileStorageKey, JSON.stringify(updatedProfile));

      if (draftAvatarSrc) {
        localStorage.setItem(avatarStorageKey, draftAvatarSrc);
      } else {
        localStorage.removeItem(avatarStorageKey);
      }

      setAvatarSrc(draftAvatarSrc);
      window.dispatchEvent(new Event("pipelytcs-avatar-updated"));

      updateUser({
        nama: response.user.nama,
        email: response.user.email,
      });

      setProfileMessage("Profile saved successfully");
      setIsEditing(false);
    } catch (error) {
      setProfileMessage(
        error instanceof Error ? error.message : "Failed to save profile"
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    setExportMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/settings/export-csv`, {
        method: "GET",
        headers: {
          Accept: "text/csv",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export CSV");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers.get("Content-Disposition");
      const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);

      const fileName =
        fileNameMatch?.[1] ||
        `pipelytcs-sales-data-${new Date().toISOString().slice(0, 10)}.csv`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      setExportMessage("CSV exported successfully");
    } catch (error) {
      setExportMessage(
        error instanceof Error ? error.message : "Failed to export CSV"
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const profileImage =
    (isEditing ? draftAvatarSrc : avatarSrc) ||
    createInitialAvatar(isEditing ? draftProfile.fullName : profile.fullName);

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
            <button
              className="edit-profile-btn"
              type="button"
              onClick={handleEdit}
            >
              <img src="/assets/dashboard/icons/edit.svg" alt="" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="profile-edit-actions">
              <button
                className="profile-cancel-btn"
                type="button"
                onClick={handleCancel}
                disabled={isSavingProfile}
              >
                Cancel
              </button>

              <button
                className="profile-save-btn"
                type="button"
                onClick={handleSave}
                disabled={isSavingProfile}
              >
                {isSavingProfile ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}
        </div>

        {profileMessage && (
          <p
            style={{
              marginTop: "12px",
              color: profileMessage.includes("successfully")
                ? "#26b64f"
                : "#b42318",
            }}
          >
            {profileMessage}
          </p>
        )}

        <div className="profile-identity">
          <div className="profile-photo-wrapper">
            <img className="profile-photo" src={profileImage} alt={profile.fullName} />

            {isEditing && (
              <div className="profile-photo-actions">
                <button
                  className="profile-photo-btn"
                  type="button"
                  onClick={handleChooseAvatar}
                >
                  Change Photo
                </button>

                <button
                  className="profile-photo-remove-btn"
                  type="button"
                  onClick={handleRemoveAvatar}
                >
                  Remove
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              hidden
            />
          </div>

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
                onChange={(event) =>
                  handleChange("fullName", event.target.value)
                }
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
                onChange={(event) =>
                  handleChange("address", event.target.value)
                }
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

        {exportMessage && (
          <p
            style={{
              marginTop: "12px",
              color: exportMessage.includes("successfully")
                ? "#26b64f"
                : "#b42318",
            }}
          >
            {exportMessage}
          </p>
        )}

        <button
          className="export-btn"
          type="button"
          onClick={handleExportCsv}
          disabled={isExporting}
        >
          {isExporting ? "Exporting..." : "Export as CSV"}
        </button>
      </section>

      <section className="settings-card logout-card">
        <div className="settings-title">
          <div className="settings-title-icon logout-title-icon">
            <span>!</span>
          </div>

          <h2>Account Action</h2>
        </div>

        <p>Logout from your current Pipelytcs account</p>

        <button
          className="logout-btn"
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </section>
    </div>
  );
};

export default Settings;