const Proof = require('../models/Proof');
const Goal = require('../models/Goal');

// SUBMIT PROOF
exports.submitProof = async (req, res) => {
  try {
    const { description, fileUrl, fileType } = req.body;
    const goalId = req.params.id;

    // Get goal
    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    // Only creator can submit proof
    if (goal.creator.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Only goal creator can submit proof' });

    if (goal.status !== 'active')
      return res.status(400).json({ msg: 'Goal is not active' });

    // Create proof
    const proof = new Proof({
      goal: goalId,
      submittedBy: req.user.id,
      description,
      fileUrl,
      fileType,
      status: 'pending'
    });

    await proof.save();

    // Add proof to goal and set status to under_review
    goal.proofs.push(proof._id);
    goal.status = 'under_review';
    await goal.save();

    res.status(201).json({
      msg: 'Proof submitted successfully',
      proof
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET PROOFS FOR A GOAL
exports.getProofs = async (req, res) => {
  try {
    const proofs = await Proof.find({ goal: req.params.id })
      .populate('submittedBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(proofs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// FLAG PROOF AS FAKE
exports.flagProof = async (req, res) => {
  try {
    const { reason } = req.body;
    const proof = await Proof.findById(req.params.proofId);

    if (!proof) return res.status(404).json({ msg: 'Proof not found' });

    // Check if already flagged by this user
    if (proof.flaggedBy.includes(req.user.id))
      return res.status(400).json({ msg: 'You already flagged this proof' });

    proof.flaggedBy.push(req.user.id);
    proof.flagReason = reason;

    // If flagged by 3 or more users → mark as flagged
    if (proof.flaggedBy.length >= 3) {
      proof.status = 'flagged';
    }

    await proof.save();

    res.json({ msg: 'Proof flagged successfully', proof });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// APPROVE PROOF (admin/community)
exports.approveProof = async (req, res) => {
  try {
    const proof = await Proof.findById(req.params.proofId);
    if (!proof) return res.status(404).json({ msg: 'Proof not found' });

    proof.status = 'approved';
    await proof.save();

    // Mark goal as achieved
    const goal = await Goal.findById(proof.goal);
    goal.status = 'achieved';
    await goal.save();

    res.json({ msg: 'Proof approved, goal marked as achieved', proof });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};