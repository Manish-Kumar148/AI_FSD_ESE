import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp, BookOpen, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const AIRecommendation = () => {
  const { id } = useParams();
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [type, setType] = useState(id === 'all' ? 'ranking' : 'promotion');

  const fetchRecommendation = async (reqType) => {
    setLoading(true);
    setError('');
    try {
      const payload = id === 'all' ? { type: 'ranking' } : { employeeId: id, type: reqType };
      const res = await axios.post('/api/ai/recommend', payload);
      setRecommendation(res.data.recommendation);
      setType(reqType);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch AI recommendation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation(id === 'all' ? 'ranking' : 'promotion');
  }, [id]);

  return (
    <div className="py-6">
      <Link to="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 w-max">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-8 border-b border-dark-700 pb-6">
          <div className="bg-purple-500/20 p-4 rounded-full">
            <Sparkles className="text-purple-400 w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Assistant Insights</h2>
            <p className="text-gray-400">Powered by Advanced AI</p>
          </div>
        </div>

        {id !== 'all' && (
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => fetchRecommendation('promotion')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${type === 'promotion' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
            >
              <TrendingUp className="w-4 h-4" /> Promotion Analysis
            </button>
            <button 
              onClick={() => fetchRecommendation('training')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${type === 'training' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
            >
              <BookOpen className="w-4 h-4" /> Training Plan
            </button>
            <button 
              onClick={() => fetchRecommendation('feedback')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${type === 'feedback' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
            >
              <MessageSquare className="w-4 h-4" /> General Feedback
            </button>
          </div>
        )}

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <div className="bg-dark-900 rounded-xl p-6 min-h-[300px] border border-dark-700">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p>Analyzing data and generating insights...</p>
            </div>
          ) : recommendation ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{recommendation}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 py-20">
              Select an option above to generate AI insights.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AIRecommendation;
