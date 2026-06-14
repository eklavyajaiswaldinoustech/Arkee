import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { addressService } from '../../api/services/addressService';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

const indianStates = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

const AddressForm = ({ onSubmit, defaultValues, loading, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <input
          {...register('name', { required: 'Full name is required' })}
          placeholder="Priya Sharma"
          className={`input-field text-sm ${
            errors.name ? 'border-rose-400' : ''
          }`}
        />
        {errors.name && (
          <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Mobile */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Mobile Number <span className="text-rose-500">*</span>
        </label>
        <input
          type="tel"
          {...register('mobile', {
            required: 'Mobile number is required',
            pattern: {
              value: /^[6-9]\d{9}$/,
              message: 'Enter valid 10-digit mobile',
            },
          })}
          placeholder="9876543210"
          className={`input-field text-sm ${
            errors.mobile ? 'border-rose-400' : ''
          }`}
        />
        {errors.mobile && (
          <p className="text-rose-500 text-xs mt-1">{errors.mobile.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          {...register('email', {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email',
            },
          })}
          placeholder="you@example.com"
          className="input-field text-sm"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Street Address <span className="text-rose-500">*</span>
        </label>
        <textarea
          {...register('address', {
            required: 'Address is required',
            minLength: { value: 10, message: 'Please enter complete address' },
          })}
          placeholder="House/Flat no, Street name, Area, Landmark"
          rows={3}
          className={`input-field text-sm resize-none ${
            errors.address ? 'border-rose-400' : ''
          }`}
        />
        {errors.address && (
          <p className="text-rose-500 text-xs mt-1">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* City & State */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            City <span className="text-rose-500">*</span>
          </label>
          <input
            {...register('city', { required: 'City is required' })}
            placeholder="Jaipur"
            className={`input-field text-sm ${
              errors.city ? 'border-rose-400' : ''
            }`}
          />
          {errors.city && (
            <p className="text-rose-500 text-xs mt-1">
              {errors.city.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            State <span className="text-rose-500">*</span>
          </label>
          <select
            {...register('state', { required: 'State is required' })}
            className={`input-field text-sm ${
              errors.state ? 'border-rose-400' : ''
            }`}
          >
            <option value="">Select state</option>
            {indianStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-rose-500 text-xs mt-1">
              {errors.state.message}
            </p>
          )}
        </div>
      </div>

      {/* Pincode */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Pincode <span className="text-rose-500">*</span>
        </label>
        <input
          {...register('pincode', {
            required: 'Pincode is required',
            pattern: {
              value: /^\d{6}$/,
              message: 'Enter valid 6-digit pincode',
            },
          })}
          placeholder="302001"
          maxLength={6}
          className={`input-field text-sm ${
            errors.pincode ? 'border-rose-400' : ''
          }`}
        />
        {errors.pincode && (
          <p className="text-rose-500 text-xs mt-1">
            {errors.pincode.message}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn-secondary justify-center py-3 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary justify-center py-3 text-sm disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Saving...
            </span>
          ) : defaultValues?._id ? (
            'Update Address'
          ) : (
            'Save Address'
          )}
        </button>
      </div>
    </form>
  );
};

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressService.getAddresses();
      setAddresses(res?.data?.addresses || res?.addresses || res?.data || []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data) => {
    setFormLoading(true);
    try {
      await addressService.addAddress(data);
      toast.success('Address added successfully! 📍');
      setIsModalOpen(false);
      fetchAddresses();
    } catch (err) {
      toast.error(err?.message || 'Failed to add address');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (data) => {
    setFormLoading(true);
    try {
      await addressService.editAddress(editingAddress._id, data);
      toast.success('Address updated successfully!');
      setIsModalOpen(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (err) {
      toast.error(err?.message || 'Failed to update address');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await addressService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      toast.success('Address deleted');
      setConfirmDeleteId(null);
    } catch {
      toast.error('Failed to delete address');
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-800">
            Address Book
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage your delivery addresses
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary text-sm py-2.5 px-5"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-2xl p-5 animate-pulse space-y-3"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="flex gap-2 mt-4">
                  <div className="h-8 bg-gray-200 rounded-lg flex-1" />
                  <div className="h-8 bg-gray-200 rounded-lg flex-1" />
                </div>
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No addresses saved
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
              Add your delivery address to make checkout faster and easier.
            </p>
            <button onClick={openAddModal} className="btn-primary text-sm">
              <PlusIcon className="w-4 h-4" />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address, i) => (
              <div
                key={address._id || i}
                className={`relative border-2 rounded-2xl p-5 transition-all ${
                  i === 0
                    ? 'border-rose-200 bg-rose-50/30'
                    : 'border-gray-100 hover:border-rose-100'
                }`}
              >
                {/* Default Badge */}
                {i === 0 && (
                  <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <CheckCircleIcon className="w-3 h-3" />
                    Default
                  </span>
                )}

                {/* Address Details */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="min-w-0 flex-1 pr-16">
                    <p className="font-semibold text-gray-800 text-sm">
                      {address.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {address.mobile}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 leading-relaxed ml-12 space-y-0.5">
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.state} — {address.pincode}
                  </p>
                  {address.email && (
                    <p className="text-gray-400 text-xs">{address.email}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 ml-12">
                  <button
                    onClick={() => openEditModal(address)}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-500 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all border border-blue-100"
                  >
                    <PencilSquareIcon className="w-3.5 h-3.5" />
                    Edit
                  </button>

                  {confirmDeleteId === address._id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">Sure?</span>
                      <button
                        onClick={() => handleDelete(address._id)}
                        disabled={deletingId === address._id}
                        className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-all disabled:opacity-60"
                      >
                        {deletingId === address._id ? '...' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-2 rounded-lg"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(address._id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-all border border-red-100"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add New Address Card */}
            <button
              onClick={openAddModal}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-rose-300 hover:text-rose-400 hover:bg-rose-50 transition-all min-h-[180px]"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <PlusIcon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Add New Address</span>
            </button>
          </div>
        )}
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        size="md"
      >
        <AddressForm
          defaultValues={editingAddress || {}}
          onSubmit={editingAddress ? handleEdit : handleAdd}
          loading={formLoading}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default AddressBook;