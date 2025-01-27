import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-blue-600">
                            MePad
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        <span className="text-gray-700 px-3 py-2 text-sm">
                            {user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                        >
                            {isOpen ? (
                                <AiOutlineClose className="block h-6 w-6" />
                            ) : (
                                <AiOutlineMenu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden pb-3`}>
                    <div className="pt-2 pb-3 space-y-1">
                        <div className="text-gray-700 block px-3 py-2 text-base border-b">
                            {user?.email}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 block w-full text-left px-3 py-2 text-base"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 