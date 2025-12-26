import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home";
import AllProducts from "./Components/AllProducts";
import { CartProvider } from "./Context/CartContext";
import Payment from "./Components/Payment";
import MyOrders from "./Components/MyOrders";
import UserProfile from "./Components/UserProfile";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Toast.css";
import SearchPage from "./Components/SearchPage";

//Admin sec
import AdminHome from "./Pages/Admin/AdminHome";
import ProductManagement from "./Pages/Admin/ProductManagement";
import OrderManagement from "./Pages/Admin/OrderManagement";
import UserManagement from "./Pages/Admin/UserManagement";
import CartPage from "./Components/CartPage";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/*Admin Sec */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Routes>

        {/* Sleek Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="custom-toast-container"
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
          transition={Slide}
        />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
