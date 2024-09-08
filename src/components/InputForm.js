import { useContext } from "react";
import InputColor from "./InputColor";
import InputField from "./InputField";
import { InputContext } from "../App";
import { useNavigate } from "react-router-dom";

const InputForm = () => {
    const { getQrCode, inputValue, setIsAuthenticated } = useContext(InputContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await getQrCode();
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate("/login");
    };

    const handleViewHistory = () => {
        navigate("/history");
    };

    return (
        <div className='col-span-2 p-6 grid gap-4'>
            <InputField />
            <InputColor />
            <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4">
                    <button
                        onClick={handleLogout}
                        className="bg-blue-400 max-w-xs px-4 py-2 text-white rounded-sm hover:bg-blue-500 disabled:bg-gray-300">
                        Logout
                    </button>
                    <button
                        onClick={handleViewHistory}
                        className="bg-blue-400 max-w-xs px-4 py-2 text-white rounded-sm hover:bg-blue-500 disabled:bg-gray-300">
                        View History
                    </button>
                </div>
                <button 
                    disabled={!inputValue.url}
                    onClick={handleSubmit}
                    className="bg-blue-400 max-w-xs px-4 py-2 text-white rounded-sm hover:bg-blue-500 disabled:bg-gray-300">
                    Generate QR Code
                </button>
            </div>
        </div>
    );
};

export default InputForm;
