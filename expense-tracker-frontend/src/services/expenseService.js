import api from './api';

export const addExpense = (data) => api.post('/expenses', data);

export const getExpensesByUser = (userId) => api.get(`/expenses/user/${userId}`);

export const getFilteredExpenses = (userId, params) =>
  api.get(`/expenses/user/${userId}`, { params });

export const getExpenseById = (expenseId) => api.get(`/expenses/${expenseId}`);

export const updateExpense = (expenseId, data) => api.put(`/expenses/${expenseId}`, data);

export const deleteExpense = (expenseId, userId) =>
  api.delete(`/expenses/${expenseId}`, { params: { userId } });

export const getTotalExpense = (userId) => api.get(`/expenses/user/${userId}/total`);

export const getDashboardSummary = (userId) => api.get(`/expenses/user/${userId}/summary`);

export const getCategorySummary = (userId) => api.get(`/expenses/user/${userId}/category-summary`);

export const getMonthlySummary = (userId) => api.get(`/expenses/user/${userId}/monthly`);

export const getRecentExpenses = (userId) => api.get(`/expenses/user/${userId}/recent`);
