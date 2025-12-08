import React from "react";

const OurSteps = () => {
  const steps = [
    { title: "Fresh Ingredients", desc: "We source the finest cocoa and ingredients" },
    { title: "Handcrafted", desc: "Each batch is carefully made with love" },
    { title: "Quality Check", desc: "Rigorous quality control for perfect texture" },
    { title: "Fast Delivery", desc: "Fresh from oven to your doorstep" }
  ];

  return (
    <section className="bg-linear-to-br from-[#543310] to-[#74512D] py-20 px-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#F8F4E1] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#AF8F6F] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#F8F4E1] rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-center text-[#F8F4E1] mb-4">Our Baking Process</h2>
        <p className="text-[#AF8F6F] text-center text-lg mb-12 max-w-2xl mx-auto">
          Discover the journey of how we create our premium brownies with passion and precision
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center group hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="bg-[#F8F4E1]/20 backdrop-blur-sm border border-[#F8F4E1]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:bg-[#F8F4E1]/30 group-hover:scale-110">
                <span className="text-2xl text-[#F8F4E1] font-bold">{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-[#F8F4E1] mb-4 group-hover:text-white transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-[#AF8F6F] leading-relaxed group-hover:text-[#F8F4E1] transition-colors duration-300">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurSteps;