import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    skills: '',
    performanceScore: 50,
    experience: 0
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      await axios.post('http://localhost:5001/api/employees', payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add employee');
    }
  };

  return (
    <div className="py-6">
      <Link to="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 w-max">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary-400">Add New Employee</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Full Name</label>
              <input 
                type="text" 
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Email Address</label>
              <input 
                type="email" 
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Department</label>
              <select 
                className="input-field appearance-none"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Years of Experience</label>
              <input 
                type="number" 
                className="input-field"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: Number(e.target.value)})}
                required
                min="0"
                max="50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Skills (comma separated)</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="React, Node.js, MongoDB"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300 flex justify-between">
              Performance Score
              <span className="text-primary-400 font-bold">{formData.performanceScore}</span>
            </label>
            <input 
              type="range" 
              className="w-full accent-primary-500 mt-2"
              value={formData.performanceScore}
              onChange={(e) => setFormData({...formData, performanceScore: Number(e.target.value)})}
              min="0"
              max="100"
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="btn-primary w-full">Save Employee Record</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EmployeeForm;
