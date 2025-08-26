// Projects/mlcodequest/frontend/src/App.jsx
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx"
import ProblemsetTable from "./components/ProblemsetTable.jsx";
import ProblemDetail from "./components/ProblemDetail.jsx";
import AuthPage from "./components/AuthPage.jsx"
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AdminPage from "./components/AdminPage.jsx";

function App() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("problems");

  // 1. Define fetchProblems here, in the main scope of the App component
  const fetchProblems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems`);
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Failed to fetch problems: ", error);
    }
  };

  // 2. This useEffect calls the function when the component first loads.
  useEffect(() => {
    fetchProblems();
  }, []);

  // useEffect for listening to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed. User:", user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        console.log("Firestore document exists:", userDoc.exists());
        if (userDoc.exists()) {
          setCurrentUser({
            auth: user,
            profile: userDoc.data()
          });
        } else {
          setCurrentUser({ auth: user, profile: null });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
  };

  const handleBackToList = () => {
    setSelectedProblem(null);
  }

  const renderContent = () => {
    if (!currentUser) {
      return <AuthPage />;
    }
    if (currentPage === 'admin' && currentUser.profile?.role === 'admin') {
      // 3. Now this line works because renderContent can "see" fetchProblems
      return <AdminPage user={currentUser} onNavigate={setCurrentPage} onProblemAdded={fetchProblems} />;
    }
    if (selectedProblem) {
      return <ProblemDetail problem={selectedProblem} onBack={handleBackToList} user={currentUser.auth} />;
    } else {
      return <ProblemsetTable problems={problems} onProblemSelect={handleSelectProblem} />;
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar user={currentUser} onNavigate={setCurrentPage} />
      <main>
        {renderContent()}
      </main>
    </div>
  )
}

export default App;