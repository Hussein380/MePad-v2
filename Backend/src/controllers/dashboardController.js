const Meeting = require('../models/Meeting');
const Task = require('../models/Task');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = asyncHandler(async (req, res) => {
    // Get all meetings for the user
    const meetings = await Meeting.find({ createdBy: req.user.id })
        .sort('-date')
        .select('title date venue summary actionPoints');

    // Calculate statistics
    const stats = {
        totalMeetings: meetings.length,
        upcomingMeetings: meetings.filter(m => new Date(m.date) > new Date()).length,
        pendingActions: meetings.reduce((acc, meeting) => 
            acc + meeting.actionPoints.filter(ap => ap.status === 'pending').length, 0),
        completedActions: meetings.reduce((acc, meeting) => 
            acc + meeting.actionPoints.filter(ap => ap.status === 'completed').length, 0)
    };

    // Get recent meetings
    const recentMeetings = meetings.slice(0, 5);

    // Get upcoming meetings
    const upcomingMeetings = meetings
        .filter(m => new Date(m.date) > new Date())
        .slice(0, 5);

    // Get pending action points across all meetings
    const pendingActions = meetings
        .flatMap(meeting => meeting.actionPoints
            .filter(ap => ap.status === 'pending')
            .map(ap => ({
                ...ap.toObject(),
                meetingTitle: meeting.title,
                meetingId: meeting._id
            })))
        .slice(0, 5);

    res.status(200).json({
        success: true,
        data: {
            stats,
            recentMeetings,
            upcomingMeetings,
            pendingActions
        }
    });
});

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
exports.getAdminDashboard = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Access denied. Admin only.');
    }

    // Get all meetings with tasks and participants
    const meetings = await Meeting.find()
        .populate('participants', 'email')
        .populate('tasks');

    const stats = {
        totalMeetings: meetings.length,
        totalParticipants: await User.countDocuments({ role: 'participant' }),
        totalTasks: await Task.countDocuments(),
        completedTasks: await Task.countDocuments({ status: 'completed' })
    };

    res.status(200).json({
        success: true,
        data: {
            stats,
            meetings
        }
    });
});

// @desc    Get participant dashboard data
// @route   GET /api/dashboard/participant
// @access  Private
exports.getParticipantDashboard = asyncHandler(async (req, res) => {
    // Get meetings where user is a participant
    const meetings = await Meeting.find({
        participants: req.user.id
    }).populate('tasks');

    // Get tasks assigned to user
    const tasks = await Task.find({ assignedTo: req.user.id });

    const stats = {
        upcomingMeetings: meetings.filter(m => new Date(m.date) > new Date()).length,
        pendingTasks: tasks.filter(t => t.status !== 'completed').length,
        completedTasks: tasks.filter(t => t.status === 'completed').length
    };

    res.status(200).json({
        success: true,
        data: {
            stats,
            meetings,
            tasks
        }
    });
}); 