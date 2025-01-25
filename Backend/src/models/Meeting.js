const mongoose = require('mongoose');

const actionPointSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

const meetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    venue: {
        type: String,
        required: [true, 'Please add a venue']
    },
    summary: {
        type: String,
        required: [true, 'Please add a summary']
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actionPoints: [actionPointSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema); 