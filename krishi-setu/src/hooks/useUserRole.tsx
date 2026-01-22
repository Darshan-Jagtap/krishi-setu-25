import { useAuth } from './useAuth';

export type UserRole = 'farmer' | 'processor' | 'buyer';

export const useUserRole = () => {
    const { user, userRole, loading } = useAuth();

    return {
        role: userRole,
        loading,
        userId: user?.id || null
    };
};
