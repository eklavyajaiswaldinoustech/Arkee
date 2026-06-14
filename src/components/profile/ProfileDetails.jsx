import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { authService } from '../../api/services/authService';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const FieldRow = ({ label, value, icon: Icon, placeholder }) => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-rose-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p
        className={`text-sm font-medium ${
          value ? 'text-gray-800' : 'text-gray-300 italic'
        }`}
      >
        {value || placeholder}
      </p>
    </div>
  </div>
);

const ProfileDetails = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      dob: user?.dob
        ? new Date(user.dob).toISOString().split('T')[0]
        : '',
      gender: user?.gender || '',
      city: user?.city || '',
      state: user?.state || '',
      pincode: user?.pincode || '',
      occupation: user?.occupation || '',
      address: user?.address || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.updateProfile(data);
      updateUser(data);
      toast.success('Profile updated successfully! ✨');
      setIsEditing(false);
      onUpdate?.();
    } catch (err) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const inputClass = (hasError) =>
    `input-field text-sm ${
      hasError ? 'border-rose-400 ring-1 ring-rose-300' : ''
    }`;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-800">
            My Profile
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage your personal information
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl transition-all border border-rose-200"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-all"
            >
              <XMarkIcon className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading || !isDirty}
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-xl transition-all disabled:opacity-60 shadow-md shadow-rose-200"
            >
              {loading ? (
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
              ) : (
                <CheckIcon className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {!isEditing ? (
          /* ── View Mode ── */
          <div className="space-y-0">
            {/* Avatar & Name Banner */}
            <div className="bg-gradient-to-br from-rose-50 to-blush-50 rounded-2xl p-5 mb-6 flex items-center gap-5 border border-rose-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-blush-500 flex items-center justify-center text-white font-bold text-xl font-serif flex-shrink-0">
                {`${user?.firstname?.charAt(0) || ''}${
                  user?.lastname?.charAt(0) || ''
                }`.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {`${user?.firstname || ''} ${user?.lastname || ''}`.trim() ||
                    'Add your name'}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {user?.email || 'Add your email'}
                </p>
                <span className="inline-block mt-1.5 text-xs bg-rose-100 text-rose-600 px-2.5 py-0.5 rounded-full font-medium">
                  Arkee Member ✨
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-0">
                  Personal Info
                </h4>
                <FieldRow
                  label="First Name"
                  value={user?.firstname}
                  icon={UserIcon}
                  placeholder="Not set"
                />
                <FieldRow
                  label="Last Name"
                  value={user?.lastname}
                  icon={UserIcon}
                  placeholder="Not set"
                />
                <FieldRow
                  label="Email Address"
                  value={user?.email}
                  icon={EnvelopeIcon}
                  placeholder="Not set"
                />
                <FieldRow
                  label="Mobile Number"
                  value={user?.mobile ? `+91 ${user.mobile}` : null}
                  icon={PhoneIcon}
                  placeholder="Not set"
                />
                <FieldRow
                  label="Date of Birth"
                  value={
                    user?.dob
                      ? new Date(user.dob).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : null
                  }
                  icon={CalendarDaysIcon}
                  placeholder="Not set"
                />
                <FieldRow
                  label="Gender"
                  value={
                    user?.gender
                      ? user.gender.charAt(0).toUpperCase() +
                        user.gender.slice(1)
                      : null
                  }
                  icon={UserIcon}
                  placeholder="Not set"
                />
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6 md:mt-0">
                  Address & Other
                </h4>
                <FieldRow
                  label="City"
                  value={user?.city}
                  icon={MapPinIcon}
                  placeholder="Not set"
                />
                <FieldRow
                  label="State"
                  value={user?.state}
                  icon={MapPinIcon}
                  placeholder="Not set"
                />
                <FieldRow
                  label="Pincode"
                  value={user?.pincode}
                  icon={MapPinIcon}
                  placeholder="Not set"
                />
                <FieldRow
                  label="Occupation"
                  value={user?.occupation}
                  icon={BriefcaseIcon}
                  placeholder="Not set"
                />
                <FieldRow
                  label="Address"
                  value={user?.address}
                  icon={MapPinIcon}
                  placeholder="Not set"
                />
              </div>
            </div>
          </div>
        ) : (
          /* ── Edit Mode ── */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs text-rose-500 font-bold">
                  1
                </span>
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    First Name
                  </label>
                  <input
                    {...register('firstname', {
                      required: 'First name is required',
                      minLength: { value: 2, message: 'Min 2 characters' },
                    })}
                    placeholder="Priya"
                    className={inputClass(errors.firstname)}
                  />
                  {errors.firstname && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Last Name
                  </label>
                  <input
                    {...register('lastname', {
                      required: 'Last name is required',
                    })}
                    placeholder="Sharma"
                    className={inputClass(errors.lastname)}
                  />
                  {errors.lastname && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email',
                      },
                    })}
                    placeholder="you@example.com"
                    className={inputClass(errors.email)}
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    {...register('mobile', {
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Invalid mobile number',
                      },
                    })}
                    placeholder="9876543210"
                    className={inputClass(errors.mobile)}
                  />
                  {errors.mobile && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    {...register('dob')}
                    max={new Date().toISOString().split('T')[0]}
                    className={inputClass(errors.dob)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Gender
                  </label>
                  <select
                    {...register('gender')}
                    className={inputClass(errors.gender)}
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs text-rose-500 font-bold">
                  2
                </span>
                Location & Other Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    City
                  </label>
                  <input
                    {...register('city')}
                    placeholder="Jaipur"
                    className={inputClass(false)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    State
                  </label>
                  <input
                    {...register('state')}
                    placeholder="Rajasthan"
                    className={inputClass(false)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Pincode
                  </label>
                  <input
                    {...register('pincode', {
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'Enter valid 6-digit pincode',
                      },
                    })}
                    placeholder="302001"
                    className={inputClass(errors.pincode)}
                    maxLength={6}
                  />
                  {errors.pincode && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Occupation
                  </label>
                  <input
                    {...register('occupation')}
                    placeholder="e.g. Designer, Student"
                    className={inputClass(false)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Full Address
                  </label>
                  <textarea
                    {...register('address')}
                    placeholder="House/Flat no, Street, Area"
                    rows={3}
                    className={`${inputClass(false)} resize-none`}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;