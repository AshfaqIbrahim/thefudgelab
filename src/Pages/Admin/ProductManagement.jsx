import React, { useState, useEffect } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import {
  PlusCircle,
  Package,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Upload,
  Image,
} from "lucide-react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/adminService";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Brownies",
    description: "",
    ingredients: "Premium ingredients",
    weight: "300g",
    servings: "2-4 people",
    allergens: "Contains dairy, gluten, and nuts",
    tag: "New",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Component mounted, fetching products...");
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Calling getProducts()...");

      const data = await getProducts();
      console.log("Raw products data from API:", data);

      if (!Array.isArray(data)) {
        console.error("Products data is not an array:", data);
        setError("Invalid data format received from server");
        setProducts([]);
        return;
      }

      // Process products to ensure valid image URLs
      const processedProducts = data.filter((product) => {
        if (!product || !product.id) {
          console.log("Skipping invalid product (no id):", product);
          return false;
        }
        if (!product.name || product.name.trim() === "") {
          console.log("Skipping product with empty name:", product.id);
          return false;
        }
        if (!product.price || product.price.includes("₹₹")) {
          console.log(
            "Skipping product with invalid price:",
            product.id,
            product.price
          );
          return false;
        }
        return true;
      }).map(product => ({
        ...product,
        // Ensure image URL is properly formatted
        image: product.image ? 
          (product.image.startsWith('http') ? product.image : `/${product.image.replace(/^\//, '')}`) 
          : '/images/placeholder.jpg'
      }));

      console.log(
        "Valid products after processing:",
        processedProducts.length,
        processedProducts
      );
      setProducts(processedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(`Failed to load products: ${error.message || "Unknown error"}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image") {
      setImagePreview(value);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue) || priceValue <= 0) {
      setError("Please enter a valid price (e.g., 699)");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Starting to add product with data:", formData);

      // Convert ingredients string to array
      const ingredientsArray = formData.ingredients
        ? formData.ingredients
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item)
        : ["Premium ingredients"];

      // Clean the price - remove any ₹ symbols and ensure it's a number
      const cleanPrice = formData.price.replace("₹", "").trim();
      const numericPrice = parseFloat(cleanPrice);

      if (isNaN(numericPrice) || numericPrice <= 0) {
        setError("Invalid price format");
        return;
      }

      // Ensure image URL is properly formatted
      let imageUrl = formData.image || "/images/placeholder.jpg";
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = `/${imageUrl}`;
      }

      const productData = {
        name: formData.name.trim(),
        price: numericPrice.toString(),
        category: formData.category || "Brownies",
        description: formData.description.trim(),
        ingredients: ingredientsArray,
        weight: formData.weight || "300g",
        servings: formData.servings || "2-4 people",
        allergens: formData.allergens || "Contains dairy, gluten, and nuts",
        tag: formData.tag || "New",
        image: imageUrl,
      };

      console.log("Sending product data to API:", productData);

      const response = await addProduct(productData);
      console.log("Add product response:", response);

      // Refresh the products list
      await fetchProducts();

      // Close modal and reset form
      setShowAddModal(false);
      resetForm();

      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      setError(
        `Failed to add product: ${
          error.message || "Please check console for details"
        }`
      );
      alert("Failed to add product. Check console for error details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    console.log("Editing product:", product);
    setSelectedProduct(product);

    // Extract numeric value from price (remove ₹ symbol)
    const priceValue = product.price
      ? product.price.replace("₹", "").trim()
      : "";

    setFormData({
      name: product.name || "",
      price: priceValue,
      category: product.category || "Brownies",
      description: product.description || "",
      ingredients: Array.isArray(product.ingredients)
        ? product.ingredients.join(", ")
        : product.ingredients || "Premium ingredients",
      weight: product.weight || "300g",
      servings: product.servings || "2-4 people",
      allergens: product.allergens || "Contains dairy, gluten, and nuts",
      tag: product.tag || "New",
      image: product.image || "",
    });
    setImagePreview(product.image || "");
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedProduct || !selectedProduct.id) {
      setError("No product selected for update");
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue) || priceValue <= 0) {
      setError("Please enter a valid price (e.g., 699)");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log(
        "Updating product ID:",
        selectedProduct.id,
        "with data:",
        formData
      );

      // Convert ingredients string to array
      const ingredientsArray = formData.ingredients
        ? formData.ingredients
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item)
        : ["Premium ingredients"];

      // Clean the price
      const cleanPrice = formData.price.replace("₹", "").trim();
      const numericPrice = parseFloat(cleanPrice);

      if (isNaN(numericPrice) || numericPrice <= 0) {
        setError("Invalid price format");
        return;
      }

      // Ensure image URL is properly formatted
      let imageUrl = formData.image || selectedProduct.image || "/images/placeholder.jpg";
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = `/${imageUrl}`;
      }

      const updatedProduct = {
        name: formData.name.trim(),
        price: numericPrice.toString(),
        category: formData.category || "Brownies",
        description: formData.description.trim(),
        ingredients: ingredientsArray,
        weight: formData.weight || "300g",
        servings: formData.servings || "2-4 people",
        allergens: formData.allergens || "Contains dairy, gluten, and nuts",
        tag: formData.tag || "New",
        image: imageUrl,
      };

      console.log(
        "Sending update for product:",
        selectedProduct.id,
        updatedProduct
      );

      const response = await updateProduct(selectedProduct.id, updatedProduct);
      console.log("Update product response:", response);

      // Refresh the products list
      await fetchProducts();

      // Close modal and reset
      setShowEditModal(false);
      setSelectedProduct(null);
      resetForm();

      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      setError(
        `Failed to update product: ${
          error.message || "Please check console for details"
        }`
      );
      alert("Failed to update product. Check console for error details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!id) {
      console.error("No product ID provided for deletion");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        console.log("Deleting product ID:", id);
        await deleteProduct(id);
        await fetchProducts();
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "Brownies",
      description: "",
      ingredients: "Premium ingredients",
      weight: "300g",
      servings: "2-4 people",
      allergens: "Contains dairy, gluten, and nuts",
      tag: "New",
      image: "",
    });
    setImagePreview("");
    setError("");
  };

  const categories = [
    "Brownies",
    "Cheesecakes",
    "Cakes",
    "Desserts",
    "Special",
  ];
  const tags = ["New", "Best Seller", "Popular", "Featured"];

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      (product.category && product.category.toLowerCase().includes(searchLower))
    );
  });

  // Default images with proper paths
  const defaultImages = [
    "/images/image4.jpg",
    "/images/cover.jpg",
    "/images/image9.jpg",
    "/images/image10.jpg",
    "/images/image12.jpg",
    "/images/image6.jpg",
  ];

  // SIMPLE MODAL COMPONENT
  const ProductModal = ({ isEdit, onSubmit, onClose, initialData }) => {
    const [localFormData, setLocalFormData] = useState(initialData);
    const [localImagePreview, setLocalImagePreview] = useState(
      initialData.image
    );
    const [localError, setLocalError] = useState("");

    const handleLocalInputChange = (e) => {
      const { name, value } = e.target;
      setLocalFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "image") {
        setLocalImagePreview(value);
      }
    };

    const handleLocalImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setLocalImagePreview(imageUrl);
        setLocalFormData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
      }
    };

    const handleLocalSubmit = (e) => {
      e.preventDefault();

      // Validate price
      const priceValue = parseFloat(localFormData.price);
      if (!localFormData.price || isNaN(priceValue) || priceValue <= 0) {
        setLocalError("Please enter a valid price (e.g., 699)");
        return;
      }

      // Update parent formData
      Object.keys(localFormData).forEach((key) => {
        setFormData((prev) => ({ ...prev, [key]: localFormData[key] }));
      });

      // Submit
      onSubmit(e);
    };

    const handleDefaultImageClick = (defaultImg) => {
      setLocalImagePreview(defaultImg);
      setLocalFormData((prev) => ({ ...prev, image: defaultImg }));
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[#543310]">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={onClose}
                className="text-[#74512D] hover:text-[#543310]"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {localError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{localError}</p>
              </div>
            )}

            <form onSubmit={handleLocalSubmit} className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-[#543310] mb-2">
                  Product Image
                </label>
                <div className="space-y-4">
                  {/* Image Preview */}
                  {localImagePreview && (
                    <div className="relative">
                      <img
                        src={localImagePreview}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-lg border border-[#AF8F6F]/30"
                        onError={(e) => {
                          console.error("Image failed to load:", localImagePreview);
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLocalImagePreview("");
                          setLocalFormData((prev) => ({ ...prev, image: "" }));
                        }}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-[#543310] w-8 h-8 rounded-full flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* URL Input */}
                    <div>
                      <label className="block text-sm font-medium text-[#543310] mb-2">
                        Image URL
                      </label>
                      <div className="relative">
                        <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#74512D]" />
                        <input
                          type="text"
                          name="image"
                          value={localFormData.image}
                          onChange={handleLocalInputChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full pl-10 pr-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        />
                      </div>
                      <p className="text-xs text-[#74512D] mt-1">
                        Enter image URL or upload a file
                      </p>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-[#543310] mb-2">
                        Upload Image
                      </label>
                      <label
                        className={`flex items-center justify-center w-full h-10 border-2 border-dashed rounded-lg transition-colors ${
                          isSubmitting
                            ? "border-gray-300 cursor-not-allowed"
                            : "border-[#AF8F6F]/50 hover:border-[#74512D] cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center space-x-2 text-[#74512D]">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Choose file</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLocalImageUpload}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                      </label>
                      <p className="text-xs text-[#74512D] mt-1">
                        JPG, PNG, GIF up to 5MB
                      </p>
                    </div>
                  </div>

                  {/* Default Image Options */}
                  <div>
                    <p className="text-sm font-medium text-[#543310] mb-2">
                      Or use a default image:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {defaultImages.map((defaultImg, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDefaultImageClick(defaultImg)}
                          className="w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#543310] focus:border-[#543310] disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          <img
                            src={defaultImg}
                            alt={`Default ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error("Default image failed to load:", defaultImg);
                              e.target.src = "/images/placeholder.jpg";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#543310] mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={localFormData.name}
                    onChange={handleLocalInputChange}
                    className="w-full px-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={isSubmitting}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#543310] mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={localFormData.price}
                    onChange={handleLocalInputChange}
                    className="w-full px-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    min="0"
                    step="0.01"
                    placeholder="699"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-[#74512D] mt-1">
                    Enter price without ₹ symbol
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#543310] mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={localFormData.category}
                    onChange={handleLocalInputChange}
                    className="w-full px-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#543310] mb-2">
                    Tag
                  </label>
                  <select
                    name="tag"
                    value={localFormData.tag}
                    onChange={handleLocalInputChange}
                    className="w-full px-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#543310] mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={localFormData.description}
                  onChange={handleLocalInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isSubmitting}
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#543310] mb-2">
                  Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  name="ingredients"
                  value={localFormData.ingredients}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Premium Chocolate, Fresh Cream, Almonds, etc."
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#543310] mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={localFormData.weight}
                    onChange={handleLocalInputChange}
                    className="w-full px-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="300g"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#543310] mb-2">
                    Servings
                  </label>
                  <input
                    type="text"
                    name="servings"
                    value={localFormData.servings}
                    onChange={handleLocalInputChange}
                    className="w-full px-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="2-4 people"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#543310] mb-2">
                    Allergens
                  </label>
                  <input
                    type="text"
                    name="allergens"
                    value={localFormData.allergens}
                    onChange={handleLocalInputChange}
                    className="w-full px-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Contains dairy, gluten, and nuts"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-[#543310] text-[#543310] rounded-lg hover:bg-[#F8F4E1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#543310] text-white rounded-lg hover:bg-[#74512D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEdit ? "Updating..." : "Adding..."}
                    </>
                  ) : isEdit ? (
                    "Update Product"
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF8F6F]"></div>
          <p className="ml-4 text-[#543310] mt-4">Loading products...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#543310]">
              Product Management
            </h1>
            <p className="text-[#74512D] mt-1">
              Manage your product catalog and inventory
            </p>
            {error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#543310] text-white px-4 py-2.5 rounded-lg hover:bg-[#74512D] transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
            disabled={isSubmitting}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#74512D]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30"
              />
            </div>
          </div>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-[#AF8F6F]/50 rounded-lg hover:bg-[#F8F4E1] transition-colors w-full md:w-auto">
            <Filter className="w-4 h-4 text-[#74512D]" />
            <span>Filter</span>
          </button>
        </div>

        {/* Debug info */}
        <div className="text-sm text-[#74512D]">
          <p>
            Total products: {products.length} | Showing:{" "}
            {filteredProducts.length}
          </p>
          {products.length === 0 && (
            <p className="text-amber-600">
              No products found. Check console for details.
            </p>
          )}
        </div>

        {/* Products Table - Responsive */}
        <div className="bg-white rounded-lg border border-[#F8F4E1] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-[#F8F4E1]">
                <tr>
                  <th className="text-left p-3 md:p-4 text-sm font-medium text-[#543310]">
                    Product
                  </th>
                  <th className="text-left p-3 md:p-4 text-sm font-medium text-[#543310]">
                    Category
                  </th>
                  <th className="text-left p-3 md:p-4 text-sm font-medium text-[#543310]">
                    Price
                  </th>
                  <th className="text-left p-3 md:p-4 text-sm font-medium text-[#543310]">
                    Status
                  </th>
                  <th className="text-left p-3 md:p-4 text-sm font-medium text-[#543310]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F4E1]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F8F4E1]/30">
                    <td className="p-3 md:p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              console.error("Image failed to load for product:", product.id, product.image);
                              e.target.src = "/images/placeholder.jpg";
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-[#543310] block truncate">
                            {product.name}
                          </span>
                          <p className="text-xs text-[#74512D] truncate">
                            {product.description
                              ? product.description.substring(0, 50) + "..."
                              : "No description"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            ID: {product.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 md:p-4">
                      <span className="text-[#74512D] text-sm">
                        {product.category || "Brownies"}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 font-medium text-[#543310]">
                      {product.price}
                    </td>
                    <td className="p-3 md:p-4">
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                          product.tag === "Best Seller"
                            ? "bg-emerald-50 text-emerald-700"
                            : product.tag === "New"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {product.tag || "New"}
                      </span>
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-1.5 md:p-2 hover:bg-[#F8F4E1] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit"
                          disabled={isSubmitting}
                        >
                          <Edit className="w-4 h-4 text-[#74512D]" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 md:p-2 hover:bg-[#F8F4E1] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 md:py-12 bg-white rounded-lg border border-[#F8F4E1]">
            <Package className="w-12 h-12 text-[#AF8F6F] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[#543310] mb-2">
              No Products Found
            </h4>
            <p className="text-[#74512D] mb-4">
              {searchTerm
                ? "No products match your search criteria"
                : "No products available"}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setShowAddModal(true);
              }}
              className="bg-[#543310] text-white px-6 py-2.5 rounded-lg hover:bg-[#74512D] transition-colors inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              disabled={isSubmitting}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Your First Product</span>
            </button>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <ProductModal
            key="add-modal"
            isEdit={false}
            onSubmit={handleAddProduct}
            onClose={() => {
              setShowAddModal(false);
              resetForm();
            }}
            initialData={formData}
          />
        )}

        {/* Edit Product Modal */}
        {showEditModal && (
          <ProductModal
            key="edit-modal"
            isEdit={true}
            onSubmit={handleUpdateProduct}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProduct(null);
              resetForm();
            }}
            initialData={formData}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;