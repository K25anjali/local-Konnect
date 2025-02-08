import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, Center, Spinner } from "@chakra-ui/react";
import initialTheme from "./theme/theme";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token); // If token exists, set true; else false
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
      </Center>
    );
  }

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Auth Routes (No Sidebar) */}
        <Route
          path="auth/*"
          element={isAuthenticated ? <Navigate to="/admin/default" replace /> : <AuthLayout />}
        />

        {/* Admin Routes (With Sidebar) */}
        <Route
          path="admin/*"
          element={isAuthenticated ? (
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          ) : (
            <Navigate to="/auth/sign-in" replace />
          )}
        />

        {/* Default Redirect Based on Authentication */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/default" replace />
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          }
        />
      </Routes>
    </ChakraProvider>
  );
}
