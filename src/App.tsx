
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Index from './pages/Index';
import { AuthProvider } from "./hooks/useAuth";
import { Toaster } from "@/components/ui/toaster"

import Signup from './pages/Signup';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PublicProfile from './pages/PublicProfile';
import Profile from './pages/Profile';
import Search from './pages/Search';
import AchievementsPage from './pages/AchievementsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className='min-h-screen w-full bg-slate-50'>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
