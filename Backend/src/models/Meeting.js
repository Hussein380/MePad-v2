const mongoose = require('mongoose');

const actionPointSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    assignedTo: {
        type: String,
        required: true
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
        required: [true, 'Please add a title']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    venue: {
        type: String,
        required: [true, 'Please add a venue']
    },
    participants: [{
        name: String,
        email: String
    }],
    summary: {
        type: String,
        required: [true, 'Please add a summary']
    },
    actionPoints: [actionPointSchema],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema); 