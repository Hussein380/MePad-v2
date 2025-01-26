import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboard } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import StatCard from '../shared/StatCard';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await dashboard.getData();
            setData(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Welcome to Meeting Manager</h1>
                <Link
                    to="/meetings/new"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                    New Meeting
                </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Meetings" value={data.stats.totalMeetings} />
                <StatCard title="Upcoming Meetings" value={data.stats.upcomingMeetings} />
                <StatCard title="Pending Actions" value={data.stats.pendingActions} />
                <StatCard title="Completed Actions" value={data.stats.completedActions} />
            </div>

            {/* Recent Meetings */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Meetings</h2>
                    <Link to="/meetings" className="text-primary-600 hover:text-primary-700">
                        View All
                    </Link>
                </div>
                <div className="space-y-4">
                    {data.recentMeetings.map((meeting) => (
                        <div key={meeting._id} className="border-b pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{meeting.title}</h3>
                                    <p className="text-sm text-gray-600">{meeting.summary}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDate(meeting.date)} at {meeting.venue}
                                    </p>
                                </div>
                                <Link
                                    to={`/meetings/${meeting._id}`}
                                    className="text-primary-600 hover:text-primary-700"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                    {data.recentMeetings.length === 0 && (
                        <p className="text-gray-500 text-center">No recent meetings</p>
                    )}
                </div>
            </div>

            {/* Pending Action Points */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Pending Action Points</h2>
                <div className="space-y-4">
                    {data.pendingActions.map((action) => (
                        <div key={action._id} className="border-b pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{action.description}</h3>
                                    <p className="text-sm text-gray-600">
                                        From: {action.meetingTitle}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Assigned to: {action.assignedTo}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Due: {formatDate(action.dueDate)}
                                    </p>
                                </div>
                                <Link
                                    to={`/meetings/${action.meetingId}`}
                                    className="text-primary-600 hover:text-primary-700"
                                >
                                    Go to Meeting
                                </Link>
                            </div>
                        </div>
                    ))}
                    {data.pendingActions.length === 0 && (
                        <p className="text-gray-500 text-center">No pending action points</p>
                    )}
                </div>
            </div>
        </div>
    );
} 