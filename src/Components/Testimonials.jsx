const Testimonials = () => {
  const reviews = [
    { name: "Mufeed", comment: "The Bento Brownie is an excellent hero product — the presentation is unique and Instagram-worthy. Highlighting customization options or special toppings could boost even more appeal.", rating: 5 },
    { name: "Ashfaq", comment: "The idea of a brownie tub is fun, modern, and indulgent! Make the creamy and gooey textures more visible in the images to elevate crave-ability.", rating: 5 },
    { name: "Mahroof", comment: "A short flavor description (crispy kunafa + rich chocolate) will help customers understand the uniqueness and give them confidence to try it.", rating: 4 }
  ];

  return (
    <section className="bg-[#F8F4E1] py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#543310] mb-4">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-yellow-400 mb-4">{"⭐".repeat(review.rating)}</div>
              <p className="text-[#74512D] italic mb-4">"{review.comment}"</p>
              <p className="text-[#543310] font-semibold">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials