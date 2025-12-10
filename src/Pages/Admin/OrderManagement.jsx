// import React, { useState, useEffect } from "react";
// import AdminLayout from "../../Components/Admin/AdminLayout";
// import {
//   Package,
//   Eye,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Truck,
//   RefreshCw,
//   Search,
//   X,
// } from "lucide-react";
// import { getOrders, updateOrderStatus } from "../../services/adminService";

// const OrderManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     let result = orders;

//     // Apply status filter
//     if (filter !== "all") {
//       result = result.filter((order) => order.status === filter);
//     }

//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(
//         (order) =>
//           order.id?.toLowerCase().includes(term) ||
//           order.userName?.toLowerCase().includes(term) ||
//           order.userEmail?.toLowerCase().includes(term) ||
//           order.shippingAddress?.city?.toLowerCase().includes(term)
//       );
//     }

//     setFilteredOrders(result);
//   }, [orders, filter, searchTerm]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const data = await getOrders();
//       // Sort by date (newest first)
//       const sortedOrders = data.sort(
//         (a, b) => new Date(b.date) - new Date(a.date)
//       );
//       setOrders(sortedOrders);
//       setFilteredOrders(sortedOrders);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       // Find the order to get userId
//       const order = orders.find((o) => o.id === orderId);
//       if (!order || !order.userId) {
//         console.error("Order or userId not found");
//         alert("Cannot update order: User ID not found");
//         return;
//       }

//       await updateOrderStatus(order.userId, orderId, newStatus);
//       await fetchOrders(); // Refresh orders

//       // Update selected order if it's the one being updated
//       if (selectedOrder && selectedOrder.id === orderId) {
//         setSelectedOrder({ ...selectedOrder, status: newStatus });
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       alert("Failed to update order status. Please try again.");
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "confirmed":
//         return <CheckCircle className="w-4 h-4 text-emerald-500" />;
//       case "preparing":
//         return <Clock className="w-4 h-4 text-blue-500" />;
//       case "shipped":
//         return <Truck className="w-4 h-4 text-purple-500" />;
//       case "delivered":
//         return <Package className="w-4 h-4 text-green-500" />;
//       case "cancelled":
//         return <XCircle className="w-4 h-4 text-red-500" />;
//       default:
//         return <Clock className="w-4 h-4 text-amber-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-emerald-50 text-emerald-700 border border-emerald-200";
//       case "preparing":
//         return "bg-blue-50 text-blue-700 border border-blue-200";
//       case "shipped":
//         return "bg-purple-50 text-purple-700 border border-purple-200";
//       case "delivered":
//         return "bg-green-50 text-green-700 border border-green-200";
//       case "cancelled":
//         return "bg-red-50 text-red-700 border border-red-200";
//       default:
//         return "bg-gray-50 text-gray-700 border border-gray-200";
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const statusOptions = [
//     { value: "all", label: "All Orders", color: "bg-gray-100" },
//     { value: "confirmed", label: "Confirmed", color: "bg-emerald-100" },
//     { value: "preparing", label: "Preparing", color: "bg-blue-100" },
//     { value: "shipped", label: "Shipped", color: "bg-purple-100" },
//     { value: "delivered", label: "Delivered", color: "bg-green-100" },
//     { value: "cancelled", label: "Cancelled", color: "bg-red-100" },
//   ];

//   if (loading) {
//     return (
//       <AdminLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF8F6F]"></div>
//         </div>
//       </AdminLayout>
//     );
//   }

//   const OrderDetailsModal = () => (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h3 className="text-xl font-bold text-[#543310]">
//                 Order Details
//               </h3>
//               <p className="text-[#74512D]">#{selectedOrder.id}</p>
//             </div>
//             <button
//               onClick={() => setSelectedOrder(null)}
//               className="text-[#74512D] hover:text-[#543310]"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="space-y-6">
//             {/* Order Summary */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h4 className="text-lg font-semibold text-[#543310] mb-3">
//                   Order Information
//                 </h4>
//                 <div className="space-y-2">
//                   <div>
//                     <p className="text-sm text-[#74512D]">Order Date</p>
//                     <p className="font-medium text-[#543310]">
//                       {formatDate(selectedOrder.date)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-[#74512D]">Order ID</p>
//                     <p className="font-medium text-[#543310]">
//                       {selectedOrder.id}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-[#74512D]">Total Amount</p>
//                     <p className="font-bold text-[#543310] text-lg">
//                       ₹{selectedOrder.total?.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h4 className="text-lg font-semibold text-[#543310] mb-3">
//                   Customer Information
//                 </h4>
//                 <div className="space-y-2">
//                   <div>
//                     <p className="text-sm text-[#74512D]">Customer Name</p>
//                     <p className="font-medium text-[#543310]">
//                       {selectedOrder.userName}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-[#74512D]">Email</p>
//                     <p className="font-medium text-[#543310]">
//                       {selectedOrder.userEmail}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-[#74512D]">Payment Method</p>
//                     <p className="font-medium text-[#543310] capitalize">
//                       {selectedOrder.paymentMethod || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             {selectedOrder.shippingAddress && (
//               <div>
//                 <h4 className="text-lg font-semibold text-[#543310] mb-3">
//                   Shipping Address
//                 </h4>
//                 <div className="p-4 bg-[#F8F4E1]/50 rounded-lg">
//                   <p className="font-medium text-[#543310]">
//                     {selectedOrder.shippingAddress.fullName}
//                   </p>
//                   <p className="text-[#74512D]">
//                     {selectedOrder.shippingAddress.address}
//                   </p>
//                   <p className="text-[#74512D]">
//                     {selectedOrder.shippingAddress.city},{" "}
//                     {selectedOrder.shippingAddress.state} -{" "}
//                     {selectedOrder.shippingAddress.pincode}
//                   </p>
//                   <p className="text-[#74512D]">
//                     Phone: {selectedOrder.shippingAddress.phone}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Order Items */}
//             <div>
//               <h4 className="text-lg font-semibold text-[#543310] mb-3">
//                 Order Items
//               </h4>
//               <div className="space-y-3">
//                 {selectedOrder.items?.map((item, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-3 bg-[#F8F4E1]/30 rounded-lg"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-16 h-16 object-cover rounded-lg"
//                       />
//                       <div>
//                         <p className="font-medium text-[#543310]">
//                           {item.name}
//                         </p>
//                         <p className="text-sm text-[#74512D]">
//                           Quantity: {item.quantity}
//                         </p>
//                         <p className="text-sm text-[#74512D]">
//                           Price: {item.price}
//                         </p>
//                       </div>
//                     </div>
//                     <p className="font-medium text-[#543310]">
//                       ₹
//                       {(
//                         parseInt(item.price.replace("₹", "")) * item.quantity
//                       ).toLocaleString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Status Update */}
//             <div>
//               <h4 className="text-lg font-semibold text-[#543310] mb-3">
//                 Update Status
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {statusOptions.slice(1).map((option) => (
//                   <button
//                     key={option.value}
//                     onClick={() =>
//                       handleStatusUpdate(selectedOrder.id, option.value)
//                     }
//                     className={`px-4 py-2 rounded-lg transition-colors ${
//                       selectedOrder.status === option.value
//                         ? `${option.color} text-[#543310] border border-[#543310]/20`
//                         : "bg-white border border-[#F8F4E1] hover:bg-[#F8F4E1] text-[#74512D]"
//                     }`}
//                   >
//                     {option.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-2xl font-bold text-[#543310]">
//             Order Management
//           </h1>
//           <p className="text-[#74512D] mt-1">View and manage customer orders</p>
//         </div>

//         {/* Filters and Search */}
//         <div className="space-y-4">
//           <div className="flex flex-wrap gap-3 items-center justify-between">
//             <div className="flex flex-wrap gap-2">
//               {statusOptions.map((status) => (
//                 <button
//                   key={status.value}
//                   onClick={() => setFilter(status.value)}
//                   className={`px-4 py-2 rounded-lg transition-colors ${
//                     filter === status.value
//                       ? `${status.color} text-[#543310] border border-[#543310]/20`
//                       : "bg-white border border-[#F8F4E1] hover:bg-[#F8F4E1] text-[#74512D]"
//                   }`}
//                 >
//                   {status.label}{" "}
//                   {status.value !== "all" &&
//                     `(${
//                       orders.filter((o) => o.status === status.value).length
//                     })`}
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={fetchOrders}
//               className="flex items-center space-x-2 px-4 py-2 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg transition-colors"
//             >
//               <RefreshCw className="w-4 h-4" />
//               <span>Refresh</span>
//             </button>
//           </div>

//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#74512D]" />
//             <input
//               type="text"
//               placeholder="Search orders by ID, customer name, email, or city..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30"
//             />
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div className="bg-white rounded-lg border border-[#F8F4E1] overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-[#F8F4E1]">
//                 <tr>
//                   <th className="text-left p-4 text-sm font-medium text-[#543310]">
//                     Order ID
//                   </th>
//                   <th className="text-left p-4 text-sm font-medium text-[#543310]">
//                     Customer
//                   </th>
//                   <th className="text-left p-4 text-sm font-medium text-[#543310]">
//                     Date
//                   </th>
//                   <th className="text-left p-4 text-sm font-medium text-[#543310]">
//                     Items
//                   </th>
//                   <th className="text-left p-4 text-sm font-medium text-[#543310]">
//                     Total
//                   </th>
//                   <th className="text-left p-4 text-sm font-medium text-[#543310]">
//                     Status
//                   </th>
//                   <th className="text-left p-4 text-sm font-medium text-[#543310]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F8F4E1]">
//                 {filteredOrders.map((order) => (
//                   <tr key={order.id} className="hover:bg-[#F8F4E1]/30">
//                     <td className="p-4 font-medium text-[#543310]">
//                       #{order.id?.slice(-8)}
//                     </td>
//                     <td className="p-4">
//                       <div>
//                         <p className="text-[#543310] font-medium">
//                           {order.userName || "N/A"}
//                         </p>
//                         <p className="text-sm text-[#74512D]">
//                           {order.userEmail || "N/A"}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="p-4 text-[#74512D]">
//                       {formatDate(order.date)}
//                     </td>
//                     <td className="p-4 text-[#74512D]">
//                       {order.items?.length || 0} items
//                     </td>
//                     <td className="p-4 font-medium text-[#543310]">
//                       ₹{order.total?.toLocaleString() || "0"}
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center space-x-2">
//                         {getStatusIcon(order.status)}
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                             order.status
//                           )}`}
//                         >
//                           {order.status?.charAt(0).toUpperCase() +
//                             order.status?.slice(1) || "Pending"}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => setSelectedOrder(order)}
//                           className="p-2 hover:bg-[#F8F4E1] rounded transition-colors"
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4 text-[#74512D]" />
//                         </button>
//                         <select
//                           value={order.status || "pending"}
//                           onChange={(e) =>
//                             handleStatusUpdate(order.id, e.target.value)
//                           }
//                           className="text-sm border border-[#AF8F6F]/50 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#AF8F6F]"
//                         >
//                           {statusOptions.slice(1).map((option) => (
//                             <option key={option.value} value={option.value}>
//                               {option.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {filteredOrders.length === 0 && (
//           <div className="text-center py-12 bg-white rounded-lg border border-[#F8F4E1]">
//             <Package className="w-12 h-12 text-[#AF8F6F] mx-auto mb-4" />
//             <h4 className="text-lg font-semibold text-[#543310] mb-2">
//               No Orders Found
//             </h4>
//             <p className="text-[#74512D]">
//               {searchTerm || filter !== "all"
//                 ? "No orders match your search criteria"
//                 : "No orders have been placed yet"}
//             </p>
//           </div>
//         )}

//         {/* Order Details Modal */}
//         {selectedOrder && <OrderDetailsModal />}
//       </div>
//     </AdminLayout>
//   );
// };

// export default OrderManagement;

import React, { useState, useEffect } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import {
  Package,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  RefreshCw,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getOrders, updateOrderStatus } from "../../services/adminService";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    // Apply status filter
    if (filter !== "all") {
      result = result.filter((order) => order.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.id?.toLowerCase().includes(term) ||
          order.userName?.toLowerCase().includes(term) ||
          order.userEmail?.toLowerCase().includes(term) ||
          order.shippingAddress?.city?.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(result);
  }, [orders, filter, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      // Sort by date (newest first)
      const sortedOrders = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Find the order to get userId
      const order = orders.find((o) => o.id === orderId);
      if (!order || !order.userId) {
        console.error("Order or userId not found");
        alert("Cannot update order: User ID not found");
        return;
      }

      await updateOrderStatus(order.userId, orderId, newStatus);
      await fetchOrders(); // Refresh orders

      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "preparing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-500" />;
      case "delivered":
        return <Package className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "preparing":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "shipped":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "delivered":
        return "bg-green-50 text-green-700 border border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleCardExpand = (orderId) => {
    setExpandedCard(expandedCard === orderId ? null : orderId);
  };

  const statusOptions = [
    { value: "all", label: "All Orders", color: "bg-gray-100" },
    { value: "confirmed", label: "Confirmed", color: "bg-emerald-100" },
    { value: "preparing", label: "Preparing", color: "bg-blue-100" },
    { value: "shipped", label: "Shipped", color: "bg-purple-100" },
    { value: "delivered", label: "Delivered", color: "bg-green-100" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF8F6F]"></div>
        </div>
      </AdminLayout>
    );
  }

  const OrderDetailsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#543310]">
                Order Details
              </h3>
              <p className="text-[#74512D]">#{selectedOrder.id}</p>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-[#74512D] hover:text-[#543310]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-[#543310] mb-3">
                  Order Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-[#74512D]">Order Date</p>
                    <p className="font-medium text-[#543310]">
                      {formatDate(selectedOrder.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74512D]">Order ID</p>
                    <p className="font-medium text-[#543310]">
                      {selectedOrder.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74512D]">Total Amount</p>
                    <p className="font-bold text-[#543310] text-lg">
                      ₹{selectedOrder.total?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-[#543310] mb-3">
                  Customer Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-[#74512D]">Customer Name</p>
                    <p className="font-medium text-[#543310]">
                      {selectedOrder.userName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74512D]">Email</p>
                    <p className="font-medium text-[#543310]">
                      {selectedOrder.userEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74512D]">Payment Method</p>
                    <p className="font-medium text-[#543310] capitalize">
                      {selectedOrder.paymentMethod || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {selectedOrder.shippingAddress && (
              <div>
                <h4 className="text-lg font-semibold text-[#543310] mb-3">
                  Shipping Address
                </h4>
                <div className="p-4 bg-[#F8F4E1]/50 rounded-lg">
                  <p className="font-medium text-[#543310]">
                    {selectedOrder.shippingAddress.fullName}
                  </p>
                  <p className="text-[#74512D]">
                    {selectedOrder.shippingAddress.address}
                  </p>
                  <p className="text-[#74512D]">
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state} -{" "}
                    {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p className="text-[#74512D]">
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h4 className="text-lg font-semibold text-[#543310] mb-3">
                Order Items
              </h4>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#F8F4E1]/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-[#543310]">
                          {item.name}
                        </p>
                        <p className="text-sm text-[#74512D]">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-[#74512D]">
                          Price: {item.price}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-[#543310]">
                      ₹
                      {(
                        parseInt(item.price.replace("₹", "")) * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update */}
            <div>
              <h4 className="text-lg font-semibold text-[#543310] mb-3">
                Update Status
              </h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.slice(1).map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleStatusUpdate(selectedOrder.id, option.value)
                    }
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedOrder.status === option.value
                        ? `${option.color} text-[#543310] border border-[#543310]/20`
                        : "bg-white border border-[#F8F4E1] hover:bg-[#F8F4E1] text-[#74512D]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#543310]">
            Order Management
          </h1>
          <p className="text-[#74512D] mt-1">View and manage customer orders</p>
        </div>

        {/* Filters and Search */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFilter(status.value)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === status.value
                      ? `${status.color} text-[#543310] border border-[#543310]/20`
                      : "bg-white border border-[#F8F4E1] hover:bg-[#F8F4E1] text-[#74512D]"
                  }`}
                >
                  {status.label}{" "}
                  {status.value !== "all" &&
                    `(${
                      orders.filter((o) => o.status === status.value).length
                    })`}
                </button>
              ))}
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center space-x-2 px-4 py-2 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#74512D]" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg border border-[#F8F4E1] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F4E1]">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Order ID
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Customer
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Items
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Total
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F4E1]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F8F4E1]/30">
                    <td className="p-4 font-medium text-[#543310]">
                      #{order.id?.slice(-8)}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-[#543310] font-medium">
                          {order.userName || "N/A"}
                        </p>
                        <p className="text-sm text-[#74512D]">
                          {order.userEmail || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-[#74512D]">
                      {formatDate(order.date)}
                    </td>
                    <td className="p-4 text-[#74512D]">
                      {order.items?.length || 0} items
                    </td>
                    <td className="p-4 font-medium text-[#543310]">
                      ₹{order.total?.toLocaleString() || "0"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status?.charAt(0).toUpperCase() +
                            order.status?.slice(1) || "Pending"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-[#F8F4E1] rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-[#74512D]" />
                        </button>
                        <select
                          value={order.status || "pending"}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className="text-sm border border-[#AF8F6F]/50 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#AF8F6F]"
                        >
                          {statusOptions.slice(1).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-[#F8F4E1] overflow-hidden"
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#543310]">
                        #{order.id?.slice(-8)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status?.charAt(0).toUpperCase() +
                          order.status?.slice(1) || "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-[#74512D] mt-1">
                      {formatDate(order.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCardExpand(order.id)}
                    className="p-1 hover:bg-[#F8F4E1] rounded"
                  >
                    {expandedCard === order.id ? (
                      <ChevronUp className="w-5 h-5 text-[#74512D]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#74512D]" />
                    )}
                  </button>
                </div>

                {/* Basic Info */}
                <div className="space-y-2 mb-3">
                  <div>
                    <p className="text-sm text-[#74512D]">Customer</p>
                    <p className="font-medium text-[#543310]">
                      {order.userName || "N/A"}
                    </p>
                    <p className="text-xs text-[#74512D]">
                      {order.userEmail || "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-[#74512D]">Items</p>
                      <p className="font-medium text-[#543310]">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#74512D]">Total</p>
                      <p className="font-bold text-[#543310]">
                        ₹{order.total?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F8F4E1]">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center space-x-2 px-3 py-2 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View Details</span>
                  </button>
                  <select
                    value={order.status || "pending"}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, e.target.value)
                    }
                    className="text-sm border border-[#AF8F6F]/50 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#AF8F6F]"
                  >
                    {statusOptions.slice(1).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expanded Details */}
                {expandedCard === order.id && (
                  <div className="mt-4 pt-4 border-t border-[#F8F4E1] space-y-3">
                    {order.shippingAddress && (
                      <div>
                        <p className="text-sm font-medium text-[#74512D] mb-1">
                          Shipping Address
                        </p>
                        <p className="text-sm text-[#543310]">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}
                        </p>
                        <p className="text-xs text-[#74512D]">
                          {order.shippingAddress.address}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-[#74512D] mb-1">
                        Payment Method
                      </p>
                      <p className="text-sm text-[#543310] capitalize">
                        {order.paymentMethod || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#74512D] mb-1">
                        Items Details
                      </p>
                      <p className="text-sm text-[#543310]">
                        {order.items
                          ?.map((item) => `${item.name} (x${item.quantity})`)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-[#F8F4E1]">
            <Package className="w-12 h-12 text-[#AF8F6F] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[#543310] mb-2">
              No Orders Found
            </h4>
            <p className="text-[#74512D]">
              {searchTerm || filter !== "all"
                ? "No orders match your search criteria"
                : "No orders have been placed yet"}
            </p>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && <OrderDetailsModal />}
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;
