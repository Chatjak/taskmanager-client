import classes from "./Home.module.css";
import Card from "../UI/card";
import TasksList from "./TasksList";
import Create from "../create/Create";
import { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "../../middleware/cookie";
import Cookies from "js-cookie";
const Home = ({ data }) => {
  const [isClick, setIsClick] = useState(false);
  const [tasks, setTasks] = useState(data.tasks);
  const navigate = useNavigate();
  const onCreate = () => {
    setIsClick(true);
  };
  const closeCreate = (task) => {
    setIsClick(false);
    setTasks((prevData) => [task, ...prevData]);
  };
  const exitCreate = () => {
    setIsClick(false);
  };
  const delTask = (id) => {
    setTasks((task) => {
      const updateTask = task.filter((task) => task._id !== id);
      return updateTask;
    });
  };
  const updateTask = (id) => {
    setTasks((tasks) => {
      return tasks.map((task) => {
        if (task._id === id) {
          return { ...task, completed: true };
        }
        return task;
      });
    });
  };
  const logoutTask = async () => {
    try {
      const token = getCookie("token");
      const response = await fetch("http://localhost:3000/api/user/me/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw json(
          { message: "Something wrong on logout fucntion" },
          { status: 500 }
        );
      } else {
        Cookies.remove("token");
      }
      return navigate("/auth/login");
    } catch {
      throw new Error();
    }
  };
  return (
    <main>
      {isClick && (
        <Create
          id={data.user._id}
          avatar={data.avatarUrl}
          name={data.user.name}
          closeCreate={closeCreate}
          exitCreate={exitCreate}
        />
      )}
      <Card className={classes.userbox}>
        <div className={classes.userbox_img}>
          <img src={data.avatarUrl} alt="" />
        </div>
        <div className={classes.userbox_data}>
          <h1>{data.user.name}</h1>
          <div className={classes.userbox_data_option}>
            <button className={classes.create} onClick={onCreate}>
              Create
            </button>
            <button className={classes.logout} onClick={logoutTask}>
              Logout
            </button>
          </div>
        </div>
      </Card>
      <Card>
        <ul>
          {tasks.map((task) => (
            <TasksList
              key={task._id}
              id={task._id}
              content={task.content}
              description={task.description}
              completed={task.completed}
              delTask={delTask}
              updateTask={updateTask}
            />
          ))}
        </ul>
      </Card>
    </main>
  );
};

export default Home;
