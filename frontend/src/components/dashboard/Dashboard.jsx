import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboard } from '../../services/api';
import { BiCalendar } from 'react-icons/bi';
import { AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineUnorderedList } from 'react-icons/ai';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import StatCard from '../shared/StatCard';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentMeetings, setRecentMeetings] = useState([]);
    const [pendingActions, setPendingActions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await dashboard.getData();
                setStats(response.data.data.stats);
                setRecentMeetings(response.data.data.recentMeetings);
                setPendingActions(response.data.data.pendingActions);
            } catch (error) {
                toast.error('Failed to fetch dashboard data');
                console.error('Dashboard error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (!stats) return <div>No data available</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950">
            <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 py-6"
                >
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                        Welcome to Meeting Manager
                    </h1>
                    <Link
                        to="/meetings/new"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg 
                                 transition-all shadow-lg w-full sm:w-auto text-center"
                    >
                        New Meeting
                    </Link>
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <StatCard
                        title="Total Meetings"
                        value={stats.totalMeetings}
                        icon={<BiCalendar className="text-blue-400" />}
                    />
                    <StatCard
                        title="Upcoming"
                        value={stats.upcomingMeetings}
                        icon={<AiOutlineClockCircle className="text-green-400" />}
                    />
                    <StatCard
                        title="Pending Actions"
                        value={stats.pendingActions}
                        icon={<AiOutlineUnorderedList className="text-yellow-400" />}
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completedActions}
                        icon={<AiOutlineCheckCircle className="text-purple-400" />}
                    />
                </motion.div>

                {/* Recent Meetings & Actions Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Recent Meetings */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                            <BiCalendar className="text-blue-400" />
                            Recent Meetings
                        </h2>
                        <div className="space-y-3">
                            {recentMeetings.length === 0 ? (
                                <p className="text-blue-200 text-center py-4">No recent meetings</p>
                            ) : (
                                recentMeetings.map((meeting) => (
                                    <motion.div
                                        key={meeting._id}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Link
                                            to={`/meetings/${meeting._id}`}
                                            className="block p-4 rounded-lg bg-blue-800/30 hover:bg-blue-800/40 
                                                     border border-blue-700/50 transition-all"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div>
                                                    <h3 className="font-medium text-white">{meeting.title}</h3>
                                                    <p className="text-sm text-blue-200">{meeting.venue}</p>
                                                </div>
                                                <span className="text-xs text-blue-300">
                                                    {new Date(meeting.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Pending Actions */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                            <AiOutlineUnorderedList className="text-yellow-400" />
                            Pending Actions
                        </h2>
                        <div className="space-y-3">
                            {pendingActions.length === 0 ? (
                                <p className="text-blue-200 text-center py-4">No pending actions</p>
                            ) : (
                                pendingActions.map((action, index) => (
                                    <motion.div
                                        key={action._id}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Link
                                            to={`/meetings/${action.meetingId}`}
                                            className="block p-4 rounded-lg bg-blue-800/30 hover:bg-blue-800/40 
                                                     border border-blue-700/50 transition-all"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div>
                                                    <h3 className="font-medium text-white">
                                                        {index + 1}. {action.description}
                                                    </h3>
                                                    <p className="text-sm text-blue-200">
                                                        Assigned to: {action.assignedTo}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-yellow-300">
                                                        Status: {action.status}
                                                    </span>
                                                    <span className="text-blue-300">
                                                        Due: {new Date(action.dueDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 