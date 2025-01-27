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
        status: initialData.status || 'upcoming',
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
    const [showParticipantForm, setShowParticipantForm] = useState(false);
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
        setCurrentActionPoint({
            description: '',
            assignedTo: '',
            dueDate: '',
            status: 'pending'
        });
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
        setCurrentPainPoint({
            description: '',
            severity: 'low',
            status: 'open'
        });
        setShowPainPointForm(false);
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
            participants: [...formData.participants, { ...currentParticipant, id: Date.now() }]
        });
        setCurrentParticipant({ name: '', email: '' });
        toast.success('Participant added');
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
            const meetingData = {
                title: formData.title,
                date: new Date(formData.date).toISOString(),
                venue: formData.venue,
                summary: formData.summary,
                status: formData.status,
                actionPoints: formData.actionPoints.map(point => ({
                    description: point.description,
                    assignedTo: point.assignedTo,
                    dueDate: new Date(point.dueDate).toISOString(),
                    status: 'pending'
                })),
                painPoints: formData.painPoints.map(point => ({
                    description: point.description,
                    severity: point.severity,
                    status: 'open'
                })),
                participants: formData.participants.map(participant => ({
                    name: participant.name,
                    email: participant.email
                }))
            };

            await meetings.create(meetingData);
            toast.success('Meeting created successfully!');
            navigate('/meetings');
        } catch (error) {
            console.error('Error creating meeting:', error);
            toast.error('Failed to create meeting');
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
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                required
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
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

                {/* Action Points Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-medium">Action Points</h3>
                        <button
                            type="button"
                            onClick={() => setShowActionPointForm(true)}
                            className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                            Add Action Point
                        </button>
                    </div>

                    {showActionPointForm && (
                        <div className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                            <input
                                type="text"
                                placeholder="Description"
                                value={currentActionPoint.description}
                                onChange={(e) => setCurrentActionPoint({ ...currentActionPoint, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="Assigned To"
                                    value={currentActionPoint.assignedTo}
                                    onChange={(e) => setCurrentActionPoint({ ...currentActionPoint, assignedTo: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                                <input
                                    type="date"
                                    value={currentActionPoint.dueDate}
                                    onChange={(e) => setCurrentActionPoint({ ...currentActionPoint, dueDate: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddActionPoint}
                                className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    )}

                    {/* Display added action points */}
                    <div className="space-y-2">
                        {formData.actionPoints.map((point, index) => (
                            <div key={point.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-md">
                                <div>
                                    <p className="font-medium">{point.description}</p>
                                    <p className="text-sm text-gray-600">Assigned to: {point.assignedTo}</p>
                                    <p className="text-sm text-gray-600">Due: {new Date(point.dueDate).toLocaleDateString()}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveActionPoint(index)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pain Points Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-medium">Pain Points</h3>
                        <button
                            type="button"
                            onClick={() => setShowPainPointForm(true)}
                            className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
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
                            />
                            <select
                                value={currentPainPoint.severity}
                                onChange={(e) => setCurrentPainPoint({ ...currentPainPoint, severity: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleAddPainPoint}
                                className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    )}

                    {/* Display added pain points */}
                    <div className="space-y-2">
                        {formData.painPoints.map((point, index) => (
                            <div key={point.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-md">
                                <div>
                                    <p className="font-medium">{point.description}</p>
                                    <p className="text-sm text-gray-600">
                                        Severity: <span className={`${
                                            point.severity === 'high' ? 'text-red-600' :
                                            point.severity === 'medium' ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>{point.severity}</span>
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemovePainPoint(index)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Participants - Only adding responsive classes */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-base font-medium">Participants</h3>
                        <button
                            type="button"
                            onClick={() => setShowParticipantForm(true)}
                            className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                            Add Participant
                        </button>
                    </div>

                    {showParticipantForm && (
                        <div className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                            <input
                                type="text"
                                placeholder="Name"
                                value={currentParticipant.name}
                                onChange={(e) => setCurrentParticipant({ ...currentParticipant, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={currentParticipant.email}
                                onChange={(e) => setCurrentParticipant({ ...currentParticipant, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleAddParticipant}
                                className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    )}

                    <div className="space-y-2">
                        {formData.participants.map((participant, index) => (
                            <div key={participant.id || index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                <div>
                                    <p className="font-medium">{participant.name}</p>
                                    <p className="text-sm text-gray-600">{participant.email}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveParticipant(index)}
                                    className="text-red-600 hover:text-red-700"
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