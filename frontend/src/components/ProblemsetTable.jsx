// src/components/ProblemsetTable.jsx

import React from 'react';

// This function helps us apply different colors based on the difficulty.
const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return 'text-green-600';
        case 'medium':
            return 'text-yellow-600';
        case 'hard':
            return 'text-red-600';
        default:
            return 'text-gray-600';
    }
};

// Receive ProblemSelect as a prop
function ProblemsetTable( { problems, onProblemSelect } ) {
  return (
    // Main container for the table with some padding
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Problemset
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Challenge yourself with our collection of coding problems.
          </p>
        </div>
        
        {/* The table container */}
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acceptance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* We use .map() to loop over our problems array and create a table row for each one. */}
              {problems.map((problem) => (
                <tr key={problem.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {/* Add the onclick event handler here */}
                      <a href="#" 
                      onClick = {(e) => {
                        e.preventDefault(); // Prevents the page from reloading
                        onProblemSelect(problem); // call this function from the parent (App.jsx)
                      }}
                      className="hover:text-indigo-600">{problem.title}</a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{problem.acceptance}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${getDifficultyClass(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProblemsetTable;