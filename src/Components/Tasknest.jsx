import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiHome, FiSettings, FiLogOut } from "react-icons/fi";
import { RiTodoLine } from "react-icons/ri";
import { MdDone, MdPending } from "react-icons/md";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTasks, FaCheckCircle, FaEdit, FaTrash, FaRegClock } from "react-icons/fa";
// Sidebar animation variants
const sidebarVariants = {
    hidden: { x: -250, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 25 } }
};

const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const Tasknest = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [my_task, setMy_task] = useState([])
    const [add, setAdd] = useState(false)

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        // Cleanup the listener when component unmounts
        return () => unsubscribe();
    }, [user]);
    // load data
    useEffect(() => {
        axios.get("https://task-ms-server.vercel.app/all_task")
            .then(data => {
                const allData = data.data;
                const my_task = allData.filter(d => d?.email === user?.email)
                setMy_task(my_task)

            })
    }, [user?.email])
    // signout 
    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                toast.success("SignOut success!")
                navigate("/")

            })
            .catch(() => {
                toast.error("Something went wrong try again letter!")
            })
    }
    // add task functionality
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('To-Do');

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { title, description, category, email: user?.email, }
        axios.post("https://task-ms-server.vercel.app/add_task", data)
            .then((res) => {
                toast.success("Task added succesfully!")
                setAdd(false)
                axios.get("https://task-ms-server.vercel.app/all_task")
                    .then(data => {
                        const allData = data.data;
                        const my_task = allData.filter(d => d?.email === user?.email)
                        setMy_task(my_task)

                    })
            })
            .catch(err => {
                console.log(err)
            })
    };

    // complete button functionality
    const handleComplete = (id) => {
        axios.patch("https://task-ms-server.vercel.app/completed", { id })
            .then(res => {
                console.log(res.data);
                axios.get("https://task-ms-server.vercel.app/all_task")
                    .then(data => {
                        const allData = data.data;
                        const my_task = allData.filter(d => d?.email === user?.email)
                        setMy_task(my_task)

                    })
                toast.success("Task is completed!");
            })
            .catch(err => {
                console.error("Error:", err);
            });
    };

    // edit button functionality
    const handleEditTask = (id, updatedData) => {
        axios.patch(`https://task-ms-server.vercel.app/edit-task/${id}`, updatedData)
            .then(res => {
                console.log(res.data);
                toast.success("Task updated successfully!");
                // refecth
                axios.get("https://task-ms-server.vercel.app/all_task")
                    .then(data => {
                        const allData = data.data;
                        const my_task = allData.filter(d => d?.email === user?.email)
                        setMy_task(my_task)

                    })
            })
            .catch(err => {
                console.error("Error updating task:", err);
            });
    };
    // open edit modal 
    const [openEditModal, setOpenEditModal] = useState(false)
    const handleOpenEditModal = (id) => {
        setOpenEditModal(true)
        console.log(id)
    }
    // delete functionality
    const handleDeleteTask = (id) => {
        axios.delete(`https://task-ms-server.vercel.app/delete-task/${id}`)
            .then(res => {
                console.log(res.data);
                toast.success("Task deleted successfully!");
                // refecth
                axios.get("https://task-ms-server.vercel.app/all_task")
                    .then(data => {
                        const allData = data.data;
                        const my_task = allData.filter(d => d?.email === user?.email)
                        setMy_task(my_task)

                    })
            })
            .catch(err => {
                console.error("Error deleting task:", err);
            });
    };


    return (
        <div className="w-full min-h-screen flex bg-indigo-950">
            {/* edit modal */}
            {
                openEditModal && <div className="w-full h-screen flex justify-center items-center bg-[rgba(0,0,0,0.4)] backdrop-blur-sm fixed top-0">
                    hello

                </div>
            }
            {/* modal add task */}
            {
                add && <div className="w-full h-screen flex justify-center items-center bg-[rgba(0,0,0,0.4)] backdrop-blur-sm fixed top-0">
                    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-5">
                        <div>
                            <label className="block">Title (required, max 50 characters)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength="50"
                                required
                                className="w-full p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block">Description (optional, max 200 characters)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength="200"
                                className="w-full p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-2 border"
                            >
                                <option value="To-Do">To-Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => setAdd(false)}
                                className="px-4 py-2 bg-gray-500 cursor-pointer text-white rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                </div>
            }
            {/* Left Sidebar (Always Visible on Big Screen) */}
            <aside className="hidden md:flex flex-col w-64 bg-indigo-900 text-white p-6 min-h-screen shadow-lg">
                <h1 className="text-2xl font-bold">Tasknest</h1>
                <nav className="flex flex-col gap-3 mt-4">
                    <motion.a href="#" className="flex items-center gap-2 p-2 hover:bg-indigo-500 rounded"
                        whileHover={{ scale: 1.1 }}
                    >
                        <FiHome /> Dashboard
                    </motion.a>
                    <motion.a href="#" className="flex items-center gap-2 p-2 hover:bg-indigo-500 rounded"
                        whileHover={{ scale: 1.1 }}
                    >
                        <RiTodoLine /> Todo
                    </motion.a>
                    <motion.a href="#" className="flex items-center gap-2 p-2 hover:bg-indigo-500 rounded"
                        whileHover={{ scale: 1.1 }}
                    >
                        <MdPending /> Pending
                    </motion.a>
                    <motion.a href="#" className="flex items-center gap-2 p-2 hover:bg-indigo-500 rounded"
                        whileHover={{ scale: 1.1 }}
                    >
                        <MdDone /> Completed
                    </motion.a>
                    <motion.a href="#" className="flex items-center gap-2 p-2 hover:bg-indigo-500 rounded"
                        whileHover={{ scale: 1.1 }}
                    >
                        <FiSettings /> Settings
                    </motion.a>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <div className="w-full p-4 bg-indigo-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Menu Icon for Mobile (Hidden on Big Screens) */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden text-2xl"
                        >
                            <FiMenu />
                        </button>
                        <h1 className="text-lg font-semibold">Tasknest</h1>
                    </div>

                    {/* Sign Out Button */}
                    <button
                        onClick={() => handleSignOut()}
                        className="flex items-center gap-2 bg-indigo-800 px-3 py-1 rounded hover:bg-indigo-900 transition">
                        <FiLogOut /> Sign Out
                    </button>
                </div>

                {/* Content Section */}
                <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="px-6 h-screen overflow-y-scroll pb-20"
                >
                    {my_task?.length === 0 && <div className="py-10">
                        <h2 className="text-2xl font-bold text-gray-200">Welcome to Tasknest</h2>
                        <p className="text-gray-100 mt-2">Manage your tasks efficiently with an intuitive interface.</p>

                        <button onClick={() => setAdd(true)} className="p-2 px-4 rounded-lg text-white bg-green-600">Add Task +</button>
                    </div>}
                    {
                        my_task?.length > 0 && <div className="w-full space-y-3">
                            {/* btn add a task */}
                            <div className="flex justify-end pt-4">
                                <button onClick={() => setAdd(true)} className="p-2 px-4 rounded-lg text-white bg-green-600">Add Task +</button>
                            </div>
                            {/* todo list */}
                            <div className=" py-4">
                                <h1 className="text-xl md:text-2xl text-orange-600 font-bold">ToDo:</h1>
                                <div className="w-full grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {my_task?.filter(y => y?.category === "To-Do").map(x => (
                                        <motion.div
                                            key={x._id}
                                            className="p-5 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-300 dark:border-gray-700"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                        >
                                            {/* Header - Category & Task Icon */}
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                                                    {x?.category}
                                                </span>
                                                <FaTasks className="text-gray-500 dark:text-gray-400 text-lg" />
                                            </div>

                                            {/* Title & Description */}
                                            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                                {x?.title}
                                            </h1>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                                                {x?.description}
                                            </p>

                                            {/* Action Buttons */}
                                            <div className="flex justify-between items-center mt-4">
                                                <motion.button
                                                    onClick={() => handleComplete(x?._id)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FaCheckCircle /> Complete
                                                </motion.button>

                                                <div className="flex items-center gap-3">
                                                    <motion.button
                                                        onClick={() => handleOpenEditModal(x?._id)}
                                                        className="text-blue-500 hover:text-blue-600 text-lg"
                                                        // onClick={() => onEdit(x)}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FaEdit />
                                                    </motion.button>

                                                    <motion.button
                                                        onClick={() => handleDeleteTask(x?._id)}
                                                        className="text-red-500 hover:text-red-600 text-lg"
                                                        // onClick={() => onDelete(x._id)}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FaTrash />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}


                                </div>
                            </div>
                            {/* pending list */}
                            <div className="">
                                <div className=" py-4">
                                    <h1 className="text-xl md:text-2xl text-orange-600 font-bold">In Progress
                                        :</h1>
                                    <div className="w-full grid grid-cols-3  md:grid-cols-4 gap-4">
                                        {
                                            my_task?.filter(y => y?.category === "In Progress").map(x => (
                                                <motion.div
                                                    key={x._id}
                                                    className="p-5 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-300 dark:border-gray-700"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                                >
                                                    {/* Header - Category & Task Icon */}
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                                                            {x?.category}
                                                        </span>
                                                        <FaTasks className="text-gray-500 dark:text-gray-400 text-lg" />
                                                    </div>

                                                    {/* Title & Description */}
                                                    <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                                        {x?.title}
                                                    </h1>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                                                        {x?.description}
                                                    </p>

                                                    {/* Action Buttons */}
                                                    <div className="flex justify-between items-center mt-4">
                                                        <motion.button
                                                            onClick={() => handleComplete(x?._id)}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <FaCheckCircle /> Complete
                                                        </motion.button>

                                                        <div className="flex items-center gap-3">
                                                            <motion.button
                                                                onClick={() => handleOpenEditModal(x?._id)}
                                                                className="text-blue-500 hover:text-blue-600 text-lg"
                                                                // onClick={() => onEdit(x)}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FaEdit />
                                                            </motion.button>

                                                            <motion.button
                                                                onClick={() => handleDeleteTask(x?._id)}
                                                                className="text-red-500 hover:text-red-600 text-lg"
                                                                // onClick={() => onDelete(x._id)}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FaTrash />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        }

                                    </div>
                                </div>
                            </div>
                            {/* completed list */}
                            <div className="">
                                <div className=" py-4">
                                    <h1 className="text-xl md:text-2xl text-orange-600 font-bold">Completed:</h1>
                                    <div className="w-full grid grid-cols-3  md:grid-cols-4 gap-4">
                                        {
                                            my_task?.filter(y => y?.category === "Done").map(x => (
                                                <motion.div
                                                    key={x._id}
                                                    className="p-5 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-300 dark:border-gray-700"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                                >
                                                    {/* Header - Category & Task Icon */}
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                                                            {x?.category}
                                                        </span>
                                                        <FaTasks className="text-gray-500 dark:text-gray-400 text-lg" />
                                                    </div>

                                                    {/* Title & Description */}
                                                    <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                                        {x?.title}
                                                    </h1>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                                                        {x?.description}
                                                    </p>

                                                    {/* Action Buttons */}
                                                    <div className="flex justify-between items-center mt-4">
                                                        <motion.button
                                                            onClick={() => handleComplete(x?._id)}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <FaCheckCircle /> Complete
                                                        </motion.button>

                                                        <div className="flex items-center gap-3">
                                                            <motion.button
                                                                onClick={() => handleOpenEditModal(x?._id)}
                                                                className="text-blue-500 hover:text-blue-600 text-lg"
                                                                // onClick={() => onEdit(x)}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FaEdit />
                                                            </motion.button>

                                                            <motion.button
                                                                onClick={() => handleDeleteTask(x?._id)}
                                                                className="text-red-500 hover:text-red-600 text-lg"
                                                                // onClick={() => onDelete(x._id)}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FaTrash />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </motion.div>
            </div>

            {/* Mobile Sidebar (Opens on Click) */}
            {isSidebarOpen && (
                <motion.aside
                    variants={sidebarVariants}
                    initial="hidden"
                    animate="visible"
                    className="fixed top-0 left-0 h-full w-64 bg-indigo-700 text-white p-6 flex flex-col shadow-lg z-50 md:hidden"
                >
                    {/* Close Button for Mobile Sidebar */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="absolute top-4 right-4 text-white text-2xl"
                    >
                        <FiX />
                    </button>

                    <h1 className="text-2xl font-bold">Tasknest</h1>
                    <nav className="flex flex-col gap-3 mt-4">
                        <motion.a href="#" className="flex items-center gap-2 p-2 hover:bg-indigo-500 rounded"
                            whileHover={{ scale: 1.1 }}
                        >
                            <FiHome /> Dashboard
                        </motion.a>
                        <motion.a href="#" className="flex items-center gap-2 p-2 hover:bg-indigo-500 rounded"
                            whileHover={{ scale: 1.1 }}
                        >
                            <RiTodoLine /> Todo
                        </motion.a>
                        <motion.a href="#" className="flex items-center gap-2 p-2 hover:bg-indigo-500 rounded"
                            whileHover={{ scale: 1.1 }}
                        >
                            <MdPending /> Pending
                        </motion.a>
                        <motion.a href="#" className="flex items-center gap-2 p-2 hover:bg-indigo-500 rounded"
                            whileHover={{ scale: 1.1 }}
                        >
                            <MdDone /> Completed
                        </motion.a>
                        <motion.a href="#" className="flex items-center gap-2 p-2 hover:bg-indigo-500 rounded"
                            whileHover={{ scale: 1.1 }}
                        >
                            <FiSettings /> Settings
                        </motion.a>
                    </nav>
                </motion.aside>
            )}
        </div>
    );
};

export default Tasknest;
