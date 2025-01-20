import { format } from 'date-fns';

export const formatDate = (date) => {
    return format(new Date(date), 'PPp');
};

export const getErrorMessage = (error) => {
    return error.response?.data?.error?.message || 'Something went wrong';
};

export const getUserFromStorage = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}; 