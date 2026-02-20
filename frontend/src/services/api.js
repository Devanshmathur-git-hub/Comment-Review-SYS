const API_BASE = 'http://localhost:5001/api';

// Helper to get auth headers
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// ============ AUTH ============

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
};

export const registerUser = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// ============ POSTS ============

export const getPosts = async () => {
    const res = await fetch(`${API_BASE}/posts`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
};

export const getPostById = async (id) => {
    const res = await fetch(`${API_BASE}/posts/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
};

// ============ COMMENTS ============

export const getComments = async (postId) => {
    const res = await fetch(`${API_BASE}/comments/${postId}`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
};

export const createComment = async (text, postId, parentId = null) => {
    const res = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text, postId, parentId }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    return res.json();
};

export const toggleLikeComment = async (commentId) => {
    const res = await fetch(`${API_BASE}/comments/${commentId}/like`, {
        method: 'PUT',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to like comment');
    return res.json();
};

export const deleteComment = async (commentId) => {
    const res = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return res.json();
};
