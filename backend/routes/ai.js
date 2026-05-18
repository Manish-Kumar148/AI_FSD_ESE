const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Employee = require('../models/Employee');
const axios = require('axios');

// @route   POST api/ai/recommend
// @desc    Generate AI recommendation for an employee or overall
// @access  Private
router.post('/recommend', auth, async (req, res) => {
  try {
    const { employeeId, type } = req.body; // type can be 'promotion', 'training', 'feedback', 'ranking'
    
    let prompt = "";
    
    if (type === 'ranking') {
      const employees = await Employee.find().select('name department performanceScore skills experience');
      prompt = `Here is a list of employees in JSON format: ${JSON.stringify(employees)}. Please provide a ranked list based on their performance score and experience. Highlight top performers for promotion. Respond in Markdown format.`;
    } else {
      if (!employeeId) {
        return res.status(400).json({ msg: 'Employee ID is required for this recommendation type' });
      }
      
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ msg: 'Employee not found' });
      }
      
      const empData = `Name: ${employee.name}, Department: ${employee.department}, Skills: ${employee.skills.join(', ')}, Performance Score: ${employee.performanceScore}/100, Experience: ${employee.experience} years.`;

      if (type === 'promotion') {
        prompt = `Analyze this employee's data: ${empData}. Based on their performance (high score > 80 is good) and experience, provide a recommendation on whether they should be promoted. Format as a brief, professional recommendation in Markdown.`;
      } else if (type === 'training' || type === 'feedback') {
        prompt = `Analyze this employee's data: ${empData}. Provide constructive improvement feedback and suggest specific training or skill enhancement recommendations. Focus on areas where they can improve, especially if their performance score is low. Format in Markdown.`;
      } else {
        prompt = `Analyze this employee's data: ${empData}. Provide general feedback. Format in Markdown.`;
      }
    }

    // Call OpenRouter API
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      // Mock response for testing when API key is not provided
      let mockResponse = "This is an AI-generated mock recommendation.";
      if (type === 'promotion') {
        mockResponse = "**Promotion Recommendation:** Based on the high performance score and experience, this employee is a strong candidate for promotion.";
      } else if (type === 'training') {
        mockResponse = "**Training Suggestion:** The employee should focus on improving their skills in the areas where performance was lacking. Consider enrolling in advanced courses.";
      } else if (type === 'ranking') {
        mockResponse = "**Employee Ranking:**\n1. Top Performer (Score: 95)\n2. Average Performer (Score: 75)\n3. Needs Improvement (Score: 60)";
      }
      return res.json({ recommendation: mockResponse });
    }

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo', // Can be changed based on what user prefers
      messages: [
        { role: 'system', content: 'You are an expert HR AI assistant. Provide concise, professional, and actionable HR recommendations.' },
        { role: 'user', content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const aiRecommendation = response.data.choices[0].message.content;
    
    res.json({ recommendation: aiRecommendation });
    
  } catch (err) {
    console.error('AI API Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ msg: 'Failed to generate AI recommendation' });
  }
});

module.exports = router;
