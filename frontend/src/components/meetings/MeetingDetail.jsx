import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { meetings } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function MeetingDetail() {
    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMeeting, setEditedMeeting] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMeetingDetails();
    }, [id]);

    const fetchMeetingDetails = async () => {
        try {
            const response = await meetings.getOne(id);
            setMeeting(response.data.data);
            setEditedMeeting(response.data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch meeting details');
            navigate('/meetings');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await meetings.update(id, editedMeeting);
            setMeeting(editedMeeting);
            setIsEditing(false);
            toast.success('Meeting updated successfully');
            fetchMeetingDetails();
        } catch (error) {
            toast.error('Failed to update meeting');
        }
    };

    const handleCancel = () => {
        setEditedMeeting(meeting);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedMeeting(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleActionPointStatusUpdate = async (actionId, newStatus) => {
        try {
            await meetings.updateActionPoint(id, actionId, { status: newStatus });
            toast.success('Action point updated successfully');
            fetchMeetingDetails();
        } catch (error) {
            toast.error('Failed to update action point');
        }
    };

    const handleAddActionPoint = async (actionPoint) => {
        try {
            await meetings.addActionPoint(id, actionPoint);
            toast.success('Action point added successfully');
            fetchMeetingDetails();
        } catch (error) {
            toast.error('Failed to add action point');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!meeting) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Meeting Header */}
            <div className="bg-white p-6 rounded-lg shadow">
                {isEditing ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            value={editedMeeting.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="date"
                            name="date"
                            value={editedMeeting.date.split('T')[0]}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="venue"
                            value={editedMeeting.venue}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <textarea
                            name="summary"
                            value={editedMeeting.summary}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            rows="3"
                        />
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-4">{meeting.title}</h1>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <p>Date: {formatDate(meeting.date)}</p>
                            <p>Venue: {meeting.venue}</p>
                        </div>
                    </>
                )}
            </div>

            {/* Meeting Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <p className="text-gray-600">{meeting.summary}</p>
            </div>

            {/* Action Points */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Action Points</h2>
                    <button
                        onClick={() => setShowAddActionPoint(true)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                        Add Action Point
                    </button>
                </div>
                <div className="space-y-4">
                    {meeting.actionPoints?.map((action) => (
                        <div key={action._id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="font-medium">{action.description}</p>
                                    <p className="text-sm text-gray-600">
                                        Assigned to: {action.assignedTo}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Due: {formatDate(action.dueDate)}
                                    </p>
                                </div>
                                <select
                                    value={action.status}
                                    onChange={(e) => 
                                        handleActionPointStatusUpdate(action._id, e.target.value)
                                    }
                                    className="rounded-md border-gray-300 shadow-sm"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Participants */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Participants</h2>
                <div className="grid gap-2">
                    {meeting.participants?.map((participant, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium">{participant.name}</span>
                            <span className="text-gray-600">{participant.email}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
                <button
                    onClick={() => navigate('/meetings')}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                    Back to Meetings
                </button>
                {isEditing ? (
                    <>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                            Save Changes
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                        Edit Meeting
                    </button>
                )}
            </div>
        </div>
    );
} 