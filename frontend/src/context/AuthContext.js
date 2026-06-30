import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  registerUser,
  loginUser,
  changeUserPassword,
  getUserProfile,
  logoutUser,
} from "../api";

const AuthContext = createContext(null);

const STORAGE_KEY = "@feed_user_session";

// ── SafeStorage wrapper with in-memory fallback ──────────────────
const SafeStorage = {
  memoryCache: {},
  async getItem(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn("AsyncStorage.getItem failed, using memory cache fallback:", e);
      return this.memoryCache[key] || null;
    }
  },
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn("AsyncStorage.setItem failed, using memory cache fallback:", e);
      this.memoryCache[key] = value;
    }
  },
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn("AsyncStorage.removeItem failed, using memory cache fallback:", e);
      delete this.memoryCache[key];
    }
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session from storage on app mount
  useEffect(() => {
    async function loadSession() {
      try {
        const cached = await SafeStorage.getItem(STORAGE_KEY);
        if (cached) {
          setUser(JSON.parse(cached));
        }
      } catch (err) {
        console.error("Failed to load auth session", err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (enrollId, password) => {
    try {
      const response = await loginUser({ enrollId, password });
      
      // Fetch user profile to get full details (FullName, ZoneName, Username)
      const profile = await getUserProfile(enrollId);
      
      // Create session user object
      const sessionUser = {
        enrollId: Number(enrollId),
        fullName: profile.FullName || profile.fullName || "Field User",
        zoneName: profile.ZoneName || profile.zoneName || "HQ",
        username: profile.Username || profile.username || "",
        ...profile,
      };

      await SafeStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return sessionUser;
    } catch (err) {
      throw new Error(err.message || "Login failed");
    }
  };

  const signup = async (enrollId, username, fullName, password, zoneName) => {
    try {
      await registerUser({
        enrollId: Number(enrollId),
        username,
        fullName,
        password,
        zoneName,
      });

      // Automatically log in after registration
      return await login(enrollId, password);
    } catch (err) {
      throw new Error(err.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      if (user && user.enrollId) {
        await logoutUser(user.enrollId).catch(() => {});
      }
    } finally {
      await SafeStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (!user || !user.enrollId) {
      throw new Error("No authenticated user");
    }
    try {
      await changeUserPassword({
        enrollId: user.enrollId,
        oldPassword,
        newPassword,
      });
    } catch (err) {
      throw new Error(err.message || "Password change failed");
    }
  };

  // Dev bypass helper to immediately mock login
  const devBypassLogin = async () => {
    const mockUser = {
      enrollId: 9999,
      fullName: "Dev User",
      zoneName: "HQ",
      username: "dev_user",
    };
    await SafeStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        changePassword,
        devBypassLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
