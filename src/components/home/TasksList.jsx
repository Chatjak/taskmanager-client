import { json } from "react-router-dom";
import { getCookie } from "../../middleware/cookie";
import classes from "./TasksList.module.css";
import { BsCheckLg, BsXLg } from "react-icons/bs";
const TasksList = ({
  id,
  content,
  description,
  completed,
  updateTask,
  delTask,
}) => {
  const DeleteTask = async () => {
    const url = `http://localhost:3000/api/tasks/${id}`;
    const token = getCookie("token");
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw json({ message: "Cloud not delete taks" }, { status: 500 });
    } else {
      delTask(id);
    }
  };
  const confirmTask = async () => {
    const url = `http://localhost:3000/api/tasks/${id}`;
    const token = getCookie("token");
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: true,
      }),
    });
    if (!response.ok) {
      throw json({ message: "Cloud not update task" }, { statue: 500 });
    } else {
      updateTask(id);
    }
  };
  return (
    <li className={classes.list}>
      <div className={classes.content}>
        <h2 className={completed ? classes.fontcompleted : ""}>{content}</h2>
        <p>{description}</p>
      </div>
      <div className={classes.options}>
        <div className={classes.delete} onClick={DeleteTask}>
          <BsXLg />
        </div>
        <div
          className={completed ? classes.completed : classes.checkbox}
          onClick={completed ? null : confirmTask}
        >
          <BsCheckLg />
        </div>
      </div>
    </li>
  );
};

export default TasksList;
