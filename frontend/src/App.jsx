import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import MainLayout from "./layout/MainLayout";
import Home from "./pages/HomePage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Playlists from "./pages/Playlist";
import VideoPage from "./pages/VideoPage";
import UploadVideo from "./pages/UploadVideo";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import EditVideo from "./pages/EditVideo";
import Tweets from "./pages/Tweets";

import ProtectedRoute from "./components/common/ProtectedRoute";

/* Page Animation Wrapper */
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/login"
          element={
            <PageWrapper>
              <Auth />
            </PageWrapper>
          }
        />

        {/* Public routes WITH layout */}
        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />

          <Route
            path="/video/:videoId"
            element={
              <PageWrapper>
                <VideoPage />
              </PageWrapper>
            }
          />

          <Route
            path="/profile/:username"
            element={
              <PageWrapper>
                <ProfilePage />
              </PageWrapper>
            }
          />

        </Route>

        {/* ================= PROTECTED ROUTES ================= */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            }
          />

          <Route
            path="/playlists"
            element={
              <PageWrapper>
                <Playlists />
              </PageWrapper>
            }
          />

          <Route
            path="/upload"
            element={
              <PageWrapper>
                <UploadVideo />
              </PageWrapper>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <PageWrapper>
                <EditProfile />
              </PageWrapper>
            }
          />

          <Route
            path="/edit-video/:videoId"
            element={
              <PageWrapper>
                <EditVideo />
              </PageWrapper>
            }
          />

          {/* TWEETS PAGE */}
          <Route
            path="/tweets"
            element={
              <PageWrapper>
                <Tweets />
              </PageWrapper>
            }
          />

        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}