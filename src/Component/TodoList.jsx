

import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import todoImage from "../image/todo.png";
import TodoListSkeleton from "./TodoListSkeleton";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [editTaskId, setEditTaskId] = useState(null);

  const debouncedAddTaskRef = useRef();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    try {
      const storedTasks = localStorage.getItem("todos");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching todos:", error);
      setIsLoading(false);
    }
  };

  const saveTasksToLocalStorage = (tasksToSave) => {
    localStorage.setItem("todos", JSON.stringify(tasksToSave));
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTask = useCallback(() => {
    if (inputValue.trim() === "") {
      return;
    }

    const newTask = {
      id: Math.random().toString(36),
      title: inputValue,
      completed: false,
    };

    try {
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setInputValue("");
      toast.success("Task added successfully");
    } catch (error) {
      console.log("Error adding task:", error);
      toast.error("Error adding task");
    }
  }, [inputValue, tasks]);

  useEffect(() => {
    debouncedAddTaskRef.current = debounce(handleAddTask, 500);

    return () => {
      debouncedAddTaskRef.current?.cancel();
    };
  }, [handleAddTask]);

  const handleButtonClick = () => {
    if (editTaskId) {
      handleUpdateTask();
    } else {
      debouncedAddTaskRef.current();
    }
  };

  const handleTaskCheckboxChange = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    toast.success("Task deleted successfully");
  };

  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title);
  };

  const handleUpdateTask = () => {
    if (inputValue.trim() === "") {
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === editTaskId ? { ...task, title: inputValue } : task
    );
    
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setInputValue("");
    setEditTaskId(null);
    toast.success("Task updated successfully");
  };

  const handleCompleteAll = () => {
    const updatedTasks = tasks.map((task) => ({ ...task, completed: true }));
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleClearCompleted = () => {
    const updatedTasks = tasks.filter((task) => !task.completed);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true;
    } else if (filter === "completed") {
      return task.completed;
    } else if (filter === "uncompleted") {
      return !task.completed;
    }
    return true;
  });

  if (isLoading) {
    return <TodoListSkeleton />;
  }

  return (
    <div className="max-h-screen h-screen w-full text-black bg-orange-600/70 flex items-center md:items-start justify-center py-8">
      <ToastContainer />
      <div className="w-full bg-white border-2 border-black rounded-xl p-4 md:p-10 pb-16 max-w-lg mx-4">
        <h2 className="flex text-blue-600 items-center justify-center mb-5 text-2xl font-semibold">
          <img src={todoImage} alt="todo-image" className="w-8 ml-2" />
          Todo List
        </h2>

        <div className="flex items-center justify-between bg-gray-200 rounded-full pl-5 mb-6">
          <input
            type="text"
            className="flex-1 border-none outline-none bg-transparent py-3 px-2 w-full"
            placeholder="Add your todo"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            className="border-none outline-none py-4 px-8 bg-red-600 text-white text-base cursor-pointer rounded-full hover:bg-red-700 transition disabled:opacity-80"
            onClick={handleButtonClick}
            disabled={!inputValue.trim() && !editTaskId}
          >
            {editTaskId ? "Update" : "Add"}
          </button>
        </div>

        <div className="flex justify-center text-sm md:text-base font-medium mb-5 gap-6 md:gap-8">
          <p
            className="cursor-pointer hover:text-blue-600 bg-gray-100 px-6 py-2 md:px-4 rounded-2xl whitespace-normal md:whitespace-nowrap"
            onClick={handleCompleteAll}
          >
            Complete all tasks
          </p>
          <p
            className="cursor-pointer md:hover:text-red-600 bg-red-700/50 md:bg-gray-100 px-6 py-2 md:px-4 rounded-2xl whitespace-normal md:whitespace-nowrap"
            onClick={handleClearCompleted}
          >
            Delete completed tasks
          </p>
        </div>

        <div className="max-h-[35vh] overflow-y-auto">
          <ul className="list-none m-0 p-0">
            {filteredTasks.reverse().map((task) => (
              <li
                key={task.id}
                className="py-3 px-2 flex justify-between items-center hover:bg-yellow-50 rounded"
              >

<div className="flex items-center">
  <input
    type="checkbox"
    id={`task-${task.id}`}
    className="mr-2"  // चेकबॉक्स को दिखाने के लिए hidden हटाया
    checked={task.completed}
    onChange={() => handleTaskCheckboxChange(task.id)}
  />
  <span className={`${task.completed ? "line-through" : ""}`}>
    {task.title}
  </span>
</div>


                
                <div className="flex">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                    className="w-6 h-6 mr-3 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => handleEditTask(task.id)}
                    alt="Edit"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                    className="w-6 h-6 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => handleDeleteTask(task.id)}
                    alt="Delete"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between">
          <div className="relative inline-block mb-4 sm:mb-0 group">
  <button className="bg-green-500 text-white py-2 px-6 rounded-2xl hover:bg-green-600">
    {filter.toUpperCase()}
  </button>
  <div className="hidden absolute bottom-full left-0 bg-white min-w-40 shadow-md z-10 group-hover:block border rounded-2xl overflow-hidden">
    {[
      { id: "all", label: "All" },
      { id: "uncompleted", label: "Uncompleted" },
      { id: "completed", label: "Completed" },
    ].map((ctg) => (
      <a
        key={ctg.id}
        href="#"
        className={`block py-2 px-4 hover:bg-gray-100 ${
          filter === ctg.id ? "bg-green-100 text-green-600 font-medium" : ""
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleFilterChange(ctg.id);
        }}
      >
        {ctg.label}
      </a>
    ))}
  </div>
</div>

          <div className="text-sm mb-2 sm:mb-0 bg-gray-100 px-6 py-2 rounded-2xl whitespace-nowrap">
            <p>
              Completed:{" "}
              <span className="font-medium">
                {tasks.filter((task) => task.completed).length}
              </span>
            </p>
          </div>
          <div className="text-sm bg-gray-100 px-6 py-2 rounded-2xl whitespace-nowrap">
            <p>
              Total Tasks: <span className="font-medium">{tasks.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;