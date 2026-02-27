const users = [
  { email: "user1@anon.com", password: "123456" },
  { email: "user2@anon.com", password: "123456" },
  { email: "user3@anon.com", password: "123456" },
  { email: "demo@anon.com", password: "demo123" },
];

export const login = (email, password) => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem("authUser", JSON.stringify({ email: user.email }));
    return { email: user.email };
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem("authUser");
};

export const getAuthUser = () => {
  const data = localStorage.getItem("authUser");
  return data ? JSON.parse(data) : null;
};

export const isAuthenticated = () => {
  return !!getAuthUser();
};
