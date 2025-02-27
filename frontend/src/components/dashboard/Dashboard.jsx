import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboard } from '../../services/api';
import { BiCalendar, BiPlus, BiCheckCircle, BiRefresh } from 'react-icons/bi';
import { AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineUnorderedList } from 'react-icons/ai';
import { FaUserFriends } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import StatCard from '../shared/StatCard';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentMeetings, setRecentMeetings] = useState([]);
    const [pendingActions, setPendingActions] = useState([]);
    const [myAssignedActions, setMyAssignedActions] = useState([]);
    const [invitedMeetings, setInvitedMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async () => {
        setRefreshing(true);
        try {
            const response = await dashboard.getData();
            setStats(response.data.data.stats);
            setRecentMeetings(response.data.data.recentMeetings);
            setPendingActions(response.data.data.pendingActions);
            setMyAssignedActions(response.data.data.myAssignedActions || []);
            setInvitedMeetings(response.data.data.invitedMeetings || []);
            if (refreshing) toast.success('Dashboard refreshed');
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Get current date for calendar view
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    // Filter upcoming meetings for this month
    const thisMonthMeetings = [...recentMeetings, ...invitedMeetings].filter(meeting => {
        const meetingDate = new Date(meeting.date);
        return meetingDate.getMonth() === currentDate.getMonth() && 
               meetingDate.getFullYear() === currentDate.getFullYear();
    });

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
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button 
                            onClick={fetchDashboardData}
                            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg 
                                     transition-all shadow-lg flex items-center justify-center gap-2"
                            disabled={refreshing}
                        >
                            <BiRefresh className={refreshing ? "animate-spin" : ""} />
                            Refresh
                        </button>
                        <Link
                            to="/meetings/new"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg 
                                     transition-all shadow-lg flex-1 sm:flex-initial flex items-center justify-center gap-2"
                        >
                            <BiPlus />
                            New Meeting
                        </Link>
                    </div>
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

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-8"
                >
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4 text-white">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Link to="/meetings/new" className="bg-blue-800/40 hover:bg-blue-800/60 p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all">
                                <BiPlus className="text-3xl text-blue-400" />
                                <span className="text-sm text-white">New Meeting</span>
                            </Link>
                            <Link to="/meetings" className="bg-blue-800/40 hover:bg-blue-800/60 p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all">
                                <BiCalendar className="text-3xl text-green-400" />
                                <span className="text-sm text-white">All Meetings</span>
                            </Link>
                            <Link to="/tasks" className="bg-blue-800/40 hover:bg-blue-800/60 p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all">
                                <AiOutlineUnorderedList className="text-3xl text-yellow-400" />
                                <span className="text-sm text-white">My Tasks</span>
                            </Link>
                            <Link to="#" className="bg-blue-800/40 hover:bg-blue-800/60 p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all">
                                <BiCheckCircle className="text-3xl text-purple-400" />
                                <span className="text-sm text-white">Completed</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Calendar View */}
                {thisMonthMeetings.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                                <BiCalendar className="text-blue-400" />
                                Meetings This Month ({currentMonth} {currentYear})
                            </h2>
                            <div className="space-y-3">
                                {thisMonthMeetings.map((meeting) => {
                                    const meetingDate = new Date(meeting.date);
                                    const dayOfMonth = meetingDate.getDate();
                                    const dayName = meetingDate.toLocaleDateString('en-US', { weekday: 'short' });
                                    
                                    return (
                                        <motion.div
                                            key={meeting._id}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <Link
                                                to={`/meetings/${meeting._id}`}
                                                className="flex items-center gap-4 p-4 rounded-lg bg-blue-800/30 hover:bg-blue-800/40 
                                                         border border-blue-700/50 transition-all"
                                            >
                                                <div className="flex-shrink-0 w-14 h-14 bg-blue-700/50 rounded-lg flex flex-col items-center justify-center">
                                                    <span className="text-lg font-bold text-white">{dayOfMonth}</span>
                                                    <span className="text-xs text-blue-200">{dayName}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-white">{meeting.title}</h3>
                                                    <p className="text-sm text-blue-200">
                                                        {meetingDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {meeting.venue}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Recent Meetings & Actions Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
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

                {/* My Assigned Actions */}
                {myAssignedActions.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6"
                    >
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                                <AiOutlineUnorderedList className="text-yellow-400" />
                                My Assigned Actions
                            </h2>
                            <div className="space-y-3">
                                {myAssignedActions.map((action, index) => (
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
                                                        Due: {new Date(action.dueDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-yellow-300">
                                                        Status: {action.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Meetings You're Invited To */}
                {invitedMeetings && invitedMeetings.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6"
                    >
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                                <FaUserFriends className="text-green-400" />
                                Meetings You're Invited To
                            </h2>
                            <div className="space-y-3">
                                {invitedMeetings.map((meeting) => (
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
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}