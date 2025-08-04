// Projects/mlcodequest/frontend/src/App.jsx
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx"
import ProblemsetTable from "./components/ProblemsetTable.jsx";
import ProblemDetail from "./components/ProblemDetail.jsx";
import AuthPage from "./components/AuthPage.jsx"
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  // Initialize problem state with an empty array.
  const [problems, setProblems] = useState([]);
  // Create state to track the selected problem.
  // Initially, it's `null` because no problem is selected.
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [currentUser, setCurrentUser] = useState(null); // State for the logged-in user
  const [loading, setLoading] = useState(true); // Add a loading state to prevent flicker on load

  // useEffect hook to fetch data from the backend
  useEffect( () => {
    // This function will run once when the component first loads
    const fetchProblems = async () => {
      try {
        // We use fetch to make a GET request to our backend API
        const response = await fetch("http://localhost:5000/api/problems");
        // we convert the response into JSON format.
        const data = await response.json();
        // We update our 'problems' state with the data from the server
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch problems: ", error);
      }
    };

    fetchProblems();
  }, []); // The empty array [] means this effect runs only once on mount


  // useEffect for listening to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set user to the logged-in user object or null
      setLoading(false); // We're done loading, so hide the loading indicator
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // This function takes a problem object and updates the state.
  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
  };

  // This function clears the selection, taking us back to the list
  const handleBackToList = () => {
    setSelectedProblem(null);
  }

  // Render content based on currentPage
  const renderContent = () => {
    // If the user is not logged in, always show the AuthPage
    if (!currentUser) {
      return <AuthPage />;
    }

    // If the user is logged in, show problems or details.
    if (selectedProblem) {
      return <ProblemDetail problem={selectedProblem} onBack={handleBackToList} user={currentUser} />;
    } else {
      return <ProblemsetTable problems={problems} onProblemSelect={handleSelectProblem} />;
    }
  };

  // Show a simple loading message while checking auth state
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      {/* We only need to pass the user to the navbar now */}
      <Navbar user={currentUser} />
      <main>
        {renderContent()}
      </main>
    </div>
  )
}

export default App