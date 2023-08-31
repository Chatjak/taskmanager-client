export const setCookie = (name, value) => {
  document.cookie = `${name}=${value}`;
};

export const getCookie = (name) => {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

//set wait expirationDay
export const setCookieAndTime = (name, value, expirationDay) => {
  const date = new Date();
  date.setTime(date.getTime() + expirationDay * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};
