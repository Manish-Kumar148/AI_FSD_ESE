import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Trash2, Brain, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/employees/search?name=${search}&department=${department}`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, department]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5001/api/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
            Employee Analytics
          </h1>
          <p className="text-gray-400 mt-1">Manage and analyze your workforce</p>
        </div>
        <div className="flex gap-4">
          <Link to="/add-employee" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Employee
          </Link>
          <Link to="/ai-recommendation/all" className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> AI Ranking
          </Link>
          <button onClick={handleLogout} className="bg-dark-700 hover:bg-dark-600 p-2 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <select 
            className="input-field appearance-none"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={emp._id} 
            className="glass-panel p-6 flex flex-col h-full hover:border-primary-500/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{emp.name}</h3>
                <span className="inline-block px-2 py-1 bg-dark-700 text-xs rounded-md text-gray-300 mt-2">
                  {emp.department}
                </span>
              </div>
              <div className={`text-lg font-bold flex items-center justify-center w-12 h-12 rounded-full ${emp.performanceScore >= 80 ? 'bg-green-500/20 text-green-400' : emp.performanceScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                {emp.performanceScore}
              </div>
            </div>
            
            <div className="text-sm text-gray-400 mb-4 flex-1">
              <p>Experience: {emp.experience} years</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {emp.skills.map((skill, i) => (
                  <span key={i} className="text-xs bg-dark-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-auto pt-4 border-t border-dark-700">
              <Link to={`/ai-recommendation/${emp._id}`} className="flex-1 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 py-2 rounded flex justify-center items-center gap-2 transition-colors">
                <Brain className="w-4 h-4" /> AI Insight
              </Link>
              <button onClick={() => handleDelete(emp._id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {employees.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No employees found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
