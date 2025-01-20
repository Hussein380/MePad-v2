const Meeting = require('../models/Meeting');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const Task = require('../models/Task');

// @desc    Create new meeting
// @route   POST /api/meetings
// @access  Private
exports.createMeeting = asyncHandler(async (req, res) => {
    const { title, date, venue, participants, summary, actionPoints } = req.body;

    const meeting = await Meeting.create({
        title,
        date,
        venue,
        participants,
        summary,
        actionPoints,
        createdBy: req.user.id
    });

    res.status(201).json({
        success: true,
        data: meeting
    });
});

// @desc    Add pain point to meeting
// @route   POST /api/meetings/:id/painpoints
// @access  Private (Admin only)
exports.addPainPoint = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    meeting.painPoints.push({
        description,
        addedBy: req.user.id,
        addedAt: Date.now(),
        status: 'open'
    });

    await meeting.save();

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Update pain point status
// @route   PUT /api/meetings/:id/painpoints/:pointId
// @access  Private (Admin only)
exports.updatePainPoint = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    const painPoint = meeting.painPoints.id(req.params.pointId);
    if (!painPoint) {
        res.status(404);
        throw new Error('Pain point not found');
    }

    painPoint.status = status;
    await meeting.save();

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Add participant to meeting
// @route   POST /api/meetings/:id/participants
// @access  Private (Admin only)
exports.addParticipant = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (meeting.participants.includes(user._id)) {
        res.status(400);
        throw new Error('User already added to meeting');
    }

    meeting.participants.push(user._id);
    await meeting.save();

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Remove participant from meeting
// @route   DELETE /api/meetings/:id/participants/:userId
// @access  Private (Admin only)
exports.removeParticipant = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    meeting.participants = meeting.participants.filter(
        p => p.toString() !== req.params.userId
    );

    await meeting.save();

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Private
exports.getMeetings = asyncHandler(async (req, res) => {
    const meetings = await Meeting.find({ createdBy: req.user.id })
        .sort('-date');

    res.status(200).json({
        success: true,
        count: meetings.length,
        data: meetings
    });
});

// @desc    Get single meeting
// @route   GET /api/meetings/:id
// @access  Private
exports.getMeeting = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    // Check if user owns the meeting
    if (meeting.createdBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to access this meeting');
    }

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Update meeting
// @route   PUT /api/meetings/:id
// @access  Private
exports.updateMeeting = asyncHandler(async (req, res) => {
    let meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    // Check if user owns the meeting
    if (meeting.createdBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to update this meeting');
    }

    meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Delete meeting
// @route   DELETE /api/meetings/:id
// @access  Private
exports.deleteMeeting = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    // Check if user owns the meeting
    if (meeting.createdBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to delete this meeting');
    }

    await meeting.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get all pain points for a meeting
// @route   GET /api/meetings/:id/painpoints
// @access  Private
exports.getPainPoints = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id)
        .populate('painPoints.addedBy', 'email');

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    res.status(200).json({
        success: true,
        count: meeting.painPoints.length,
        data: meeting.painPoints
    });
});

// @desc    Update action point status
// @route   PUT /api/meetings/:id/action-points/:actionId
// @access  Private
exports.updateActionPoint = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    const actionPoint = meeting.actionPoints.id(req.params.actionId);
    if (!actionPoint) {
        res.status(404);
        throw new Error('Action point not found');
    }

    actionPoint.status = req.body.status;
    await meeting.save();

    res.status(200).json({
        success: true,
        data: actionPoint
    });
}); 