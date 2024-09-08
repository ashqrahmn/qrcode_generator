import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { InputContext } from "../App";

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useContext(InputContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup', { username, password });
      console.log(response.data);
      setSuccess(true);
      setError('');
      setUser(response.data.user);
      setTimeout(() => {
        navigate('/');
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.log(err.response);
      if (err.response && err.response.data && err.response.data.message === 'User already exists') {
        setError('User already exists');
      } else {
        setError('Sign-up failed');
        console.error("Sign-up failed", err);
      }
    }    
  };

  return (
    <form onSubmit={handleSignUp} className="p-6">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      {success && <p className="text-green-500 mb-4">Sign-up successful! Redirecting...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
          Signup
        </button>
        <p className="ml-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignUp;
