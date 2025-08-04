// src/components/ProblemDetail.jsx

import React, { useState } from 'react'; // Importing useState
import CodeEditor from "./CodeEditor.jsx";

function ProblemDetail({ problem, onBack }) {
    // Create state to hold the user's code.
    // Initialize it with the problem's starter code.
    const [code, setCode] = useState(problem.starterCode);

    // State to hold the submission result
    const [result, setResult] = useState(null);

    // This function will be called when the user clicks "Submit"
    const handleSubmit = async () => {
        // Clear previous results
        setResult(null);

        try {
        // Send a POST request to our execution endpoint
        const response = await fetch('http://localhost:5000/api/execute', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            // The body of the request contains the code and problemId
            body: JSON.stringify({ code, problemId: problem.id }),
        });

        // Get the result from the backend's response
        const data = await response.json();
        setResult(data);
        } catch (error) {
        console.error("Error submitting code:", error);
        setResult({ success: false, message: "Failed to connect to the server." });
        }
    };

    // Helper to style the result message
    const getResultClass = (success) => {
        return success ? 'text-green-500' : 'text-red-500';
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Back button */}
            <button onClick={onBack} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4">
                &larr; Back to Problems
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side: Problem Description */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{problem.title}</h2>
                    <p className="text-gray-700 mb-4">{problem.description}</p>
                </div>

                {/* Right side: Code Editor */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-3">Solution</h3>
                    <CodeEditor value={code} onChange={setCode} />
                    {/* Corrected container div */}
                    <div className="mt-4 flex items-center justify-between">
                    <div className="w-2/5"> {/* This container will hold the result message */}
                        {result && (
                        <div className={`font-semibold ${getResultClass(result.success)}`}>
                            {result.message}
                        </div>
                        )}
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                        Submit
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProblemDetail;