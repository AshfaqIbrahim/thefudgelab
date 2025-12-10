// import React, { useEffect, useRef, useState } from "react";
// import { useCart } from "../Context/CartContext";
// import axios from 'axios'
// import { api } from "../Api/Axios";

// const ProductShowcase = () => {
//   const scrollContainerRef = useRef(null)
//   const [selectedProduct, setSelectedProduct] = useState(null)
//   const [quantity, setQuantity] = useState(1)
//   const { addToCart } = useCart()
//   const [products, setProducts] = useState([])
  
//   useEffect(() => {
//     api.get("/products")
//     .then(res => setProducts(res.data))
//     .catch((err) => console.log("Error fetching products",err))
//   },[])

//   const tags = ["New", "Best Seller"]
//   const exclusive = products.filter((item)=> tags.includes(item.tag))
  

//   const scroll = (direction) => {
//     const container = scrollContainerRef.current;
//     const scrollAmount = 350;
//     if (container) {
//       container.scrollBy({
//         left: direction === 'left' ? -scrollAmount : scrollAmount,
//         behavior: 'smooth'
//       });
//     }
//   };

//   const openProductDetails = (product) => {
//     setSelectedProduct(product);
//     setQuantity(1);
//     document.body.style.overflow = 'hidden';
//   };

//   const closeProductDetails = () => {
//     setSelectedProduct(null);
//     document.body.style.overflow = 'unset';
//   };

//   const handleQuantityChange = (change) => {
//     setQuantity(prev => Math.max(1, prev + change));
//   };

//   const handleAddToCart = () => {
//     addToCart(selectedProduct, quantity);
//     closeProductDetails();
//     alert(`${quantity} ${selectedProduct.name} added to cart!`);
//   };

//   return (
//     <>
//       <section className="bg-linear-to-br from-[#F8F4E1] to-[#AF8F6F] py-20 px-6 relative">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl font-bold text-center text-[#543310] mb-4 playfair-heading">Premium Brownie Collection</h2>
//           <p className="text-[#74512D] text-center text-lg mb-12 max-w-2xl mx-auto poppins-body">
//             Indulge in our artisanal brownies, each with a unique personality
//           </p>

//           {/* Glass Navigation Buttons */}
//           <button 
//             onClick={() => scroll('left')}
//             className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg border border-white/30 text-[#543310] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl z-10 transition-all hover:bg-white/30 hover:scale-110"
//           >
//             ←
//           </button>
//           <button 
//             onClick={() => scroll('right')}
//             className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg border border-white/30 text-[#543310] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl z-10 transition-all hover:bg-white/30 hover:scale-110"
//           >
//             →
//           </button>

//           {/* Glass Morphism Scroll Container */}
//           <div 
//             ref={scrollContainerRef}
//             className="flex overflow-x-auto gap-8 pb-6 scroll-smooth px-4"
//             style={{
//               scrollbarWidth: 'none',
//               msOverflowStyle: 'none'
//             }}
//           >
//             {exclusive.map((product) => (
//               <div 
//                 key={product.id} 
//                 className="shrink-0 w-80 bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 cursor-pointer"
//                 onClick={() => openProductDetails(product)}
//               >
//                 <div className="relative overflow-hidden rounded-2xl mb-4 group">
//                   <img 
//                     src={product.image} 
//                     alt={product.name} 
//                     className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   <div className="absolute top-4 left-4 bg-[#543310]/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
//                     {product.tag}
//                   </div>
//                 </div>
                
//                 <div className="text-center">
//                   <h3 className="text-2xl font-bold text-[#543310] mb-2 playfair-heading">{product.name}</h3>
//                   <p className="text-[#74512D] text-xl font-bold mb-4 poppins-body">{product.price}</p>
//                   <div className="flex gap-3">
//                     <button 
//                       className="flex-1 bg-[#543310] hover:bg-[#74512D] text-white py-3 rounded-xl transition-all duration-300 font-semibold hover:shadow-lg poppins-body"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         openProductDetails(product);
//                       }}
//                     >
//                       View Details
//                     </button>
                    
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Product Details Modal */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div 
//             className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Product Image */}
//               <div className="relative">
//                 <img 
//                   src={selectedProduct.image} 
//                   alt={selectedProduct.name}
//                   className="w-full h-96 lg:h-full object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
//                 />
//                 <div className="absolute top-4 left-4 bg-[#543310]/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                   {selectedProduct.tag}
//                 </div>
//                 <button 
//                   onClick={closeProductDetails}
//                   className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#543310] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Product Details */}
//               <div className="p-8">
//                 <h2 className="text-3xl font-bold text-[#543310] mb-4 playfair-heading">{selectedProduct.name}</h2>
//                 <p className="text-2xl font-bold text-[#74512D] mb-6 poppins-body">{selectedProduct.price}</p>
                
//                 <div className="space-y-6">
//                   {/* Description */}
//                   <div>
//                     <h3 className="text-lg font-semibold text-[#543310] mb-2 playfair-heading">Description</h3>
//                     <p className="text-[#74512D] leading-relaxed poppins-body">{selectedProduct.description}</p>
//                   </div>

//                   {/* Ingredients */}
//                   <div>
//                     <h3 className="text-lg font-semibold text-[#543310] mb-2 playfair-heading">Ingredients</h3>
//                     <ul className="text-[#74512D] list-disc list-inside space-y-1 poppins-body">
//                       {selectedProduct.ingredients.map((ingredient, index) => (
//                         <li key={index}>{ingredient}</li>
//                       ))}
//                     </ul>
//                   </div>

//                   {/* Product Info */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <h4 className="text-sm font-semibold text-[#543310] playfair-heading">Weight</h4>
//                       <p className="text-[#74512D] poppins-body">{selectedProduct.weight}</p>
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-semibold text-[#543310] playfair-heading">Servings</h4>
//                       <p className="text-[#74512D] poppins-body">{selectedProduct.servings}</p>
//                     </div>
//                   </div>

//                   {/* Allergens */}
//                   <div>
//                     <h4 className="text-sm font-semibold text-[#543310] playfair-heading">Allergens</h4>
//                     <p className="text-[#74512D] text-sm poppins-body">{selectedProduct.allergens}</p>
//                   </div>

//                   {/* Quantity Selector */}
//                   <div className="flex items-center gap-4">
//                     <span className="text-lg font-semibold text-[#543310] playfair-heading">Quantity:</span>
//                     <div className="flex items-center gap-3">
//                       <button 
//                         onClick={() => handleQuantityChange(-1)}
//                         className="w-10 h-10 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg flex items-center justify-center transition-all duration-300"
//                       >
//                         -
//                       </button>
//                       <span className="text-xl font-bold text-[#543310] w-8 text-center poppins-body">{quantity}</span>
//                       <button 
//                         onClick={() => handleQuantityChange(1)}
//                         className="w-10 h-10 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg flex items-center justify-center transition-all duration-300"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-4 pt-4">
//                     <button 
//                       onClick={handleAddToCart}
//                       className="flex-1 bg-[#543310] hover:bg-[#74512D] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg poppins-body"
//                     >
//                       Add to Cart - ₹{(parseInt(selectedProduct.price.replace('₹', '')) * quantity).toLocaleString()}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProductShowcase;

import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../Context/CartContext";
import axios from 'axios'
import { api } from "../Api/Axios";

const ProductShowcase = () => {
  const scrollContainerRef = useRef(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    api.get("/products")
    .then(res => setProducts(res.data))
    .catch((err) => console.log("Error fetching products",err))
  },[])

  const tags = ["New", "Best Seller"]
  const exclusive = products.filter((item)=> tags.includes(item.tag))
  

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = 350;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    document.body.style.overflow = 'hidden';
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    closeProductDetails();
    alert(`${quantity} ${selectedProduct.name} added to cart!`);
  };

  return (
    <>
      <section className="bg-linear-to-br from-[#F8F4E1] to-[#AF8F6F] py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#543310] mb-4 playfair-heading">Premium Brownie Collection</h2>
          <p className="text-[#74512D] text-center text-lg mb-12 max-w-2xl mx-auto poppins-body">
            Indulge in our artisanal brownies, each with a unique personality
          </p>

          {/* Glass Navigation Buttons - Hidden on mobile */}
          <button 
            onClick={() => scroll('left')}
            className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg border border-white/30 text-[#543310] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl z-10 transition-all hover:bg-white/30 hover:scale-110"
          >
            ←
          </button>
          <button 
            onClick={() => scroll('right')}
            className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg border border-white/30 text-[#543310] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl z-10 transition-all hover:bg-white/30 hover:scale-110"
          >
            →
          </button>

          {/* Glass Morphism Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-8 pb-6 scroll-smooth px-4 md:px-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {exclusive.map((product) => (
              <div 
                key={product.id} 
                className="shrink-0 w-80 bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 cursor-pointer"
                onClick={() => openProductDetails(product)}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 group">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4 bg-[#543310]/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                    {product.tag}
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#543310] mb-2 playfair-heading">{product.name}</h3>
                  <p className="text-[#74512D] text-xl font-bold mb-4 poppins-body">{product.price}</p>
                  <div className="flex gap-3">
                    <button 
                      className="flex-1 bg-[#543310] hover:bg-[#74512D] text-white py-3 rounded-xl transition-all duration-300 font-semibold hover:shadow-lg poppins-body"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductDetails(product);
                      }}
                    >
                      View Details
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Swipe Indicator - Only visible on mobile */}
          <div className="md:hidden flex justify-center items-center mt-6 space-x-2">
            <div className="w-2 h-2 bg-[#543310]/30 rounded-full"></div>
            <div className="w-2 h-2 bg-[#543310]/30 rounded-full"></div>
            <div className="w-2 h-2 bg-[#543310]/70 rounded-full"></div>
            <div className="w-2 h-2 bg-[#543310]/30 rounded-full"></div>
            <div className="w-2 h-2 bg-[#543310]/30 rounded-full"></div>
            <span className="text-sm text-[#543310]/60 ml-2">Swipe →</span>
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-96 lg:h-full object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
                />
                <div className="absolute top-4 left-4 bg-[#543310]/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedProduct.tag}
                </div>
                <button 
                  onClick={closeProductDetails}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#543310] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  ✕
                </button>
              </div>

              {/* Product Details */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-[#543310] mb-4 playfair-heading">{selectedProduct.name}</h2>
                <p className="text-2xl font-bold text-[#74512D] mb-6 poppins-body">{selectedProduct.price}</p>
                
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#543310] mb-2 playfair-heading">Description</h3>
                    <p className="text-[#74512D] leading-relaxed poppins-body">{selectedProduct.description}</p>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#543310] mb-2 playfair-heading">Ingredients</h3>
                    <ul className="text-[#74512D] list-disc list-inside space-y-1 poppins-body">
                      {selectedProduct.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Product Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#543310] playfair-heading">Weight</h4>
                      <p className="text-[#74512D] poppins-body">{selectedProduct.weight}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#543310] playfair-heading">Servings</h4>
                      <p className="text-[#74512D] poppins-body">{selectedProduct.servings}</p>
                    </div>
                  </div>

                  {/* Allergens */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#543310] playfair-heading">Allergens</h4>
                    <p className="text-[#74512D] text-sm poppins-body">{selectedProduct.allergens}</p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-[#543310] playfair-heading">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        className="w-10 h-10 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg flex items-center justify-center transition-all duration-300"
                      >
                        -
                      </button>
                      <span className="text-xl font-bold text-[#543310] w-8 text-center poppins-body">{quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        className="w-10 h-10 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg flex items-center justify-center transition-all duration-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#543310] hover:bg-[#74512D] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg poppins-body"
                    >
                      Add to Cart - ₹{(parseInt(selectedProduct.price.replace('₹', '')) * quantity).toLocaleString()}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductShowcase;