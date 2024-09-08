import { createContext, useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import History from "./components/History";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";  // Import the Home component
import axios from "axios";

export const InputContext = createContext();

function App() {
  const [inputValue, setInputValue] = useState({ url: '', color: '' });
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const config = {
    headers: { Authorization: 'Bearer 0f11dc50-6dbd-11ef-8b88-8f722cd5ee00' }
  };

  const bodyParameters = {
    "colorDark": inputValue.color,
    "qrCategory": "url",
    "text": inputValue.url
  };

  const getQrCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        'https://qrtiger.com/api/qr/static',
        bodyParameters,
        config
      );
      setResponse(res.data.url);
      const qrData = { url: inputValue.url, color: inputValue.color, qrCodeUrl: res.data.url, userId: user.id };

      setHistory(prevHistory => [...prevHistory, qrData]);
      await axios.post('http://localhost:5000/api/history', { qrData, userId: user.id });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/history?userId=${user.id}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  }, [user]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);  // Ensure unauthenticated state
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, fetchHistory]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Reset state when logging out
  useEffect(() => {
    if (!isAuthenticated) {
      setInputValue({ url: '', color: '' });
      setResponse('');
      setHistory([]);
      setError(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const value = {
    inputValue,
    setInputValue,
    getQrCode,
    response,
    loading,
    error,
    history,
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    handleLogout
  };

  return (
    <Router>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen flex items-center justify-center overflow-auto">
        <div className="container mx-auto max-w-4xl bg-white rounded-md shadow">
          <InputContext.Provider value={value}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route 
                path="/home"
                element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
              />
              <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
              <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} /> {/* Redirect to /home if authenticated */}
            </Routes>
          </InputContext.Provider>
        </div>
      </div>
    </Router>
  );
}

export default App;
