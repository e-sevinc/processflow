const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API isteği başarısız');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    logout() {
        this.setToken(null);
    }

    // User
    async getUserProfile() {
        return this.request('/user/profile');
    }

    // Workspaces
    async getWorkspaces() {
        return this.request('/workspaces');
    }

    async createWorkspace(workspaceData) {
        return this.request('/workspaces', {
            method: 'POST',
            body: JSON.stringify(workspaceData),
        });
    }

    async getWorkspace(id) {
        return this.request(`/workspaces/${id}`);
    }

    // Processes
    async getProcesses(workspaceId) {
        return this.request(`/workspaces/${workspaceId}/processes`);
    }

    async createProcess(workspaceId, processData) {
        return this.request(`/workspaces/${workspaceId}/processes`, {
            method: 'POST',
            body: JSON.stringify(processData),
        });
    }

    async getProcess(id) {
        return this.request(`/processes/${id}`);
    }

    // Process Elements
    async createProcessElement(processId, elementData) {
        return this.request(`/processes/${processId}/elements`, {
            method: 'POST',
            body: JSON.stringify(elementData),
        });
    }

    // Process Connections
    async createProcessConnection(processId, connectionData) {
        return this.request(`/processes/${processId}/connections`, {
            method: 'POST',
            body: JSON.stringify(connectionData),
        });
    }

    // Process Elements - Update
    async updateProcessElement(processId, elementId, elementData) {
        return this.request(`/processes/${processId}/elements/${elementId}`, {
            method: 'PUT',
            body: JSON.stringify(elementData),
        });
    }

    // Process Elements - Delete
    async deleteProcessElement(processId, elementId) {
        return this.request(`/processes/${processId}/elements/${elementId}`, {
            method: 'DELETE',
        });
    }

    // Process Connections - Delete
    async deleteProcessConnection(processId, connectionId) {
        return this.request(`/processes/${processId}/connections/${connectionId}`, {
            method: 'DELETE',
        });
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Singleton instance
const apiService = new ApiService();
export default apiService; 