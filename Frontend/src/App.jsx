import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import FocusSession from "./components/FocusSession";
import Statistics from "./components/Statistics";
import Settings from "./components/Settings";
import SignInPage from "./components/SignInPage";
import ProtectedRoute from "./components/ProtectedRoute";

function Layout({ children, title }) {
  return (
    <div className="app-root">
      <Sidebar />
      <main className="main-area">
        <div className="main-inner">
          <Header title={title} />
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  const location = useLocation();

  const getTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Tasks";
      case "/timer":
        return "Focus Session";
      case "/stats":
        return "Statistics";
      case "/settings":
        return "Settings";
      default:
        return "Tasks";
    }
  };

  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout title={getTitle(location.pathname)}>
              <TaskList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/timer"
        element={
          <ProtectedRoute>
            <Layout title={getTitle(location.pathname)}>
              <FocusSession />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Layout title={getTitle(location.pathname)}>
              <Statistics />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout title={getTitle(location.pathname)}>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
