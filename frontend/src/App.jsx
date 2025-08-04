// Projects/mlcodequest/frontend/src/App.jsx
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx"
import ProblemsetTable from "./components/ProblemsetTable.jsx";
import ProblemDetail from "./components/ProblemDetail.jsx";


function App() {
  // Initialize problem state with an empty array.
  const [problems, setProblems] = useState([]);
  // Create state to track the selected problem.
  // Initially, it's `null` because no problem is selected.
  const [selectedProblem, setSelectedProblem] = useState(null);

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

  // This function takes a problem object and updates the state.
  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
  };

  // This function clears the selection, taking us back to the list
  const handleBackToList = () => {
    setSelectedProblem(null);
  }


  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar />
      <main>
        {/* The ternary operator for conditional rendering */}
        {selectedProblem ? (
          <ProblemDetail problem={selectedProblem}
          onBack={handleBackToList} />
        ) : (
          <ProblemsetTable problems={problems} onProblemSelect={handleSelectProblem} />
        )}
        
      </main>
    </div>
  )
}

export default App