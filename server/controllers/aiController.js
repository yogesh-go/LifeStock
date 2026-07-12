const Goal = require('../models/Goal');

// Simple keyword-based categorization (mock AI)
const categorizeByKeywords = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  if (text.match(/run|gym|fitness|workout|exercise|sport|yoga|weight|muscle/))
    return 'fitness';
  if (text.match(/study|learn|course|exam|degree|book|read|skill|coding|programming/))
    return 'education';
  if (text.match(/money|save|invest|stock|budget|income|salary|business|profit/))
    return 'finance';
  if (text.match(/health|doctor|diet|sleep|meditation|mental|therapy|habit/))
    return 'health';
  if (text.match(/job|career|promotion|interview|resume|work|project|startup/))
    return 'career';
  return 'personal';
};

// CATEGORIZE GOAL
exports.categorizeGoal = async (req, res) => {
  try {
    const { title, description, goalId } = req.body;

    const category = categorizeByKeywords(title, description || '');
    const isClear = title.length > 10;

    const result = {
      category,
      confidence: isClear ? 'high' : 'low',
      isClear,
      suggestion: isClear ? null : 'Please be more specific about your goal',
      deadline: 30
    };

    if (goalId) {
      await Goal.findByIdAndUpdate(goalId, { aiCategory: category });
    }

    res.json({ msg: 'Goal categorized successfully', result });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Categorization failed' });
  }
};

// VERIFY PROOF
exports.verifyProof = async (req, res) => {
  try {
    const { goalTitle, goalCategory, proofDescription } = req.body;

    const text = proofDescription.toLowerCase();
    const hasEvidence = text.length > 20;
    const hasKeywords = text.match(/completed|finished|achieved|done|screenshot|photo|certificate|proof/);

    const verificationScore = hasEvidence && hasKeywords ? 85 : hasEvidence ? 60 : 30;

    const result = {
      verificationScore,
      isLegitimate: verificationScore >= 60,
      reason: verificationScore >= 60
        ? 'Proof description contains sufficient evidence'
        : 'Proof description lacks sufficient detail',
      recommendation: verificationScore >= 70 ? 'approve' : verificationScore >= 50 ? 'review' : 'reject'
    };

    res.json({ msg: 'Proof verified', result });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Verification failed' });
  }
};

// GENERATE GOAL SUGGESTIONS
exports.generateGoalSuggestions = async (req, res) => {
  try {
    const { category } = req.body;

    const suggestions = {
      fitness: [
        { title: 'Run 5km every day', description: 'Build running habit for 30 days', suggestedDeadlineDays: 30 },
        { title: 'Do 100 pushups daily', description: 'Build upper body strength', suggestedDeadlineDays: 30 },
        { title: 'Lose 5kg in 2 months', description: 'Through diet and exercise', suggestedDeadlineDays: 60 },
        { title: 'Complete 30 day yoga challenge', description: 'Daily yoga practice', suggestedDeadlineDays: 30 },
        { title: 'Walk 10000 steps daily', description: 'Daily walking habit', suggestedDeadlineDays: 21 }
      ],
      education: [
        { title: 'Solve 150 LeetCode problems', description: 'DSA preparation for placements', suggestedDeadlineDays: 60 },
        { title: 'Complete a React course', description: 'Learn React from scratch', suggestedDeadlineDays: 30 },
        { title: 'Read 10 books this year', description: 'Reading habit development', suggestedDeadlineDays: 90 },
        { title: 'Learn System Design basics', description: 'Prepare for SDE interviews', suggestedDeadlineDays: 45 },
        { title: 'Get AWS certification', description: 'Cloud computing certification', suggestedDeadlineDays: 90 }
      ],
      finance: [
        { title: 'Save 10000 rupees this month', description: 'Monthly savings goal', suggestedDeadlineDays: 30 },
        { title: 'Start SIP investment', description: 'Begin monthly mutual fund SIP', suggestedDeadlineDays: 7 },
        { title: 'Create monthly budget', description: 'Track all expenses', suggestedDeadlineDays: 7 },
        { title: 'Build emergency fund', description: 'Save 3 months expenses', suggestedDeadlineDays: 90 },
        { title: 'Learn stock market basics', description: 'Study investing fundamentals', suggestedDeadlineDays: 30 }
      ],
      career: [
        { title: 'Apply to 10 companies this week', description: 'Campus placement preparation', suggestedDeadlineDays: 7 },
        { title: 'Build a portfolio project', description: 'Create impressive GitHub project', suggestedDeadlineDays: 30 },
        { title: 'Update LinkedIn profile', description: 'Professional online presence', suggestedDeadlineDays: 3 },
        { title: 'Get an internship', description: 'Industry experience', suggestedDeadlineDays: 60 },
        { title: 'Complete 5 mock interviews', description: 'Interview preparation', suggestedDeadlineDays: 14 }
      ],
      health: [
        { title: 'Sleep 8 hours daily', description: 'Fix sleep schedule', suggestedDeadlineDays: 21 },
        { title: 'Drink 3 litres of water daily', description: 'Hydration habit', suggestedDeadlineDays: 21 },
        { title: 'Meditate 10 minutes daily', description: 'Mindfulness practice', suggestedDeadlineDays: 30 },
        { title: 'Quit junk food for a month', description: 'Clean eating challenge', suggestedDeadlineDays: 30 },
        { title: 'Do annual health checkup', description: 'Complete medical checkup', suggestedDeadlineDays: 7 }
      ],
      personal: [
        { title: 'Journal every day', description: 'Daily reflection habit', suggestedDeadlineDays: 30 },
        { title: 'Learn a new skill', description: 'Personal development', suggestedDeadlineDays: 60 },
        { title: 'Call parents every day', description: 'Family connection habit', suggestedDeadlineDays: 30 },
        { title: 'Travel to a new city', description: 'Explore new places', suggestedDeadlineDays: 90 },
        { title: 'Volunteer for a cause', description: 'Give back to community', suggestedDeadlineDays: 30 }
      ]
    };

    const result = suggestions[category] || suggestions.personal;
    res.json({ msg: 'Goal suggestions generated', suggestions: result });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to generate suggestions' });
  }
};