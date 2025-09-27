import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UserOptions from "./pages/UserOptions";
import Schemes from "./pages/Schemes";
import Acts from "./pages/Acts";
import Policies from "./pages/Policies";
import ComplaintForm from "./pages/ComplaintForm";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import TrackStatus from "./pages/Trackstatus";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import ComplaintChoice from './pages/ComplaintChoice';
import Help from "./pages/Help";
import About from "./pages/About";
import EcoTips from "./pages/EcoTips";
import WomenChildComplaint from "./pages/WomenChildComplaint";
import PickupScheduling from "./pages/PickupScheduling";
import WasteClassification from "./pages/WasteClassification";

// New Citizen Components
import CitizenDashboard from "./pages/CitizenDashboard";

// Enhanced Admin Components
import EnhancedAdminDashboard from "./pages/EnhancedAdminDashboard";

// Directory Components
import CompostMakers from "./pages/CompostMakers";
import ScrapShops from "./pages/ScrapShops";
import RegisterShop from "./pages/RegisterShop";

// Worker Panel Components
import WorkerLogin from "./pages/WorkerLogin";
import WorkerDashboard from "./pages/WorkerDashboard";
import EnhancedWorkerDashboard from "./pages/EnhancedWorkerDashboard";
import CollectionTasks from "./pages/CollectionTasks";
import SegregationCheck from "./pages/SegregationCheck";
import DropoffConfirmation from "./pages/DropoffConfirmation";
import ReportIssues from "./pages/ReportIssues";
import TrainingHub from "./pages/TrainingHub";
import RewardsPerformance from "./pages/RewardsPerformance";




export default function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-options" element={<UserOptions />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/complaint" element={<ComplaintForm />} />
          <Route path="/complaint-choice" element={<ComplaintChoice />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/trackstatus" element={<TrackStatus />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/acts" element={<Acts />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/help" element={<Help/>} />
          <Route path="/about" element={<About />} />
          <Route path="/eco-tips" element={<EcoTips />} />
          <Route path="/women-child-complaint" element={<WomenChildComplaint />} />
          <Route path="/pickup-scheduling" element={<PickupScheduling />} />
          <Route path="/waste-classification" element={<WasteClassification />} />
          <Route path="/compost-makers" element={<CompostMakers />} />
          <Route path="/scrap-shops" element={<ScrapShops />} />
          <Route path="/register-shop" element={<RegisterShop />} />

          {/* Citizen Routes */}
          <Route path="/citizen-dashboard" element={<ProtectedRoute requireCitizen={true}><CitizenDashboard /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <EnhancedAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Worker Panel Routes */}
          <Route path="/worker-login" element={<WorkerLogin />} />
          <Route path="/worker-dashboard" element={<ProtectedRoute requireWorker={true}><EnhancedWorkerDashboard /></ProtectedRoute>} />
          <Route path="/collection-tasks" element={<ProtectedRoute requireWorker={true}><CollectionTasks /></ProtectedRoute>} />
          <Route path="/segregation-check" element={<ProtectedRoute requireWorker={true}><SegregationCheck /></ProtectedRoute>} />
          <Route path="/dropoff-confirmation" element={<ProtectedRoute requireWorker={true}><DropoffConfirmation /></ProtectedRoute>} />
          <Route path="/report-issues" element={<ProtectedRoute requireWorker={true}><ReportIssues /></ProtectedRoute>} />
          <Route path="/training-hub" element={<ProtectedRoute requireWorker={true}><TrainingHub /></ProtectedRoute>} />
          <Route path="/rewards-performance" element={<ProtectedRoute requireWorker={true}><RewardsPerformance /></ProtectedRoute>} />

          {/* Optional: Fallback 404 */}
          <Route path="*" element={<h2 className="text-center text-red-500 mt-10">404: Page not found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}
