import type { Access } from 'payload';

/**
 * Check if user has admin role
 */
export const isAdmin: Access = ({ req: { user } }) => {
    return user?.role === 'admin';
};

/**
 * Check if user is admin or editor
 */
export const isAdminOrEditor: Access = ({ req: { user } }) => {
    return user?.role === 'admin' || user?.role === 'editor';
};

/**
 * Check if user is logged in
 */
export const isLoggedIn: Access = ({ req: { user } }) => {
    return Boolean(user);
};
