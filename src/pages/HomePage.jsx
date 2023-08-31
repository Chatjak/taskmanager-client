import { useLoaderData, json, defer, Await, redirect } from "react-router-dom";
import { Suspense } from "react";
import Home from "../components/home/Home";
import avatar1 from "../assets/avatar1.jpg";
import { getCookie } from "../middleware/cookie";

const HomePage = () => {
  const { response } = useLoaderData();

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={response}>
        {(loadedData) => <Home data={loadedData} />}
      </Await>
    </Suspense>
  );
};

export default HomePage;

const loadHomePage = async () => {
  const token = getCookie("token");
  if (token === null) {
    throw new Error("Could not fetch token.");
  } else {
    const response = await fetch("http://localhost:3000/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const task = await fetch(
      "http://localhost:3000/api/tasks?sortBy=createdAt:desc ",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const avatar = await fetch("http://localhost:3000/api/user/me/avatar", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Could not fetch events.");
    }

    if (!task.ok) {
      throw new Error("Could not fetch tasks.");
    }
    let avatarBlob;
    let avatarUrl;
    if (!avatar.ok) {
      avatarUrl = avatar1;
    } else {
      avatarBlob = await avatar.blob();
      avatarUrl = URL.createObjectURL(avatarBlob);
    }

    const user = await response.json();
    const tasks = await task.json();

    return { user, tasks, avatarUrl };
  }
};

export const loader = () => {
  return defer({
    response: loadHomePage(),
  });
};
