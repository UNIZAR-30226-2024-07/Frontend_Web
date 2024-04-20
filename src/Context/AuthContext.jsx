import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/auth";


const AuthContext = createContext();


export async function returnMyName() {
  try {
      const response = await verifyTokenRequest();
      if (response.status === 200) {
          return {
              status: "success",
              data: response.data.user
          };
      } else {
          throw new Error(response.data.message || 'No users found');
      }
  } catch (error) {
      return {
          status: "error",
          message: error.message
      };
  }
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);


  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      if (res.status === 200) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        localStorage.setItem("token", res.data.token);
        if (res.data.user.rol === "admin") {
          setIsAdmin(true)
        }
      }
      return res
    } catch (error) {
      return {
        status: "error",
        message: error.response.data
      }
    }
  };



  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem("token", res.data.token);
      if (res.data.user.rol === "admin") {
        setIsAdmin(true)
      }
      return res
    } catch (error) {
      return {
        status: "error",
        message: error.response.data
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null);
    setIsAuthenticated(false)
    setIsAdmin(false)
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        setIsAdmin(false)
        return;
      }

      try {
        const res = await verifyTokenRequest(token);
        if (res.status !== 200) {
          setIsAuthenticated(false)
          setIsAdmin(false)
          return
        }
        setIsAuthenticated(true);
        setUser(res.data.user);
        setLoading(false);
        if (res.data.user.rol === "admin") {
          setIsAdmin(true)
        }
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
        setIsAdmin(false)
        return {
          status: "error",
          message: error.response.data
        }
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
