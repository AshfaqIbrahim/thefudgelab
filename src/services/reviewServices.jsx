import { api } from "../Api/Axios";

export const reviewService = {
  // Fetch all reviews
  async getReviews() {
    try {
      const response = await api.get("/reviews");
      return response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  // Add a new review (now requires userId)
  async addReview(review) {
    try {
      const newReview = {
        ...review,
        id: Date.now(),
        date: new Date().toISOString(),
      };

      const response = await api.post("/reviews", newReview);
      return response.data;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  // Optional: Get reviews by specific user
  async getUserReviews(userId) {
    try {
      const response = await api.get(`/reviews?userId=${userId}`);
      return response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      return [];
    }
  },
};
