// Store user in localStorage after login
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get current user from localStorage
export const getUser = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

// Remove user from localStorage on logout
export const removeUser = () => {
  localStorage.removeItem('user');
};

// Check if user is logged in
export const isAuthenticated = () => {
  return getUser() !== null;
};

// Update user in localStorage (e.g. after salary update)
export const updateUser = (updatedFields) => {
  const current = getUser();
  if (current) {
    const updated = { ...current, ...updatedFields };
    setUser(updated);
    return updated;
  }
  return null;
};
