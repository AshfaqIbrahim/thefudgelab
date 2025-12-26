    import { api } from "../Api/Axios";

    // Check if user is blocked by userId
    export const checkUserBlocked = async (userId) => {
    try {
        const response = await api.get(`/blockedUsers?userId=${userId}`);
        return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
        console.error("Error checking blocked user:", error);
        return null;
    }
    };

    // Check if user is blocked by email (for login)
    export const checkUserBlockedByEmail = async (email) => {
    try {
        const response = await api.get(`/blockedUsers?email=${email}`);
        return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
        console.error("Error checking blocked user by email:", error);
        return null;
    }
    };

    // Block a user
    export const blockUser = async (userId, userEmail, adminId, reason = "") => {
    try {
        const response = await api.post("/blockedUsers", {
        id: `block_${Date.now()}`,
        userId,
        email: userEmail,
        blockedAt: new Date().toISOString(),
        blockedBy: adminId,
        reason: reason || "Violation of terms",
        });
        return response.data;
    } catch (error) {
        console.error("Error blocking user:", error);
        throw error;
    }
    };

    // Unblock a user
    export const unblockUser = async (blockId) => {
    try {
        await api.delete(`/blockedUsers/${blockId}`);
        return true;
    } catch (error) {
        console.error("Error unblocking user:", error);
        throw error;
    }
    };

    // Get all blocked users
    export const getBlockedUsers = async () => {
    try {
        const response = await api.get("/blockedUsers");
        return response.data;
    } catch (error) {
        console.error("Error fetching blocked users:", error);
        return [];
    }
    };