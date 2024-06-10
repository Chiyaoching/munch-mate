export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  // Optionally: decode the token and check its validity
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};
