import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { OpsProvider } from "./context/OpsContext";
import { AppShell } from "./components/layout/AppShell";

export default function App() {
  return (
    <AuthProvider>
      <OpsProvider>
        <AppShell />
      </OpsProvider>
    </AuthProvider>
  );
}
