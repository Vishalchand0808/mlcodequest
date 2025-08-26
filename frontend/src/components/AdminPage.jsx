// src/components/AdminPage.jsx

import React, { useState } from 'react';

function AdminPage({ user, onNavigate, onProblemAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [starterCode, setStarterCode] = useState({
    javascript: '// JavaScript starter code',
    python: '# Python starter code',
    cpp: '// C++ starter code',
  });
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  const handleAddProblem = async () => {
    if (!user) return;
    const token = await user.auth.getIdToken();
    const newProblem = { title, description, difficulty, starterCode, testCases };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newProblem),
      });
      const data = await response.json();
      if (response.ok) {
        setFeedback({ message: 'Problem added successfully!', type: 'success' });
        onProblemAdded();
        setTimeout(() => onNavigate('problems'), 1500);
      } else { throw new Error(data.message || 'Failed to add problem.'); }
    } catch (error) {
      setFeedback({ message: error.message, type: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Admin Panel - Add New Problem</h2>
      <div className="space-y-6 bg-white p-8 rounded-lg shadow">
        
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Problem Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="e.g., Two Sum"
          />
        </div>

        {/* Difficulty Select */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (Markdown)
          </label>
          <textarea
            id="description"
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono"
            placeholder="## Description..."
          ></textarea>
        </div>

        {/* Starter Code Inputs */}
        <h3 className="text-lg font-medium border-t pt-4">Starter Code</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">JavaScript</label>
          <textarea rows="5" value={starterCode.javascript} onChange={(e) => setStarterCode({...starterCode, javascript: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm font-mono"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Python</label>
          <textarea rows="5" value={starterCode.python} onChange={(e) => setStarterCode({...starterCode, python: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm font-mono"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">C++</label>
          <textarea rows="5" value={starterCode.cpp} onChange={(e) => setStarterCode({...starterCode, cpp: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm font-mono"/>
        </div>

        {/* Test Cases */}
        <h3 className="text-lg font-medium border-t pt-4">Test Cases</h3>
        {testCases.map((tc, index) => (
          <div key={index} className="flex space-x-4 border-t pt-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Input {index + 1}</label>
              <textarea rows="3" value={tc.input} onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm font-mono"/>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Expected Output {index + 1}</label>
              <textarea rows="3" value={tc.output} onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm font-mono"/>
            </div>
          </div>
        ))}
        <button onClick={addTestCase} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          + Add Test Case
        </button>

        {feedback.message && ( <p className={`text-sm ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p> )}
        <div className="text-right">
          <button onClick={handleAddProblem} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">
            Add Problem
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
