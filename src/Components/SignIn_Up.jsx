import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { auth, provider, signInWithPopup } from "../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignIn_Up = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { username, email, password, confirmPassword } = formData;

        // Password validation: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
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

        // Log the data to the console
        console.log("Form Data:", { username, email, password });

        // Reset form after submission
        setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        // sign in with email password




    };
    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then(res => {
                console.log(res.data)
                toast.success("Google SignIn Success!")
            })
            .catch(err => {
                console.log(err)
                toast.error("Somthing went wrong try again letter!")
            })
    }

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log("user state ---->", user)
        });

        // Cleanup the listener when component unmounts
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (user && user?.email) {
            navigate("/tasknest_home")
        }
    }, [user, navigate])
    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="w-11/12 mx-auto py-14 flex justify-center items-center">
                <div className="w-full flex flex-col md:flex-row bg-transparent rounded-lg shadow-lg">
                    {/* Left Side Image */}
                    <motion.div
                        className="w-full md:w-1/2 bg-cover bg-center bg-no-repeat rounded-l-lg hidden md:block"
                        style={{ backgroundImage: 'url(https://i.ibb.co/B59KmYYH/flat-design-join-us-message.png)' }}
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
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-white cursor-pointer font-bold hover:underline"
                            >
                                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                            </button>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {isSignUp && (
                                <motion.div className="flex items-center space-x-4 border-b-2 pb-2">
                                    <FaUserAlt className="text-gray-600" />
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full border-none outline-none p-2 bg-transparent"
                                        required
                                    />
                                </motion.div>
                            )}

                            <motion.div className="flex items-center space-x-4 border-b-2 pb-2">
                                <MdEmail className="text-gray-600" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border-none outline-none p-2 bg-transparent"
                                    required
                                />
                            </motion.div>

                            <motion.div className="flex items-center space-x-4 border-b-2 pb-2">
                                <FaLock className="text-gray-600" />
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full border-none outline-none p-2 bg-transparent"
                                        required
                                    />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-2 top-2">
                                        {showPassword ? <AiFillEyeInvisible className="text-gray-600" /> : <AiFillEye className="text-gray-600" />}
                                    </button>
                                </div>
                            </motion.div>

                            {isSignUp && (
                                <motion.div className="flex items-center space-x-4 border-b-2 pb-2">
                                    <FaLock className="text-gray-600" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full border-none outline-none p-2 bg-transparent"
                                        required
                                    />
                                </motion.div>
                            )}

                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                            <motion.button type="submit" className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 cursor-pointer">
                                {isSignUp ? "Sign Up" : "Sign In"}
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={() => handleGoogleSignIn()}
                                className="w-full py-3 mt-4 flex justify-center items-center bg-white text-gray-700 font-semibold rounded-lg cursor-pointer shadow-md hover:bg-gray-100"
                            >
                                <FcGoogle className="text-2xl mr-2" />
                                Sign in with Google
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SignIn_Up;
