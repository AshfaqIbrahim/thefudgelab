import React from "react";
import { useNavigate } from "react-router-dom";


const ProductHero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#F8F4E1] w-full py-20 px-6 md:px-20 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <div>
          <h1 className="text-5xl md:text-5xl playfair-heading text-[#543310] leading-tight">
            Freshly Baked <br /> Happiness Delivered
          </h1>

          <p className="text-[#74512D] mt-4 text-lg max-w-md playfair-body">
            Premium handmade brownies with rich chocolate layers, 
            topped with the finest almonds and served with love. 
            Taste the perfect blend of flavor and softness in every bite!
          </p>

          <button 
            onClick={()=> navigate("/products")}
            className="mt-8 bg-[#74512D] hover:bg-[#543310] text-white px-10 py-3 rounded-lg text-lg font-semibold shadow-md transition"
          >
            Explore
          </button>
        </div>

        {/* Right Image */}
        <div className="relative flex justify-center">
          <img
            src="/src/assets/home-cover1.jpg"
            alt="Brownie"
            className="w-full max-w-lg drop-shadow-2xl rounded-lg"
          />
          <div className="absolute -z-10 bg-[#AF8F6F] w-64 h-64 rounded-full blur-2xl opacity-20"></div>
        </div>

      </div>
    </section>
  );
};

export default ProductHero;