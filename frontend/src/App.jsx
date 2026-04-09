import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Queue from "./pages/Queue";
import Seats from "./pages/Seats";
import History from "./pages/History";
import Home from "./pages/Home";
import MasterList from "./pages/MasterList";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

// Wrapper for public routes that don't need padding/margins of Layout but might need Navbar 
// or custom design like Login overlay. Let's just wrap everything in Layout except Auth?
// Wait, the user wants Home to be public, but having Navbar. We can use Layout for Home.
function App() {
  const { token } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

        {/* Public / Generic Routes wrapped in Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* Protected Routes wrapped in Layout */}
        <Route
          path="/queue"
          element={
            <ProtectedRoute>
              <Layout>
                <Queue />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/seats/:trainId"
          element={
            <ProtectedRoute>
              <Layout>
                <Seats />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <History />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/masterlist"
          element={
            <ProtectedRoute>
              <Layout>
                <MasterList />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
