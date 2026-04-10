import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  //on app load check if user is logged in
  useEffect(() =>{
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  const login = (userData, tokenData)=>{
  localStorage.setItem("user", JSON.stringify(userData))
  localStorage.setItem("token", tokenData)
  setUser(userData)
  setToken(tokenData)
  navigate("/feed")
}

const logout = ()=>{
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  setUser(null)
  setToken(null)
  navigate("/login")
}

const authFetch = async (url, options = {}) => {
    const res = await fetch(`http://localhost:8000${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })
    return res
  }

  return(
    <AuthContext.Provider value={{ user, token, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => useContext(AuthContext)