import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetings } from '../../services/api';
import toast from 'react-hot-toast';

export default function MeetingForm() {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        venue: '',
        summary: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await meetings.create({
                ...formData,
                participants: [] // Initialize with empty participants array
            });
            toast.success('Meeting created successfully!');
            navigate('/meetings');
        } catch (error) {
            console.error('Error creating meeting:', error);
            toast.error(error.message || 'Failed to create meeting');
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Create Meeting</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
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
                        name="date"
                        type="date"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
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
                        name="venue"
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
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
                        name="summary"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                    Create Meeting
                </button>
            </form>
        </div>
    );
} 