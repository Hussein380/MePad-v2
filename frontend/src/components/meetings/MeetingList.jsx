import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meetings } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function MeetingList() {
    const [meetingList, setMeetingList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await meetings.getAll();
            setMeetingList(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch meetings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this meeting?')) return;
        
        try {
            await meetings.delete(id);
            toast.success('Meeting deleted successfully');
            fetchMeetings();
        } catch (error) {
            toast.error('Failed to delete meeting');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Meetings</h1>
                <Link
                    to="/meetings/new"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                    New Meeting
                </Link>
            </div>

            <div className="grid gap-4">
                {meetingList.map((meeting) => (
                    <div key={meeting._id} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">{meeting.title}</h2>
                                <p className="text-gray-600">{meeting.summary}</p>
                                <div className="text-sm text-gray-500">
                                    <p>Date: {formatDate(meeting.date)}</p>
                                    <p>Venue: {meeting.venue}</p>
                                    <p>Participants: {meeting.participants.length}</p>
                                    <p>Action Points: {meeting.actionPoints.length}</p>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Link
                                    to={`/meetings/${meeting._id}`}
                                    className="text-primary-600 hover:text-primary-700"
                                >
                                    View Details
                                </Link>
                                <button
                                    onClick={() => handleDelete(meeting._id)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {meetingList.length === 0 && (
                    <p className="text-center text-gray-500">
                        No meetings found. Create your first meeting!
                    </p>
                )}
            </div>
        </div>
    );
} 