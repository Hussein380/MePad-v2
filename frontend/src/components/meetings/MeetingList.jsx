import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meetings } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function MeetingList() {
    const [meetingsList, setMeetingsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await meetings.getAll();
            setMeetingsList(response.data.data);
        } catch (error) {
            console.error('Error fetching meetings:', error);
            setError(error.displayMessage || 'Failed to fetch meetings');
            toast.error(error.displayMessage || 'Failed to fetch meetings');
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
            toast.error(error.displayMessage || 'Failed to delete meeting');
        }
    };

    if (loading) return <div className="text-center py-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div></div>;
    
    if (error) return <div className="text-center py-8 text-red-500">{error}. <button onClick={fetchMeetings} className="text-blue-500 underline">Try again</button></div>;

    if (!meetingsList.length) return <div className="text-center py-8">No meetings found. <Link to="/meetings/new" className="text-blue-500 underline">Create a new meeting</Link></div>;

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
                {meetingsList.map((meeting) => (
                    <div key={meeting._id} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">{meeting.title}</h2>
                                <p className="text-gray-600">{formatDate(meeting.date)}</p>
                                <p className="text-gray-600">{meeting.venue}</p>
                            </div>
                            <div className="space-x-2">
                                <Link
                                    to={`/meetings/${meeting._id}`}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    View
                                </Link>
                                <button
                                    onClick={() => handleDelete(meeting._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}