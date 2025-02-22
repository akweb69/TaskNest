import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Eye Icon

const SignIn_Up = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [password, setPassword] = useState(""); // State for password
    const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
    const [error, setError] = useState(""); // State for error message

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }

        if (isSignUp && password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setError(""); // Clear error if validation passes
        // Handle form submission (sign in or sign up)
        console.log("Form submitted!");
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="w-11/12 mx-auto py-14 flex justify-center items-center">
                {/* Two Column Layout */}
                <div className="w-full flex flex-col md:flex-row bg-transparent rounded-lg shadow-lg">
                    {/* Left Side Image */}
                    <motion.div
                        className="w-full md:w-1/2 bg-cover bg-center bg-no-repeat rounded-l-lg"
                        style={{ backgroundImage: 'url(https://i.ibb.co.com/B59KmYYH/flat-design-join-us-message.png)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    ></motion.div>

                    {/* Right Side Form */}
                    <motion.div
                        className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        <div className="text-center mb-6">
                            {/* Toggle Button */}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-blue-500 font-bold hover:underline"
                            >
                                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                            </button>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <motion.div
                                className="flex items-center space-x-4 border-b-2 pb-2"
                                initial={{ x: -50 }}
                                animate={{ x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <FaUserAlt className="text-gray-600" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full border-none outline-none p-2 bg-transparent"
                                    required
                                />
                            </motion.div>

                            <motion.div
                                className="flex items-center space-x-4 border-b-2 pb-2"
                                initial={{ x: -50 }}
                                animate={{ x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <MdEmail className="text-gray-600" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full border-none outline-none p-2 bg-transparent"
                                    required
                                />
                            </motion.div>

                            <motion.div
                                className="flex items-center space-x-4 border-b-2 pb-2"
                                initial={{ x: -50 }}
                                animate={{ x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <FaLock className="text-gray-600" />
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border-none outline-none p-2 bg-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-2 top-2"
                                    >
                                        {showPassword ? (
                                            <AiFillEyeInvisible className="text-gray-600" />
                                        ) : (
                                            <AiFillEye className="text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </motion.div>

                            {isSignUp && (
                                <motion.div
                                    className="flex items-center space-x-4 border-b-2 pb-2"
                                    initial={{ x: -50 }}
                                    animate={{ x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <FaLock className="text-gray-600" />
                                    <div className="relative w-full">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full border-none outline-none p-2 bg-transparent"
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 cursor-pointer"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                {isSignUp ? "Sign Up" : "Sign In"}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SignIn_Up;
