import React from "react";
import ProductHero from "../Components/ProductHero";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ProductShowcase from "../Components/ProductShowcase";
import Testimonials from "../Components/Testimonials";
import OurSteps from "../Components/OurSteps";




const Home = () => {
  return (
    <div>
      <Navbar />
      <ProductHero />
      <ProductShowcase />
      <OurSteps />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
