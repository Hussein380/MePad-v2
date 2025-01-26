import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetings } from '../../services/api';
import toast from 'react-hot-toast';

export default function MeetingForm() {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        venue: '',
        summary: '',
        actionPoints: [],
        painPoints: [],
        participants: []
    });
    const [currentActionPoint, setCurrentActionPoint] = useState({
        description: '',
        assignedTo: '',
        dueDate: '',
        status: 'pending'
    });
    const [currentPainPoint, setCurrentPainPoint] = useState({
        description: '',
        severity: 'low',
        status: 'open'
    });
    const [currentParticipant, setCurrentParticipant] = useState({
        name: '',
        email: ''
    });
    const [showActionPointForm, setShowActionPointForm] = useState(false);
    const [showPainPointForm, setShowPainPointForm] = useState(false);
    const navigate = useNavigate();

    const handleAddActionPoint = () => {
        if (!currentActionPoint.description || !currentActionPoint.assignedTo || !currentActionPoint.dueDate) {
            toast.error('Please fill all action point fields');
            return;
        }
        setFormData({
            ...formData,
            actionPoints: [...formData.actionPoints, { ...currentActionPoint, id: Date.now() }]
        });
        if (!showActionPointForm) {
            setCurrentActionPoint({
                description: '',
                assignedTo: '',
                dueDate: '',
                status: 'pending'
            });
        }
        toast.success('Action point added');
    };

    const handleAddPainPoint = () => {
        if (!currentPainPoint.description) {
            toast.error('Please fill pain point description');
            return;
        }
        setFormData({
            ...formData,
            painPoints: [...formData.painPoints, { ...currentPainPoint, id: Date.now() }]
        });
        if (!showPainPointForm) {
            setCurrentPainPoint({
                description: '',
                severity: 'low',
                status: 'open'
            });
        }
        toast.success('Pain point added');
    };

    const handleRemoveActionPoint = (index) => {
        setFormData({
            ...formData,
            actionPoints: formData.actionPoints.filter((_, i) => i !== index)
        });
    };

    const handleRemovePainPoint = (index) => {
        setFormData({
            ...formData,
            painPoints: formData.painPoints.filter((_, i) => i !== index)
        });
    };

    const handleAddParticipant = () => {
        if (!currentParticipant.name || !currentParticipant.email) {
            toast.error('Please fill both name and email');
            return;
        }
        setFormData({
            ...formData,
            participants: [...(formData.participants || []), currentParticipant]
        });
        setCurrentParticipant({ name: '', email: '' });
    };

    const handleRemoveParticipant = (index) => {
        setFormData({
            ...formData,
            participants: formData.participants.filter((_, i) => i !== index)
        });
    };

    const validateForm = () => {
        if (!formData.title || !formData.date || !formData.venue || !formData.summary) {
            toast.error('Please fill in all required fields');
            return false;
        }
        
        if (formData.actionPoints.length > 0) {
            const validActionPoints = formData.actionPoints.every(point => 
                point.description && point.assignedTo && point.dueDate
            );
            if (!validActionPoints) {
                toast.error('Please complete all action point details');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            // Format the data before sending
            const meetingData = {
                title: formData.title,
                date: new Date(formData.date).toISOString(),
                venue: formData.venue,
                summary: formData.summary,
                actionPoints: formData.actionPoints.map(point => ({
                    description: point.description,
                    assignedTo: point.assignedTo,
                    dueDate: new Date(point.dueDate).toISOString(),
                    status: 'pending'
                })),
                participants: formData.participants.map(participant => ({
                    name: participant.name,
                    email: participant.email
                }))
            };

            console.log('Sending meeting data:', meetingData); // Debug log
            const response = await meetings.create(meetingData);
            console.log('Server response:', response); // Debug log
            
            toast.success('Meeting created successfully!');
            navigate('/meetings');
        } catch (error) {
            console.error('Error creating meeting:', error.response?.data || error);
            toast.error(error.response?.data?.error || 'Failed to create meeting. Please check all required fields.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Create Meeting</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Meeting Information */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            id="date"
                            type="date"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                            Venue
                        </label>
                        <input
                            id="venue"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={formData.venue}
                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                            Summary
                        </label>
                        <textarea
                            id="summary"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            rows="3"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        />
                    </div>
                </div>

                {/* Action Points Section */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Action Points</h3>
                        <button
                            type="button"
                            onClick={() => setShowActionPointForm(!showActionPointForm)}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            {showActionPointForm ? 'Done Adding' : 'Add Multiple'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Description"
                                className="flex-1 rounded-md border-gray-300"
                                value={currentActionPoint.description}
                                onChange={(e) => setCurrentActionPoint({
                                    ...currentActionPoint,
                                    description: e.target.value
                                })}
                            />
                            <input
                                type="text"
                                placeholder="Assigned To"
                                className="w-48 rounded-md border-gray-300"
                                value={currentActionPoint.assignedTo}
                                onChange={(e) => setCurrentActionPoint({
                                    ...currentActionPoint,
                                    assignedTo: e.target.value
                                })}
                            />
                            <input
                                type="date"
                                className="w-48 rounded-md border-gray-300"
                                value={currentActionPoint.dueDate}
                                onChange={(e) => setCurrentActionPoint({
                                    ...currentActionPoint,
                                    dueDate: e.target.value
                                })}
                            />
                            <button
                                type="button"
                                onClick={handleAddActionPoint}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md"
                            >
                                Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.actionPoints.map((point, index) => (
                                <div key={point.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <span>{point.description}</span>
                                        <span className="text-gray-600">Assigned to: {point.assignedTo}</span>
                                        <span className="text-gray-600">Due: {point.dueDate}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveActionPoint(index)}
                                        className="ml-4 text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pain Points Section */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Pain Points</h3>
                        <button
                            type="button"
                            onClick={() => setShowPainPointForm(!showPainPointForm)}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            {showPainPointForm ? 'Done Adding' : 'Add Multiple'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Description"
                                className="flex-1 rounded-md border-gray-300"
                                value={currentPainPoint.description}
                                onChange={(e) => setCurrentPainPoint({
                                    ...currentPainPoint,
                                    description: e.target.value
                                })}
                            />
                            <select
                                className="w-32 rounded-md border-gray-300"
                                value={currentPainPoint.severity}
                                onChange={(e) => setCurrentPainPoint({
                                    ...currentPainPoint,
                                    severity: e.target.value
                                })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleAddPainPoint}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md"
                            >
                                Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.painPoints.map((point, index) => (
                                <div key={point.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <span>{point.description}</span>
                                        <span className="text-gray-600">Severity: {point.severity}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePainPoint(index)}
                                        className="ml-4 text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Participants Section */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Participants</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Name"
                                className="flex-1 rounded-md border-gray-300"
                                value={currentParticipant.name}
                                onChange={(e) => setCurrentParticipant({
                                    ...currentParticipant,
                                    name: e.target.value
                                })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 rounded-md border-gray-300"
                                value={currentParticipant.email}
                                onChange={(e) => setCurrentParticipant({
                                    ...currentParticipant,
                                    email: e.target.value
                                })}
                            />
                            <button
                                type="button"
                                onClick={handleAddParticipant}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md"
                            >
                                Add
                            </button>
                        </div>
                        {formData.participants.map((participant, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span>{participant.name}</span>
                                <span className="text-sm text-gray-600">
                                    Email: {participant.email}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveParticipant(index)}
                                    className="text-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/meetings')}
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