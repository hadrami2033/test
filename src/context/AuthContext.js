//AuthContext.js
import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import baseURL from "../utils/baseURL";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const [authTokens, setAuthTokens] = useState(() =>
    (typeof window !== 'undefined' && localStorage.getItem("authTokens"))
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    (typeof window !== 'undefined' && localStorage.getItem("authTokens"))
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [loging, setloging] = useState(false);


  const loginUser = async (values) => {
    setloging(true)
    const response = await fetch(`${baseURL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      })
    const data = await response.json();

    if (response.status === 200) {
      setInvalid(false);
      //console.log(data);
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      router.push('/').then(() => setloging(false))
    } else {
      setInvalid(true);
      setloging(false)
    }
  };

  const registerUser = async (username, password, password2) => {
    const response = await fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        password2,

      })
    });
    if (response.status === 201) {
      router.push("/login");
    } else {
      alert("Something went wrong!");
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    router.push("/login");
  };


  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
    invalid,
    loging
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};