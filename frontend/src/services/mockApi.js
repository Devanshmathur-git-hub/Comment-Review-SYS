/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} avatar
 */

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} text
 * @property {string} authorId
 * @property {string} postId
 * @property {string | null} parentId
 * @property {string} createdAt
 * @property {number} likes
 */

// Initial Mock Data
const users = [
    { id: 'u1', name: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
    { id: 'u2', name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    { id: 'u3', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
];

let comments = [
    {
        id: 'c1',
        text: 'Great post! Thanks for sharing.',
        authorId: 'u2',
        postId: 'p1',
        parentId: null,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        likes: 5,
    },
    {
        id: 'c2',
        text: 'I agree, very insightful.',
        authorId: 'u3',
        postId: 'p1',
        parentId: 'c1',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
        likes: 2,
    },
    {
        id: 'c3',
        text: 'Can you elaborate on the second point?',
        authorId: 'u1',
        postId: 'p1',
        parentId: null,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        likes: 0,
    },
];

export const getCommentsConfig = (postId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Deep copy to avoid reference issues in mock
            resolve(JSON.parse(JSON.stringify(comments.filter((c) => c.postId === postId))));
        }, 500); // Simulate network delay
    });
};

export const createComment = (text, authorId, postId, parentId = null) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newComment = {
                id: Math.random().toString(36).substr(2, 9),
                text,
                authorId,
                postId,
                parentId,
                createdAt: new Date().toISOString(),
                likes: 0,
            };
            comments = [...comments, newComment]; // Update in-memory
            resolve(newComment);
        }, 500);
    });
};

export const likeComment = (commentId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const commentIndex = comments.findIndex((c) => c.id === commentId);
            if (commentIndex > -1) {
                comments[commentIndex].likes += 1;
                // In a real app, you'd toggle like for a specific user
                resolve(comments[commentIndex]);
            } else {
                resolve(null);
            }
        }, 200);
    });
};

export const getUser = (userId) => {
    return users.find(u => u.id === userId);
}

export const getAllUsers = () => users;
