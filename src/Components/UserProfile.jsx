import React, { useState } from 'react';
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { user, updateUserProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const [profileData, setProfileData] = useState({
    fname: user?.fname || '',
    lname: user?.lname || '',
    email: user?.email || '',
    phone: user?.profile?.phone || ''
  });

  const [addressData, setAddressData] = useState({
    fullName: `${user?.fname || ''} ${user?.lname || ''}`.trim(),
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: user?.profile?.phone || '',
    addressType: 'home'
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({ 
        phone: profileData.phone 
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['fullName', 'address', 'city', 'state', 'pincode', 'phone'];
    const missingFields = requiredFields.filter(field => !addressData[field]?.trim());
    
    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields`);
      return;
    }

    if (addressData.phone.length !== 10 || !/^\d+$/.test(addressData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (addressData.pincode.length < 6) {
      toast.error('Please enter a valid PIN code');
      return;
    }

    try {
      await addAddress(addressData);
      
      // Reset form
      setAddressData({
        fullName: `${user?.fname || ''} ${user?.lname || ''}`.trim(),
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        phone: user?.profile?.phone || '',
        addressType: 'home'
      });
      setIsAddingAddress(false);
      toast.success('Address added successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address. Please try again.');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressData({
      fullName: address.fullName || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'India',
      phone: address.phone || '',
      addressType: address.addressType || 'home'
    });
    setIsAddingAddress(true);
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['fullName', 'address', 'city', 'state', 'pincode', 'phone'];
    const missingFields = requiredFields.filter(field => !addressData[field]?.trim());
    
    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields`);
      return;
    }

    if (addressData.phone.length !== 10 || !/^\d+$/.test(addressData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (addressData.pincode.length < 6) {
      toast.error('Please enter a valid PIN code');
      return;
    }

    try {
      await updateAddress(editingAddress.id, addressData);
      setEditingAddress(null);
      setAddressData({
        fullName: `${user?.fname || ''} ${user?.lname || ''}`.trim(),
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        phone: user?.profile?.phone || '',
        addressType: 'home'
      });
      setIsAddingAddress(false);
      toast.success('Address updated successfully!');
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        toast.success('Address deleted successfully!');
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      toast.success('Default address updated!');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
    }
  };

  const cancelAddressForm = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
    setAddressData({
      fullName: `${user?.fname || ''} ${user?.lname || ''}`.trim(),
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      phone: user?.profile?.phone || '',
      addressType: 'home'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#543310] mb-4">Please Login</h2>
          <p className="text-[#74512D] mb-6">You need to be logged in to view your profile.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-[#543310] text-white px-6 py-3 rounded-lg hover:bg-[#74512D] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Ensure user has profile structure
  const userProfile = user.profile || { addresses: [], phone: '' };
  const userAddresses = userProfile.addresses || [];

  return (
    <div className="min-h-screen bg-[#F8F4E1] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#543310] mb-2 playfair-heading">My Profile</h1>
          <p className="text-[#74512D] poppins-body">Manage your account and addresses</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#AF8F6F]/20 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-[#AF8F6F]/20">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'profile'
                    ? 'text-[#543310] border-b-2 border-[#543310]'
                    : 'text-[#74512D] hover:text-[#543310]'
                } poppins-body`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'addresses'
                    ? 'text-[#543310] border-b-2 border-[#543310]'
                    : 'text-[#74512D] hover:text-[#543310]'
                } poppins-body`}
              >
                My Addresses
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#543310] playfair-heading">Personal Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-[#543310] text-white px-4 py-2 rounded-lg hover:bg-[#74512D] transition-colors poppins-body"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileData.fname}
                          onChange={(e) => setProfileData({...profileData, fname: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileData.lname}
                          onChange={(e) => setProfileData({...profileData, lname: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value.replace(/\D/g, '')})}
                        className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                        placeholder="Enter your phone number"
                        maxLength="10"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="bg-[#543310] text-white px-6 py-3 rounded-lg hover:bg-[#74512D] transition-colors poppins-body"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors poppins-body"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">First Name</label>
                        <p className="text-[#74512D] poppins-body">{user.fname}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">Last Name</label>
                        <p className="text-[#74512D] poppins-body">{user.lname || 'Not set'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">Email</label>
                      <p className="text-[#74512D] poppins-body">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">Phone Number</label>
                      <p className="text-[#74512D] poppins-body">{userProfile.phone || 'Not set'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#543310] playfair-heading">Saved Addresses</h2>
                  <button
                    onClick={() => {
                      setIsAddingAddress(true);
                      setEditingAddress(null);
                      setAddressData({
                        fullName: `${user.fname} ${user.lname || ''}`.trim(),
                        address: '',
                        city: '',
                        state: '',
                        pincode: '',
                        country: 'India',
                        phone: userProfile.phone || '',
                        addressType: 'home'
                      });
                    }}
                    className="bg-[#543310] text-white px-4 py-2 rounded-lg hover:bg-[#74512D] transition-colors poppins-body"
                  >
                    Add New Address
                  </button>
                </div>

                {/* Add/Edit Address Form */}
                {(isAddingAddress || editingAddress) && (
                  <div className="bg-[#F8F4E1] rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-[#543310] mb-4 playfair-heading">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">Full Name *</label>
                          <input
                            type="text"
                            value={addressData.fullName}
                            onChange={(e) => setAddressData({...addressData, fullName: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">Address Type</label>
                          <select
                            value={addressData.addressType}
                            onChange={(e) => setAddressData({...addressData, addressType: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">Address *</label>
                        <input
                          type="text"
                          value={addressData.address}
                          onChange={(e) => setAddressData({...addressData, address: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">City *</label>
                          <input
                            type="text"
                            value={addressData.city}
                            onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">State *</label>
                          <input
                            type="text"
                            value={addressData.state}
                            onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">PIN Code *</label>
                          <input
                            type="text"
                            value={addressData.pincode}
                            onChange={(e) => setAddressData({...addressData, pincode: e.target.value.replace(/\D/g, '')})}
                            className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                            maxLength="6"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">Phone Number *</label>
                        <input
                          type="tel"
                          value={addressData.phone}
                          onChange={(e) => setAddressData({...addressData, phone: e.target.value.replace(/\D/g, '')})}
                          className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                          maxLength="10"
                          required
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="bg-[#543310] text-white px-6 py-3 rounded-lg hover:bg-[#74512D] transition-colors poppins-body"
                        >
                          {editingAddress ? 'Update Address' : 'Save Address'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelAddressForm}
                          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors poppins-body"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Addresses List */}
                <div className="space-y-4">
                  {userAddresses.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fa-solid fa-map-marker-alt text-4xl text-[#AF8F6F] mb-4"></i>
                      <p className="text-[#74512D] poppins-body">No addresses saved yet.</p>
                      <p className="text-[#74512D] text-sm poppins-body">Add your first address to make checkout faster!</p>
                    </div>
                  ) : (
                    userAddresses.map((address) => (
                      <div key={address.id} className="border border-[#AF8F6F]/30 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[#543310] poppins-body">{address.fullName}</span>
                              <span className="text-xs bg-[#AF8F6F] text-white px-2 py-1 rounded capitalize poppins-body">
                                {address.addressType}
                              </span>
                              {address.isDefault && (
                                <span className="text-xs bg-[#543310] text-white px-2 py-1 rounded poppins-body">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[#74512D] text-sm poppins-body">
                              {address.address}, {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-[#74512D] text-sm poppins-body">📞 {address.phone}</p>
                          </div>
                          <div className="flex gap-2">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="text-[#543310] hover:text-[#74512D] text-sm poppins-body"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-blue-600 hover:text-blue-800 text-sm poppins-body"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-800 text-sm poppins-body"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;