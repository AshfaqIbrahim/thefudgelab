// const Testimonials = () => {
//   const reviews = [
//     { name: "Mufeed", comment: "The Bento Brownie is an excellent hero product — the presentation is unique and Instagram-worthy. Highlighting customization options or special toppings could boost even more appeal.", rating: 5 },
//     { name: "Ashfaq", comment: "The idea of a brownie tub is fun, modern, and indulgent! Make the creamy and gooey textures more visible in the images to elevate crave-ability.", rating: 5 },
//     { name: "Mahroof", comment: "A short flavor description (crispy kunafa + rich chocolate) will help customers understand the uniqueness and give them confidence to try it.", rating: 4 }
//   ];

//   return (
//     <section className="bg-[#F8F4E1] py-20 px-6">
//       <div className="max-w-4xl mx-auto text-center">
//         <h2 className="text-4xl font-bold text-[#543310] mb-4">What Our Customers Say</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
//           {reviews.map((review, index) => (
//             <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
//               <div className="text-yellow-400 mb-4">{"⭐".repeat(review.rating)}</div>
//               <p className="text-[#74512D] italic mb-4">"{review.comment}"</p>
//               <p className="text-[#543310] font-semibold">{review.name}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials

import React, { useState, useEffect } from "react";
import { reviewService } from "../services/reviewServices";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    rating: 5,
  });
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  // Load reviews on component mount
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const fetchedReviews = await reviewService.getReviews();
    setReviews(fetchedReviews);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setSubmitStatus({ type: "error", message: "Please enter your name" });
      return;
    }
    if (!formData.comment.trim()) {
      setSubmitStatus({ type: "error", message: "Please enter your feedback" });
      return;
    }
    if (formData.comment.trim().length < 10) {
      setSubmitStatus({
        type: "error",
        message: "Feedback should be at least 10 characters",
      });
      return;
    }

    setSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      const newReview = await reviewService.addReview(formData);
      setReviews((prev) => [newReview, ...prev]); // Add new review to the top
      setFormData({ name: "", comment: "", rating: 5 });
      setShowForm(false);
      setSubmitStatus({
        type: "success",
        message: "Thank you for your feedback!",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to submit feedback. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, interactive = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange(star)}
            className={`text-2xl ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-[#F8F4E1] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#543310] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-[#74512D] mb-6">
            Join thousands of happy customers who love our brownies!
          </p>

          {/* Toggle Form Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#543310] text-white px-6 py-3 rounded-lg hover:bg-[#74512D] transition-colors duration-300 font-semibold"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        {/* Review Submission Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#543310] mb-4">
              Share Your Experience
            </h3>

            {submitStatus.message && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  submitStatus.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[#543310] font-semibold mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#543310]"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#543310] font-semibold mb-2">
                  Rating *
                </label>
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(rating) =>
                    setFormData((prev) => ({ ...prev, rating }))
                  }
                  interactive={true}
                />
              </div>

              <div className="mb-6">
                <label className="block text-[#543310] font-semibold mb-2">
                  Your Feedback *
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#543310]"
                  placeholder="Tell us about your experience with our products..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#543310] text-white py-3 rounded-lg hover:bg-[#74512D] transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {/* Reviews Display */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#543310]"></div>
          </div>
        ) : (
          <>
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <p className="text-[#74512D] text-lg">
                  No reviews yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="mb-4">
                      <StarRating rating={review.rating} interactive={false} />
                    </div>
                    <p className="text-[#74512D] italic mb-4">
                      "{review.comment}"
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-[#543310] font-semibold">
                        {review.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
