import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Layout from './components/layout/Layout';
import MeetingList from './components/meetings/MeetingList';
import MeetingForm from './components/meetings/MeetingForm';
import MeetingDetail from './components/meetings/MeetingDetail';
import PrivateRoute from './components/auth/PrivateRoute';

const router = createBrowserRouter([
    {
        element: <AuthProvider><Toaster /><Outlet /></AuthProvider>,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                element: <PrivateRoute><Layout /></PrivateRoute>,
                children: [
                    {
                        path: "/",
                        element: <Dashboard />
                    },
                    {
                        path: "/meetings",
                        element: <MeetingList />
                    },
                    {
                        path: "/meetings/new",
                        element: <MeetingForm />
                    },
                    {
                        path: "/meetings/:id",
                        element: <MeetingDetail />
                    }
                ]
            }
        ]
    }
]);

export default function App() {
    return <RouterProvider router={router} />;
} 