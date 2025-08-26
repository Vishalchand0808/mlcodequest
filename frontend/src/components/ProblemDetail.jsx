// src/components/ProblemDetail.jsx

import React, { useState, useEffect } from 'react';
import CodeEditor from "./CodeEditor.jsx";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ProblemDetail({ problem, onBack, user }) {
    // State for the selected language
    const [language, setLanguage] = useState('javascript');
    // Create state to hold the user's code.
    // Initialize it with the problem's starter code.
    const [code, setCode] = useState(problem.starterCode.javascript);

    // State to hold the submission result
    const [result, setResult] = useState(null);

    // Add state to store the submission history
    const [submissions, setSubmissions] = useState([]);

    // When the user changes the language in the dropdown...
    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);
        // ...update the editor with the starter code for that language.
        setCode(problem.starterCode[newLanguage]);
    };

    // useEffect to fetch submission history when the component loads
    useEffect(() => {
        const fetchSubmissions = async () => {
            // Don't fetch if user or problem is not available
            if (!user || !problem) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/${user.uid}/${problem.id}`);
                const data = await response.json();
                setSubmissions(data);
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            }
        };

        fetchSubmissions();
        // This effect runs whenever the user or problem changes
    }, [user, problem]);

    // This function will be called when the user clicks "Submit"
    const handleSubmit = async () => {
        // Clear previous results
        setResult(null);

        // Make sure we don't submit if the user is not logged in (as a safeguard)
        if (!user) {
            setResult({ success: false, message: "You must be logged in to submit code." });
            return;
        }

        try {
            // Send a POST request to our execution endpoint
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/execute`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                // Send the selected language to the backend
                body: JSON.stringify({ code, language, problemId: problem.id, userId: user.uid }),
            });

            // Get the result from the backend's response
            const data = await response.json();
            setResult(data);
            if (data.success) {
                // (Optional but good UX) You could re-fetch submissions here
            }
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
                {/* Left side: Problem Description and new submission history*/}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{`${problem.order}. ${problem.title}`}</h2>
                        {/* 2. Use the ReactMarkdown component here */}
                        {/* The `prose` class from the typography plugin styles the output */}
                        <div className="prose max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {problem.description}
                        </ReactMarkdown>
                        </div>
                    </div>

                    {/* Submission History Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-3">Submission History</h3>
                        {submissions.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {submissions.map((sub) => (
                                    <li key={sub.id} className="py-3 flex justify-between items-center">
                                        <span className={`font-medium ${getResultClass(sub.status === 'Accepted')}`}>
                                            {sub.status}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(sub.submittedAt._seconds * 1000).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No submissions yet for this problem.</p>
                        )}
                    </div>
                </div>
                    {/* Right side: Code Editor */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Solution</h3>
                            {/* Language Selector Dropdown */}
                            <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md shadow-sm"
                            >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                            </select>
                        </div>

                        <CodeEditor value={code} onChange={setCode} language={language} />
                        {/* Corrected container div */}
                        <div className="mt-4 flex items-center justify-between">
                        <div className="w-2/5"> {/* This container will hold the result message */}
                            {result && (
                                <div>
                                    <div className={`font-semibold ${getResultClass(result.success)}`}>
                                        {result.message}
                                    </div>
                                    {/* NEW: Display the details if they exist */}
                                    {result.details && (
                                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-700 whitespace-pre-wrap">
                                        <code>{result.details}</code>
                                    </pre>
                                    )}
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