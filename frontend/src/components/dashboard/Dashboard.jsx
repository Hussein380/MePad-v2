import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboard } from '../../services/api';
import { BiCalendar } from 'react-icons/bi';
import { AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineUnorderedList } from 'react-icons/ai';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import StatCard from '../shared/StatCard';

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
        <div className="min-h-screen bg-gray-50">
            <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome to Meeting Manager</h1>
                    <Link
                        to="/meetings/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
                    >
                        New Meeting
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <StatCard
                        title="Total Meetings"
                        value={stats.totalMeetings}
                        icon={<BiCalendar className="text-blue-500" />}
                    />
                    <StatCard
                        title="Upcoming"
                        value={stats.upcomingMeetings}
                        icon={<AiOutlineClockCircle className="text-green-500" />}
                    />
                    <StatCard
                        title="Pending Actions"
                        value={stats.pendingActions}
                        icon={<AiOutlineUnorderedList className="text-yellow-500" />}
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completedActions}
                        icon={<AiOutlineCheckCircle className="text-purple-500" />}
                    />
                </div>

                {/* Recent Meetings & Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Recent Meetings */}
                    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
                        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                            <BiCalendar className="text-blue-500" />
                            Recent Meetings
                        </h2>
                        <div className="space-y-2 sm:space-y-3">
                            {recentMeetings.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No recent meetings</p>
                            ) : (
                                recentMeetings.map((meeting) => (
                                    <Link
                                        key={meeting._id}
                                        to={`/meetings/${meeting._id}`}
                                        className="block p-2 sm:p-3 hover:bg-gray-50 rounded-md transition-colors border border-gray-100"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{meeting.title}</h3>
                                                <p className="text-xs sm:text-sm text-gray-500">{meeting.venue}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(meeting.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Pending Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
                        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                            <AiOutlineUnorderedList className="text-yellow-500" />
                            Pending Actions
                        </h2>
                        <div className="space-y-2 sm:space-y-3">
                            {pendingActions.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No pending actions</p>
                            ) : (
                                pendingActions.map((action) => (
                                    <Link
                                        key={action._id}
                                        to={`/meetings/${action.meetingId}`}
                                        className="block p-2 sm:p-3 hover:bg-gray-50 rounded-md transition-colors border border-gray-100"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{action.description}</h3>
                                                <p className="text-xs sm:text-sm text-gray-500">Assigned to: {action.assignedTo}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                Due: {new Date(action.dueDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 