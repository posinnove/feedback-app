import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import ViewPosts from "./pages/ViewPosts";
import CreatePost from "./pages/CreatePost";
import BusinessProfile from "./pages/BusinessProfile";
import FeedbackDetails from "./pages/FeedbackDetails";

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/posts/view" element={<ViewPosts />} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/posts/:id" element={<FeedbackDetails />} />
            <Route path="/profile" element={<BusinessProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}