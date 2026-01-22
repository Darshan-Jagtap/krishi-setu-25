// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// Authentication API
export const authAPI = {
    register: async (data: {
        email: string;
        password: string;
        full_name: string;
        role: string;
        phone?: string;
        location?: string;
    }) => {
        return authFetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    login: async (email: string, password: string) => {
        return authFetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    getCurrentUser: async () => {
        return authFetch('/api/auth/me');
    },

    updateProfile: async (data: {
        full_name?: string;
        phone?: string;
        location?: string;
    }) => {
        return authFetch('/api/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};

// Orders API
export const ordersAPI = {
    createOrder: async (orderData: any) => {
        return authFetch('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    getUserOrders: async () => {
        return authFetch('/api/orders/my-orders');
    },

    getOrder: async (orderId: string) => {
        return authFetch(`/api/orders/${orderId}`);
    },

    updateOrderStatus: async (orderId: string, status: string, progress?: number) => {
        return authFetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, progress }),
        });
    },

    getSellerOrders: async () => {
        return authFetch('/api/orders/seller-orders');
    },

    cancelOrder: async (orderId: string, reason?: string) => {
        return authFetch(`/api/orders/${orderId}/cancel`, {
            method: 'PUT',
            body: JSON.stringify({ reason }),
        });
    },
};

// Products API
export const productsAPI = {
    getAll: async (params?: { category?: string; status?: string; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString();
        return authFetch(`/api/products${queryString ? `?${queryString}` : ''}`);
    },

    getById: async (productId: string) => {
        return authFetch(`/api/products/${productId}`);
    },

    create: async (productData: any) => {
        return authFetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },

    update: async (productId: string, productData: any) => {
        return authFetch(`/api/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    },

    delete: async (productId: string) => {
        return authFetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });
    },

    getMyProducts: async () => {
        return authFetch('/api/products/seller/my-products');
    },
};

// Upload API
export const uploadAPI = {
    uploadImage: async (file: File) => {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/api/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    analyzeImage: async (file: File) => {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/api/analyze-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Analysis failed' }));
            throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    },
};

// Statistics API
export const statsAPI = {
    getFarmerStats: async () => {
        return authFetch('/api/stats/farmer');
    },

    getBuyerStats: async () => {
        return authFetch('/api/stats/buyer');
    },

    getProcessorStats: async () => {
        return authFetch('/api/stats/processor');
    },
};

// FPO API
export const fpoAPI = {
    // Member management
    getMembers: async () => {
        return authFetch('/api/fpo/members');
    },

    addMember: async (memberData: {
        farmer_email?: string;
        farmer_id?: string;
        membership_number?: string;
        contribution_percentage?: number;
        notes?: string;
        tags?: string[];
    }) => {
        return authFetch('/api/fpo/members', {
            method: 'POST',
            body: JSON.stringify(memberData),
        });
    },

    updateMember: async (memberId: string, memberData: {
        status?: string;
        contribution_percentage?: number;
        notes?: string;
        tags?: string[];
    }) => {
        return authFetch(`/api/fpo/members/${memberId}`, {
            method: 'PUT',
            body: JSON.stringify(memberData),
        });
    },

    removeMember: async (memberId: string) => {
        return authFetch(`/api/fpo/members/${memberId}`, {
            method: 'DELETE',
        });
    },

    balanceContributions: async () => {
        return authFetch('/api/fpo/members/balance', {
            method: 'POST',
        });
    },

    // Analytics
    getMemberAnalytics: async () => {
        return authFetch('/api/fpo/analytics');
    },

    // Transactions
    getTransactions: async () => {
        return authFetch('/api/orders/seller-orders');
    },

    // Payment distribution
    createPaymentDistribution: async (distributionData: {
        order_id: string;
        distributions: Array<{
            member_id: string;
            farmer_id: string;
            amount: number;
            percentage: number;
            product_contribution: number;
        }>;
        notes?: string;
    }) => {
        return authFetch('/api/fpo/payments/distribute', {
            method: 'POST',
            body: JSON.stringify(distributionData),
        });
    },

    getPaymentDistributions: async () => {
        return authFetch('/api/fpo/payments/distributions');
    },

    updatePaymentDistribution: async (distributionId: string, updateData: {
        distribution_index?: number;
        payment_method?: string;
        transaction_hash?: string;
    }) => {
        return authFetch(`/api/fpo/payments/distributions/${distributionId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },
};

// Export API URL for direct use
export { API_URL };

