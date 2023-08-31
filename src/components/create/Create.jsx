import { BsXLg } from "react-icons/bs";
import Card from "../UI/card";
import classes from "./Create.module.css";
import ReactDom from "react-dom";
import { Form, json } from "react-router-dom";
import moment from "moment";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import Loading from "../UI/Loading";
import { getCookie } from "../../middleware/cookie";
const Backdeop = (props) => {
  return <div className={classes.backdrop} />;
};

const ModalOverlay = ({ id, name, avatar, closeCreate, exitCreate }) => {
  const date = moment().format("LT");
  const contentInputRef = useRef();
  const descriptionInputRef = useRef();
  const [isLoading, setisLoading] = useState(false);
  const onSaveTask = async (event) => {
    event.preventDefault();
    setisLoading(true);
    const token = getCookie("token");
    const enteredContent = contentInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const taskData = {
      content: enteredContent,
      description: enteredDescription,
    };
    const url = "http://localhost:3000/api/tasks";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw json({ message: "Could not save tasks" }, { status: 500 });
    } else {
      setisLoading(false);
      const task = await response.json();
      closeCreate(task);
    }
  };
  return (
    <>
      <Card className={classes.modal}>
        <div className={classes.header}>
          <p>Create task</p>
          {/* <div className={classes.goback}>
            <BsXLg />
          </div> */}
        </div>
        {isLoading && (
          <div className={classes.loadingcenter}>
            <Loading />
          </div>
        )}
        {!isLoading && (
          <form onSubmit={onSaveTask}>
            <div className={classes.userdata}>
              <div className={classes.userdata_img}>
                <img src={avatar} alt="" />
              </div>
              <div className={classes.nameandcurrentime}>
                <Link to={`/${id}`} style={{ textDecoration: "none" }}>
                  <p className={classes.nameandcurrentime_name}>{name}</p>
                </Link>
                <p>{date}</p>
              </div>
            </div>
            <div className={classes.contentarea}>
              <label htmlFor="content">Title :</label>
              <input
                type="text"
                name="content"
                ref={contentInputRef}
                id="content"
              />
              <label htmlFor="description">Description :</label>
              <input
                type="text"
                ref={descriptionInputRef}
                name="description"
                id="description"
              />
            </div>
            <div className={classes.modalsubmit}>
              <button className={classes.cancel} onClick={exitCreate}>
                Cancel
              </button>
              <button type="submit" className={classes.save}>
                Save
              </button>
            </div>
          </form>
        )}
      </Card>
    </>
  );
};

const Create = ({ id, name, avatar, closeCreate, exitCreate }) => {
  return (
    <>
      {ReactDom.createPortal(
        <Backdeop />,
        document.getElementById("backdrop-root")
      )}
      {ReactDom.createPortal(
        <ModalOverlay
          id={id}
          name={name}
          avatar={avatar}
          closeCreate={closeCreate}
          exitCreate={exitCreate}
        />,
        document.getElementById("overlay-root")
      )}
    </>
  );
};

export default Create;
