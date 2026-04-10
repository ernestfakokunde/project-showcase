export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
 
export const getUser = ()=>{
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export const isLoggedIn = () => !!localStorage.getItem("token")

export const logout = (navigate) => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  navigate("/login")
}