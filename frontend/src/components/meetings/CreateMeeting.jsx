export default function CreateMeeting() {
    // ... state and handlers stay the same

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Create New Meeting</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... other form fields stay the same ... */}

                {/* Participants Section - Updated for mobile responsiveness */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-lg font-semibold">Participants</h3>
                        <button
                            type="button"
                            onClick={handleAddParticipant}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 
                                     transition-colors w-full sm:w-auto text-center whitespace-nowrap"
                        >
                            Add Participant
                        </button>
                    </div>

                    {participants.map((participant, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-md"
                        >
                            <div className="w-full sm:w-1/3">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={participant.name}
                                    onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="w-full sm:w-1/3">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={participant.email}
                                    onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="w-full sm:w-1/3">
                                <input
                                    type="text"
                                    placeholder="Role"
                                    value={participant.role}
                                    onChange={(e) => handleParticipantChange(index, 'role', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveParticipant(index)}
                                className="text-red-600 hover:text-red-700 px-2 py-1 rounded-md 
                                         hover:bg-red-50 transition-colors w-full sm:w-auto text-center"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 
                                 transition-colors w-full sm:w-auto text-center"
                    >
                        Create Meeting
                    </button>
                </div>
            </form>
        </div>
    );
} 