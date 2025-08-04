// server.js

// 1. IMPORT LIBRARIES
// =====================
// We import the 'express' framework to create and manage our server.
// We import 'cors' to handle Cross-Origin Resource Sharing, allowing our frontend to access this backend.
const express = require('express');
const cors = require('cors');

// Import the 'vm' module for running code in a sandbox
const vm = require('vm');

// 2. INITIALIZE THE APP
// =====================
// We create an instance of an Express application.
const app = express();
// We define the port our server will run on. It's convention to use a different port
// from the frontend. Since Vite often uses 5173, we'll use 5000 for the backend.
const PORT = 5000;

// 3. SET UP MIDDLEWARE
// ====================
// Middleware are functions that run between the request and the response.
// app.use(cors()) tells our server to allow requests from any origin.
app.use(cors());
// app.use(express.json()) allows our server to understand incoming requests that are in JSON format.
app.use(express.json());

// 4. DEFINE THE DATA (Mock Database)
// ==================================
// In a real app, this would come from a database like Firestore or MongoDB.
// For now, we'll store our problem data right here in an array.
// This is the same data from our App.jsx, now living on the server.
const problems = [
    { id: 1, title: '1. Two Sum', acceptance: '48.5%', difficulty: 'Easy', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', starterCode: 'function twoSum(nums, target) {\n  // Write your code here\n};' },
    { id: 2, title: '2. Add Two Numbers', acceptance: '35.7%', difficulty: 'Medium', description: 'You are given two non-empty linked lists representing two non-negative integers...', starterCode: 'function addTwoNumbers(l1, l2) {\n  // Write your code here\n};' },
    { id: 3, title: '3. Longest Substring...', acceptance: '32.1%', difficulty: 'Hard', description: 'Given a string s, find the length of the longest substring without repeating characters.', starterCode: 'function lengthOfLongestSubstring(s) {\n  // Write your code here\n};' },
];


// 5. DEFINE API ROUTES
// ====================
// A "route" is a specific URL on our server that the frontend can connect to.
// We're creating a GET route at the URL '/api/problems'.
app.get('/api/problems', (req, res) => {
    // When a GET request is made to this URL, we send back our 'problems' array.
    // res.json() automatically converts our JavaScript array into JSON format for the response.
    res.json(problems);
});

// API endpoint for code execution
app.post('/api/execute', (req, res) => {
    // Get the user's code and the problem ID from the request body
    const { code, problemId } = req.body;

    // For now, we only have logic for the "Two Sum" problem (id: 1)
    if(problemId !== 1) {
        return res.status(400).json({ message: "Execution logic for this problem is not yet implemented." });
    }

    try {
        // Create a sandbox environment for the code to run in.
        // We can pass variables into the sandbox. Here, we'll capture the output.
        const sandbox = {
            result: null,
            console: {
                log: (...args) => {
                    // We can capture console.log if needed, but for now we'll just store the function's return value.
                }
            }
        }

        // The code to run inside the sandbox
        // We append a line to the user's code to call their function with our test case
        // and store the output in our sandbox's 'result' variable.
        const testCode = code + '\nresult = twoSum([2, 7, 11, 15], 9);';

        // Use vm.runInNewContext to execute the code safely.
        // It runs the code in the 'sandbox' environment.
        vm.runInNewContext(testCode, sandbox);

        // Check the result from the sandbox
        const userResult = sandbox.result;
        const expectedResult = [0, 1];

        // A simple check for the 'Two Sum' problem.
        // We check if the arrays are equal, ignoring the order of elements.
        const isCorrect = userResult && userResult.length === 2 && userResult.includes(0) && userResult.includes(1);

        if (isCorrect) {
            res.json({success: true, message: "Accepted" });
        } else {
            res.json({ success: false, message: "Wrong Answer", output: userResult });
        }
    } catch (error) {
        // If the user's code has a syntax error or runtime error, it will be caught here.
        res.json({ success: false, message: "Error", error: error.toString() });
    }
});

// 6. START THE SERVER
// ===================
// This command starts the server and makes it listen for incoming requests on our defined PORT.
// The callback function is just to let us know in the console that the server has started successfully.
app.listen(PORT, () => {
    console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});
