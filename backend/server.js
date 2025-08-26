// server.js

// 1. Configure environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to pause execution
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Piston API language versions and boilerplates
const pistonConfig = {
  python: {
    language: "python",
    version: "*",
    boilerplate: `
import sys
import json

# {{USER_CODE}}

# Driver code - DO NOT EDIT
try:
    nums_arg = sys.argv[1]
    target_arg = sys.argv[2]
    
    nums = json.loads(nums_arg)
    target = int(target_arg)

    solution = Solution()
    # THE FIX IS HERE: We capture the return value and then print it.
    result = solution.twoSum(nums, target)
    
    # We still sort for consistency before printing.
    if isinstance(result, list):
        result.sort()
    
    print(json.dumps(result, separators=(',', ':')))
except Exception as e:
    print(f"Error during execution: {e}", file=sys.stderr)
`
  },
  // ... other languages
};

// --- API Routes ---

// Get all problems from Firestore
app.get('/api/problems', async (req, res) => {
  try {
    const problemsRef = db.collection('problems');
    const snapshot = await problemsRef.orderBy('order', 'asc').get();
    const problemsList = [];
    snapshot.forEach(doc => {
      problemsList.push({ id: doc.id, ...doc.data() });
    });
    res.json(problemsList);
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    res.status(500).json({ message: "Failed to fetch problems." });
  }
});


// Execute code using the Piston API with Boilerplates
// ===================================================================
app.post('/api/execute', async (req, res) => {
  const { code, language, problemId, userId } = req.body;
  if (!userId || !pistonConfig[language]) {
    return res.status(401).json({ message: "Invalid request." });
  }

  try {
    const problemDoc = await db.collection('problems').doc(problemId).get();
    if (!problemDoc.exists) {
      return res.status(404).json({ message: "Problem not found." });
    }
    const { testCases } = problemDoc.data();

    for (const testCase of testCases) {
      let fullCode = code;
      if (pistonConfig[language].boilerplate) {
        fullCode = pistonConfig[language].boilerplate.replace('# {{USER_CODE}}', code);
      }
      
      const inputArgs = testCase.input.split('\\n');

      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: pistonConfig[language].language,
        version: pistonConfig[language].version,
        files: [{ content: fullCode }],
        args: inputArgs
      });

      const result = response.data;
      
      if (result.run.code !== 0) {
          return res.json({ success: false, message: "Runtime Error", output: result.run.stderr });
      }

      const userOutput = result.run.stdout.trim();
      const expectedOutput = testCase.output.trim();
      
      let isCorrect = false;
      try {
        // Try to parse both outputs as JSON arrays
        const userArr = JSON.parse(userOutput).sort();
        const expectedArr = JSON.parse(expectedOutput).sort();
        // Compare the sorted string versions
        if (JSON.stringify(userArr) === JSON.stringify(expectedArr)) {
          isCorrect = true;
        }
      } catch (e) {
        // If they are not valid JSON arrays, fall back to simple string comparison
        if (userOutput === expectedOutput) {
          isCorrect = true;
        }
      }
      
      if (!isCorrect) {
          return res.json({ 
              success: false, 
              message: "Wrong Answer", 
              details: `For input:\n${testCase.input.replace(/\\n/g, ' ')}\n\nExpected output:\n${expectedOutput}\n\nYour output:\n${userOutput}\n\nError Log (stderr):\n${result.run.stderr || 'None'}`
          });
      }
    }

    const submission = { userId, problemId, code, language, status: 'Accepted', submittedAt: admin.firestore.FieldValue.serverTimestamp() };
    await db.collection('submissions').add(submission);
    res.json({ success: true, message: "Accepted" });

  } catch (error) {
    console.error("Execution error:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "An error occurred during code execution." });
  }
});

// API endpoint to get user submission history
app.get('/api/submissions/:userId/:problemId', async (req, res) => {
    try {
        const { userId, problemId } = req.params;
        const submissionsRef = db.collection('submissions');
        const snapshot = await submissionsRef
            .where('userId', '==', userId)
            .where('problemId', '==', problemId) // Firestore can compare string IDs
            .orderBy('submittedAt', 'desc')
            .get();
        if (snapshot.empty) {
            return res.json([]);
        }
        const submissions = [];
        snapshot.forEach(doc => {
            submissions.push({ id: doc.id, ...doc.data() });
        });
        res.json(submissions);
    } catch (error) {
        console.error("Failed to fetch submissions:", error);
        res.status(500).json({ message: "Failed to fetch submission history." });
    }
});

// Protected endpoint for admins to add new problems
app.post('/api/problems', async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: User is not an admin.' });
    }

// The problem data from the frontend (no longer contains 'order')
    const problemData = req.body;
    if (!problemData.title || !problemData.description) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    // --- NEW: Transaction to get and increment the counter ---
    const counterRef = db.collection('metadata').doc('problemCounter');
    
    const newProblemOrder = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists) {
        throw new Error("Problem counter document does not exist!");
      }
      
      const newOrder = counterDoc.data().count + 1;
      
      // Increment the count in the counter document
      transaction.update(counterRef, { count: newOrder });
      
      return newOrder;
    });
    // --- End of Transaction ---

    // Add the auto-generated order to the new problem data
    const newProblem = {
      ...problemData,
      order: newProblemOrder,
    };
    
    const docRef = await db.collection('problems').add(newProblem);
    res.status(201).json({ message: 'Problem added successfully', id: docRef.id });
  } catch (error) {
    console.error("Error adding problem:", error);
    res.status(500).json({ message: 'Failed to add problem.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend server is running on port: ${PORT}`);
});
