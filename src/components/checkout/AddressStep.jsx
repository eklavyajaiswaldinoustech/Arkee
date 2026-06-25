// src/components/checkout/AddressStep.jsx
import React, { useState } from 'react';
import {
  PlusIcon,
  MapPinIcon,
  PencilSquareIcon,
  TrashIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import AddressModal from './AddressModal';

const TYPE_ICONS = {
  home: HomeIcon,
  office: BuildingOfficeIcon,
  other: BuildingStorefrontIcon,
};

const TYPE_COLORS = {
  home: 'bg-blue-50 text-blue-600 border-blue-200',
  office: 'bg-purple-50 text-purple-600 border-purple-200',
  other: 'bg-amber-50 text-amber-600 border-amber-200',
};

const AddressStep = ({
  savedAddresses,
  selectedAddress,
  onSelectAddress,
  onSaveAddress,
  onDeleteAddress,
  onSetDefault,
  onEditAddress,
  userData,
  onNext,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleEdit = (address) => {
    setEditData(address);
    setShowModal(true);
  };

  const handleSave = (formData) => {
    if (editData) {
      onEditAddress(editData.id, formData);
    } else {
      onSaveAddress(formData);
    }
    setEditData(null);
  };

  const handleDelete = (id) => {
    onDeleteAddress(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-800">
            Delivery Address
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose where to deliver your order
          </p>
        </div>
        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all text-sm font-medium border border-rose-100"
        >
          <PlusIcon className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* Saved Addresses Grid */}
      {savedAddresses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedAddresses.map((address) => {
            const isSelected = selectedAddress?.id === address.id;
            const TypeIcon = TYPE_ICONS[address.type] || MapPinIcon;
            const typeColor =
              TYPE_COLORS[address.type] || TYPE_COLORS.other;

            return (
              <div
                key={address.id}
                onClick={() => onSelectAddress(address)}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/50 shadow-lg shadow-rose-100 ring-2 ring-rose-200'
                    : 'border-gray-200 hover:border-rose-200 hover:shadow-md bg-white'
                }`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center shadow-lg animate-bounce-once">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Default badge */}
                {address.isDefault && (
                  <div className="absolute top-3 right-3">
                    <StarSolidIcon className="w-5 h-5 text-amber-400" />
                  </div>
                )}

                {/* Type badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${typeColor}`}
                  >
                    <TypeIcon className="w-3.5 h-3.5" />
                    {address.type === 'other'
                      ? address.label || 'Other'
                      : address.type.charAt(0).toUpperCase() +
                        address.type.slice(1)}
                  </span>
                </div>

                {/* Address details */}
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  {address.fullName}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {address.addressLine1}
                  {address.addressLine2 && `, ${address.addressLine2}`}
                  {address.landmark && ` (Near ${address.landmark})`}
                </p>
                <p className="text-sm text-gray-500">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  📞 +91 {address.phone}
                </p>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(address);
                    }}
                    className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium"
                  >
                    <PencilSquareIcon className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetDefault(address.id);
                      }}
                      className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-600 font-medium"
                    >
                      <StarIcon className="w-3.5 h-3.5" />
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(address.id);
                    }}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 font-medium ml-auto"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>

                {/* Delete confirmation */}
                {deleteConfirm === address.id && (
                  <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200 animate-fade-in">
                    <p className="text-xs text-red-600 mb-2">
                      Delete this address?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(address.id);
                        }}
                        className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(null);
                        }}
                        className="px-3 py-1.5 text-xs bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 font-semibold mb-1">
            No saved addresses
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Add your first delivery address to continue
          </p>
          <button
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
          >
            <PlusIcon className="w-4 h-4" />
            Add Address
          </button>
        </div>
      )}

      {/* Continue Button */}
      {selectedAddress && (
        <div className="animate-fade-in">
          <button
            onClick={onNext}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-base hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
          >
            Deliver to this address
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Address Modal */}
      <AddressModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditData(null);
        }}
        onSave={handleSave}
        editData={editData}
        userData={userData}
      />
    </div>
  );
};

export default AddressStep;