import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  login as loginService,
  logout as logoutService,
  register as registerService,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "../services/authServices";
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
} from "../services/api";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeam: boolean;
  login: (data: LoginPayload) => Promise<AuthUser>;
  register: (data: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
};

type LocalProfile = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const applyLocalProfileToUser = (user: AuthUser | null): AuthUser | null => {
  if (!user?.id) {
    return user;
  }

  const profileStorageKey = `pipelytcs_profile_${user.id}`;
  const savedProfile = localStorage.getItem(profileStorageKey);

  if (!savedProfile) {
    return user;
  }

  try {
    const parsedProfile = JSON.parse(savedProfile) as LocalProfile;

    return {
      ...user,
      nama: parsedProfile.fullName || user.nama,
      email: parsedProfile.email || user.email,
    };
  } catch {
    return user;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() =>
    applyLocalProfileToUser(getStoredUser<AuthUser>())
  );

  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const login = async (data: LoginPayload) => {
    const response = await loginService(data);

    const userWithLocalProfile = applyLocalProfileToUser(response.user);

    setStoredAuth(response.token, userWithLocalProfile);
    setToken(response.token);
    setUser(userWithLocalProfile);

    return userWithLocalProfile as AuthUser;
  };

  const register = async (data: RegisterPayload) => {
    const response = await registerService(data);

    const userWithLocalProfile = applyLocalProfileToUser(response.user);

    setStoredAuth(response.token, userWithLocalProfile);
    setToken(response.token);
    setUser(userWithLocalProfile);

    return userWithLocalProfile as AuthUser;
  };

  const updateUser = (data: Partial<AuthUser>) => {
    setUser((previousUser) => {
      if (!previousUser) {
        return previousUser;
      }

      const updatedUser = {
        ...previousUser,
        ...data,
      };

      if (token) {
        setStoredAuth(token, updatedUser);
      }

      return updatedUser;
    });
  };

  const logout = async () => {
    try {
      await logoutService();
    } finally {
      clearStoredAuth();
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
      isTeam: user?.role === "team",
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};