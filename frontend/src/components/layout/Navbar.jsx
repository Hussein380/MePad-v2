import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-xl font-bold text-primary-600">
                            Meeting Manager
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/meetings"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                            >
                                Meetings
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 