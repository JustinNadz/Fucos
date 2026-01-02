const API_BASE = "http://localhost:3001/api/v1";

// Get stored token
function getToken() {
    return localStorage.getItem("focus_token");
}

// Set token
export function setToken(token) {
    localStorage.setItem("focus_token", token);
}

// Remove token
export function removeToken() {
    localStorage.removeItem("focus_token");
}

// Fetch wrapper with auth
async function fetchWithAuth(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Request failed" }));
        throw new Error(error.error || "Request failed");
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// Auth API
export const authApi = {
    async signup(name, email, password) {
        const data = await fetchWithAuth("/auth/signup", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });
        setToken(data.token);
        return data.user;
    },

    async login(email, password) {
        const data = await fetchWithAuth("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        setToken(data.token);
        return data.user;
    },

    async me() {
        return fetchWithAuth("/auth/me");
    },

    logout() {
        removeToken();
    },
};

// Tasks API
export const tasksApi = {
    async list() {
        return fetchWithAuth("/tasks");
    },

    async create(text) {
        return fetchWithAuth("/tasks", {
            method: "POST",
            body: JSON.stringify({ text }),
        });
    },

    async update(id, data) {
        return fetchWithAuth(`/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async delete(id) {
        return fetchWithAuth(`/tasks/${id}`, {
            method: "DELETE",
        });
    },
};

// Sessions API
export const sessionsApi = {
    async list() {
        return fetchWithAuth("/sessions");
    },

    async create(task, minutes) {
        return fetchWithAuth("/sessions", {
            method: "POST",
            body: JSON.stringify({ task, minutes }),
        });
    },

    async stats() {
        return fetchWithAuth("/sessions/stats");
    },
};

// Settings API
export const settingsApi = {
    async get() {
        return fetchWithAuth("/settings");
    },

    async update(settings) {
        return fetchWithAuth("/settings", {
            method: "PUT",
            body: JSON.stringify(settings),
        });
    },
};

export default {
    auth: authApi,
    tasks: tasksApi,
    sessions: sessionsApi,
    settings: settingsApi,
};
