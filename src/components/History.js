import { useContext, useEffect, useCallback } from "react";
import { InputContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const History = () => {
  const { history, setHistory, user } = useContext(InputContext);
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/history?userId=${user.id}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  }, [user.id, setHistory]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, fetchHistory]);

  const handleBack = () => {
    navigate("/");
  };


  const userHistory = history.filter(item => item.userId === user.id);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">QR Code History</h2>
      <button
        onClick={handleBack}
        className="bg-blue-400 px-4 py-2 text-white rounded-sm hover:bg-blue-500 mb-4">
        Back to Generate
      </button>
      <div className="space-y-4">
        {userHistory.length === 0 ? (
          <p>No history available.</p>
        ) : (
          userHistory.map((item, index) => (
            <div key={index} className="border p-4 rounded-md">
              <p><strong>URL:</strong> {item.url}</p>
              <p><strong>Color:</strong> {item.color}</p>
              <img src={item.qrCodeUrl} alt="QR Code" className="mt-2 w-24 h-24" />
              <a
                href={item.qrCodeUrl}
                download
                className="text-blue-500 underline mt-2 block">
                Download
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
