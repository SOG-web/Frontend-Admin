import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth, setPersist } = useAuth();

  const logout = async () => {
    setAuth({});
    setPersist("yes");
    localStorage.removeItem("refresh");

    try {
      const x = await axios("/admin/logout");
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
};

export default useLogout;
