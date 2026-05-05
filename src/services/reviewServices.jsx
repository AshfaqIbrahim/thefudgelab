import { api } from "../Api/Axios";

export const reviewService = {
  // Fetch all reviews
  async getReviews() {
    try {
      const response = await api.get("/reviews");
      return response.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest first
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  // Add a new review
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
};
