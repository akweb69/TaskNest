import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <motion.div
                className="p-6 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                {/* Gradient Title with Animation */}
                <motion.h1
                    className="text-5xl md:text-7xl font-extrabold py-5 bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 text-transparent bg-clip-text"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Plan Smart, Work Fast, Achieve More!
                </motion.h1>

                <motion.p
                    className="md:w-2/3 mx-auto text-lg text-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Welcome to <span className="font-bold">TaskNest</span>, your all-in-one task management solution designed to boost productivity and keep you organized like never before! Whether you're a solo professional or managing a team, TaskNest helps you:
                </motion.p>

                <motion.div
                    className="mt-6 text-xl font-semibold"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <ReactTyped
                        strings={[
                            "✨ Stay Organized – Track all tasks in one place",
                            "⚡ Boost Efficiency – Prioritize and complete work faster",
                            "🔔 Never Miss a Deadline – Smart reminders keep you on track",
                            "📊 Real-Time Collaboration – Work seamlessly with your team",
                        ]}
                        typeSpeed={40}
                        backSpeed={50}
                        loop
                    />
                </motion.div>

                {/* Eye-Catching Get Started Button */}
                <motion.button
                    className="mt-8 px-6 py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-lg transform hover:scale-105 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    <Link to={"/join_taskNest"}>   Get Started 🚀</Link>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Home;
