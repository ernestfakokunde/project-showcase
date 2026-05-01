import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  //on app load check if user is logged in
  useEffect(() =>{
    console.log("AuthProvider: Checking localStorage for existing session");
    let cancelled = false;
    
    // Test if localStorage works
    try {
      localStorage.setItem("_test", "test");
      const testVal = localStorage.getItem("_test");
      localStorage.removeItem("_test");
      if (testVal !== "test") {
        console.warn("AuthProvider: localStorage appears to be read-only or not working correctly");
      }
    } catch (e) {
      console.error("AuthProvider: localStorage is not available:", e.message);
    }
    
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    console.log("AuthProvider: storedUser=", !!storedUser, "storedToken=", !!storedToken);

    const restoreSession = async () => {
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("AuthProvider: Parsed user:", { username: parsedUser.username, email: parsedUser.email });
        let freshUser = parsedUser;

        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          const data = await res.json();

          if (res.ok && data.user) {
            freshUser = data.user;
            localStorage.setItem("user", JSON.stringify(freshUser));
          }
        } catch (error) {
          console.warn("AuthProvider: Could not refresh current user:", error.message);
        }

        if (!cancelled) {
          setUser(freshUser)
          setToken(storedToken)
          console.log("AuthProvider: Session restored from localStorage");
        }
      } catch (e) {
        console.error("AuthProvider: Failed to parse stored user:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else {
      console.log("AuthProvider: No session found in localStorage");
    }
    if (!cancelled) {
      setLoading(false)
    }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [])

  const login = (userData, tokenData)=>{
    console.log("AuthProvider: Saving login data to localStorage");
    console.log("AuthProvider: userData =", { username: userData.username, email: userData.email });
    console.log("AuthProvider: tokenData =", tokenData ? "present" : "missing");
    
    try {
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", tokenData)
      console.log("AuthProvider: Data saved to localStorage successfully");
      
      // Verify it was saved
      const verifyUser = localStorage.getItem("user");
      const verifyToken = localStorage.getItem("token");
      console.log("AuthProvider: Verification - user saved:", !!verifyUser, "token saved:", !!verifyToken);
    } catch (e) {
      console.error("AuthProvider: Failed to save to localStorage:", e);
    }
    
    setUser(userData)
    setToken(tokenData)
    navigate("/feed")
  }

const logout = ()=>{
  console.log("AuthProvider: Logging out and clearing localStorage");
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  setUser(null)
  setToken(null)
  navigate("/login")
}

const authFetch = async (url, options = {}) => {
    // Get fresh token from localStorage instead of closure
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      console.warn("AuthProvider: No token found for request to", url);
    }
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
        ...options.headers,
      },
    })
    return res
  }

  return(
    <AuthContext.Provider value={{ user, token, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => useContext(AuthContext)
