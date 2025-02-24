import axios from "axios";

export const isAuthorized = async () => {
  let result = false;
  try {
    await axios.get("/api1/users/checkauth",
        {
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }
    ).then((response) => {
        if (response.status === 200) {
            result = true;
        }
    });
  } catch (error) {
  }
  return result;
};

export const removeUser = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

