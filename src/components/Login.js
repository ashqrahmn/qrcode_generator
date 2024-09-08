import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputContext } from "../App";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated, setUser } = useContext(InputContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password');
        console.error("Login failed", err);
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
      <div className="mb-4">
        <label className="block text-gray-700">Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="flex items-center">
        <button
          type="submit"
          className="bg-blue-400 px-4 py-2 text-white rounded-sm hover:bg-blue-500">
          Login
        </button>
        <p className="ml-4">
          Not registered yet?{" "}
          <Link to="/signup" className="text-blue-500 underline">
            Signup
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Login;
