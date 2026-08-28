import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async ({ email, password, role, name }) => {
    if (!email || !password) {
      return { success: false, error: "Invalid credentials: Email and password are required." };
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes("@") || cleanEmail.length < 5) {
      return { success: false, error: "Invalid credentials: Enter a valid email format (e.g. name@company.com)." };
    }

    if (password.trim().length < 3) {
      return { success: false, error: "Invalid credentials: Password must be at least 3 characters." };
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: password.trim(), role, name })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Invalid credentials. Please verify your email and password." };
      }
    } catch (e) {
      console.warn("Backend login fetch error, dynamically authenticating locally:", e);
    }

    // Dynamic Local Authentication for ANY person / email
    let derivedName = name?.trim();
    if (!derivedName) {
      const prefix = cleanEmail.split("@")[0];
      derivedName = prefix
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }

    const selectedRole = role || "Executive / Manager";
    const initials = derivedName
      .split(" ")
      .map(w => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

    const userData = {
      id: `usr-${Date.now()}`,
      name: derivedName,
      email: cleanEmail,
      role: selectedRole,
      department: selectedRole === "Department Head" ? "Supply Chain & Logistics" : selectedRole === "Employee" ? "Inventory Management" : "Executive Operations",
      avatar: initials,
      title: selectedRole === "Department Head" ? "Head of Inventory & Logistics" : selectedRole === "Employee" ? "Senior Operations Specialist" : "VP of Enterprise Operations"
    };

    setUser(userData);
    setIsAuthenticated(true);
    return { success: true, user: userData };
  };

  const switchRole = (roleName) => {
    if (user) {
      const updatedUser = {
        ...user,
        role: roleName,
        department: roleName === "Department Head" ? "Supply Chain & Logistics" : roleName === "Employee" ? "Inventory Management" : "Executive Operations",
        title: roleName === "Department Head" ? "Head of Inventory & Logistics" : roleName === "Employee" ? "Senior Operations Specialist" : "VP of Enterprise Operations"
      };
      setUser(updatedUser);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
