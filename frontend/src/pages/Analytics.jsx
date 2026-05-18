import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d', '#052e16'];

const Analytics = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/api/employees/search?name=&department=');
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Process data for charts
  const deptStats = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = { name: emp.department, totalScore: 0, count: 0 };
    }
    acc[emp.department].totalScore += emp.performanceScore;
    acc[emp.department].count += 1;
    return acc;
  }, {});

  const barChartData = Object.values(deptStats).map(dept => ({
    name: dept.name,
    avgPerformance: Math.round(dept.totalScore / dept.count)
  }));

  const pieChartData = Object.values(deptStats).map(dept => ({
    name: dept.name,
    value: dept.count
  }));

  // Process data for rankings table
  const sortedEmployees = [...employees].sort((a, b) => b.performanceScore - a.performanceScore);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-primary-400">Loading Analytics...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link to="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
            Analytics & Rankings
          </h1>
          <p className="text-gray-400 mt-1">Deep dive into workforce performance metrics</p>
        </div>
        <Link to="/ai-recommendation/all" className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> Generate AI Ranking
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel p-6 h-96 flex flex-col">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            Average Performance by Department
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#4ade80' }}
                />
                <Bar dataKey="avgPerformance" fill="#22c55e" radius={[4, 4, 0, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 h-96 flex flex-col">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            Employee Distribution
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#1e293b"
                  strokeWidth={2}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" /> Employee Leaderboard
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-700 text-gray-400">
                <th className="p-4 font-medium">Rank</th>
                <th className="p-4 font-medium">Employee Name</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Experience</th>
                <th className="p-4 font-medium text-right">Performance Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.map((emp, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={emp._id} 
                  className={`border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors ${idx < 3 ? 'bg-primary-500/5' : ''}`}
                >
                  <td className="p-4">
                    {idx === 0 && <span className="text-yellow-400 font-bold text-lg">🥇 1</span>}
                    {idx === 1 && <span className="text-gray-300 font-bold text-lg">🥈 2</span>}
                    {idx === 2 && <span className="text-amber-600 font-bold text-lg">🥉 3</span>}
                    {idx > 2 && <span className="text-gray-500 font-medium ml-2">{idx + 1}</span>}
                  </td>
                  <td className="p-4 font-medium text-white">{emp.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-dark-700 text-xs rounded-md text-gray-300">
                      {emp.department}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{emp.experience} yrs</td>
                  <td className="p-4 text-right">
                    <span className={`font-bold ${emp.performanceScore >= 80 ? 'text-green-400' : emp.performanceScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {emp.performanceScore}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {sortedEmployees.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
