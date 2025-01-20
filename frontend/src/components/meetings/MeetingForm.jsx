import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetings } from '../../services/api';
import toast from 'react-hot-toast';

export default function MeetingForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        venue: '',
        participants: [{ name: '', email: '' }],
        summary: '',
        actionPoints: [{
            description: '',
            assignedTo: '',
            dueDate: ''
        }]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await meetings.create(formData);
            toast.success('Meeting created successfully');
            navigate(`/meetings/${response.data.data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create meeting');
        }
    };

    const addParticipant = () => {
        setFormData({
            ...formData,
            participants: [...formData.participants, { name: '', email: '' }]
        });
    };

    const removeParticipant = (index) => {
        const newParticipants = formData.participants.filter((_, i) => i !== index);
        setFormData({ ...formData, participants: newParticipants });
    };

    const addActionPoint = () => {
        setFormData({
            ...formData,
            actionPoints: [...formData.actionPoints, {
                description: '',
                assignedTo: '',
                dueDate: ''
            }]
        });
    };

    const removeActionPoint = (index) => {
        const newActionPoints = formData.actionPoints.filter((_, i) => i !== index);
        setFormData({ ...formData, actionPoints: newActionPoints });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Meeting</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Meeting Details */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="datetime-local"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Venue</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                value={formData.venue}
                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Participants */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                    {formData.participants.map((participant, index) => (
                        <div key={index} className="flex gap-4 mb-2">
                            <input
                                type="text"
                                placeholder="Name"
                                className="flex-1 rounded-md border-gray-300 shadow-sm"
                                value={participant.name}
                                onChange={(e) => {
                                    const newParticipants = [...formData.participants];
                                    newParticipants[index].name = e.target.value;
                                    setFormData({ ...formData, participants: newParticipants });
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 rounded-md border-gray-300 shadow-sm"
                                value={participant.email}
                                onChange={(e) => {
                                    const newParticipants = [...formData.participants];
                                    newParticipants[index].email = e.target.value;
                                    setFormData({ ...formData, participants: newParticipants });
                                }}
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeParticipant(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addParticipant}
                        className="text-sm text-primary-600 hover:text-primary-800"
                    >
                        + Add Participant
                    </button>
                </div>

                {/* Summary */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Summary</label>
                    <textarea
                        required
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    />
                </div>

                {/* Action Points */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Action Points</label>
                    {formData.actionPoints.map((action, index) => (
                        <div key={index} className="space-y-2 mb-4 p-4 bg-gray-50 rounded-md">
                            <input
                                type="text"
                                placeholder="Description"
                                className="block w-full rounded-md border-gray-300 shadow-sm"
                                value={action.description}
                                onChange={(e) => {
                                    const newActions = [...formData.actionPoints];
                                    newActions[index].description = e.target.value;
                                    setFormData({ ...formData, actionPoints: newActions });
                                }}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="email"
                                    placeholder="Assigned To (Email)"
                                    className="rounded-md border-gray-300 shadow-sm"
                                    value={action.assignedTo}
                                    onChange={(e) => {
                                        const newActions = [...formData.actionPoints];
                                        newActions[index].assignedTo = e.target.value;
                                        setFormData({ ...formData, actionPoints: newActions });
                                    }}
                                />
                                <input
                                    type="date"
                                    className="rounded-md border-gray-300 shadow-sm"
                                    value={action.dueDate}
                                    onChange={(e) => {
                                        const newActions = [...formData.actionPoints];
                                        newActions[index].dueDate = e.target.value;
                                        setFormData({ ...formData, actionPoints: newActions });
                                    }}
                                />
                            </div>
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeActionPoint(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove Action Point
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addActionPoint}
                        className="text-sm text-primary-600 hover:text-primary-800"
                    >
                        + Add Action Point
                    </button>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                        Create Meeting
                    </button>
                </div>
            </form>
        </div>
    );
} 