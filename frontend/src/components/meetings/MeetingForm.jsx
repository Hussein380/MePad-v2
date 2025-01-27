import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetings } from '../../services/api';
import toast from 'react-hot-toast';

export default function MeetingForm({ onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        date: initialData.date || '',
        venue: initialData.venue || '',
        summary: initialData.summary || '',
        actionPoints: initialData.actionPoints || [],
        painPoints: initialData.painPoints || [],
        participants: initialData.participants || []
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
        <div className="w-full max-w-3xl mx-auto px-3 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Meeting Details - Only adding responsive classes */}
                <div className="w-full space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">Venue</label>
                            <input
                                type="text"
                                value={formData.venue}
                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">Summary</label>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm resize-y"
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Action Points - Only adding responsive classes */}
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="text-base font-medium">Action Points</h3>
                        <button
                            type="button"
                            onClick={() => setShowActionPointForm(true)}
                            className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 whitespace-nowrap"
                        >
                            Add Action Point
                        </button>
                    </div>

                    {/* Keep original action points form and list, just add w-full and responsive classes */}
                    {showActionPointForm && (
                        <div className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                            <input
                                type="text"
                                placeholder="Description"
                                value={currentActionPoint.description}
                                onChange={(e) => setCurrentActionPoint({ ...currentActionPoint, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                required
                            />
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <input
                                    type="text"
                                    placeholder="Assigned To"
                                    value={currentActionPoint.assignedTo}
                                    onChange={(e) => setCurrentActionPoint({ ...currentActionPoint, assignedTo: e.target.value })}
                                    className="w-full sm:flex-1 px-3 py-2 border rounded-md text-sm"
                                    required
                                />
                                <input
                                    type="date"
                                    value={currentActionPoint.dueDate}
                                    onChange={(e) => setCurrentActionPoint({ ...currentActionPoint, dueDate: e.target.value })}
                                    className="w-full sm:flex-1 px-3 py-2 border rounded-md text-sm"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {formData.actionPoints.map((point, index) => (
                            <div key={point.id} className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={point.description}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        actionPoints: formData.actionPoints.map((p, i) =>
                                            i === index ? { ...p, description: e.target.value } : p
                                        )
                                    })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    required
                                />
                                <div className="flex flex-col sm:flex-row gap-2 w-full">
                                    <input
                                        type="text"
                                        placeholder="Assigned To"
                                        value={point.assignedTo}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            actionPoints: formData.actionPoints.map((p, i) =>
                                                i === index ? { ...p, assignedTo: e.target.value } : p
                                            )
                                        })}
                                        className="w-full sm:flex-1 px-3 py-2 border rounded-md text-sm"
                                        required
                                    />
                                    <input
                                        type="date"
                                        value={point.dueDate}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            actionPoints: formData.actionPoints.map((p, i) =>
                                                i === index ? { ...p, dueDate: e.target.value } : p
                                            )
                                        })}
                                        className="w-full sm:flex-1 px-3 py-2 border rounded-md text-sm"
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveActionPoint(index)}
                                    className="w-full sm:w-auto text-red-600 px-3 py-2 text-sm rounded-md hover:bg-red-50"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pain Points - Only adding responsive classes */}
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="text-base font-medium">Pain Points</h3>
                        <button
                            type="button"
                            onClick={() => setShowPainPointForm(true)}
                            className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 whitespace-nowrap"
                        >
                            Add Pain Point
                        </button>
                    </div>

                    {showPainPointForm && (
                        <div className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                            <input
                                type="text"
                                placeholder="Description"
                                value={currentPainPoint.description}
                                onChange={(e) => setCurrentPainPoint({ ...currentPainPoint, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                required
                            />
                            <select
                                value={currentPainPoint.severity}
                                onChange={(e) => setCurrentPainPoint({ ...currentPainPoint, severity: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                required
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    )}

                    <div className="space-y-3">
                        {formData.painPoints.map((point, index) => (
                            <div key={point.id} className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={point.description}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        painPoints: formData.painPoints.map((p, i) =>
                                            i === index ? { ...p, description: e.target.value } : p
                                        )
                                    })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    required
                                />
                                <select
                                    value={point.severity}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        painPoints: formData.painPoints.map((p, i) =>
                                            i === index ? { ...p, severity: e.target.value } : p
                                        )
                                    })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleRemovePainPoint(index)}
                                    className="w-full sm:w-auto text-red-600 px-3 py-2 text-sm rounded-md hover:bg-red-50"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Participants - Only adding responsive classes */}
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="text-base font-medium">Participants</h3>
                        <button
                            type="button"
                            onClick={() => setShowActionPointForm(true)}
                            className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 whitespace-nowrap"
                        >
                            Add Participant
                        </button>
                    </div>

                    {showActionPointForm && (
                        <div className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                            <input
                                type="text"
                                placeholder="Name"
                                value={currentParticipant.name}
                                onChange={(e) => setCurrentParticipant({ ...currentParticipant, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={currentParticipant.email}
                                onChange={(e) => setCurrentParticipant({ ...currentParticipant, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-3">
                        {formData.participants.map((participant, index) => (
                            <div key={participant.name} className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={participant.name}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        participants: formData.participants.map((p, i) =>
                                            i === index ? { ...p, name: e.target.value } : p
                                        )
                                    })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={participant.email}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        participants: formData.participants.map((p, i) =>
                                            i === index ? { ...p, email: e.target.value } : p
                                        )
                                    })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveParticipant(index)}
                                    className="w-full sm:w-auto text-red-600 px-3 py-2 text-sm rounded-md hover:bg-red-50"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                        Save Meeting
                    </button>
                </div>
            </form>
        </div>
    );
} 