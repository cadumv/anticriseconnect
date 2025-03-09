
import {
  createBrowserRouter,
  RouterProvider,
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
    <AuthProvider>
      <div className='min-h-screen bg-slate-50'>
        <RouterProvider
          router={createBrowserRouter([
            {
              path: "/",
              element: <Index />,
            },
            {
              path: "/signup",
              element: <Signup />,
            },
            {
              path: "/login",
              element: <Login />,
            },
            {
              path: "/profile",
              element: <Profile />,
            },
            {
              path: "/search",
              element: <Search />,
            },
            {
              path: "/profile/:id",
              element: <PublicProfile />,
            },
            {
              path: "/achievements",
              element: <AchievementsPage />,
            },
            {
              path: "*",
              element: <NotFound />,
            },
          ])}
        />
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
