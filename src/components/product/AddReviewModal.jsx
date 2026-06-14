// src/components/product/AddReviewModal.jsx
import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { reviewService } from '../../api/services/reviewService';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

const AddReviewModal = ({ isOpen, onClose, productId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!rating) errs.rating = 'Please select a rating';
    if (!comment.trim()) errs.comment = 'Review comment is required';
    if (comment.trim().length < 10)
      errs.comment = 'Comment must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('rating', rating);
      formData.append('title', title);
      formData.append('comment', comment);
      images.forEach((img) => formData.append('images', img));

      await reviewService.addReview(formData);
      toast.success('Review submitted successfully! 🌟');
      onSuccess?.();

      // Reset
      setRating(0);
      setTitle('');
      setComment('');
      setImages([]);
      setPreviews([]);
      setErrors({});
    } catch (err) {
      toast.error(err?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Write a Review"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Rating <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <StarSolid
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-gold-400'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoverRating || rating) > 0 && (
              <span className="text-sm font-medium text-gray-600 ml-2">
                {ratingLabels[hoverRating || rating]}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-rose-500 text-xs mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience in one line"
            className="input-field"
            maxLength={100}
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Review <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product — quality, fit, delivery, etc."
            className="input-field resize-none"
            rows={4}
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            {errors.comment ? (
              <p className="text-rose-500 text-xs">{errors.comment}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">
              {comment.length}/500
            </span>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos{' '}
            <span className="text-gray-400 font-normal">(optional, max 4)</span>
          </label>

          <div className="flex flex-wrap gap-3">
            {/* Preview thumbnails */}
            {previews.map((preview, i) => (
              <div key={i} className="relative w-20 h-20">
                <img
                  src={preview}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover rounded-xl border-2 border-rose-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {images.length < 4 && (
              <label className="w-20 h-20 border-2 border-dashed border-rose-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition-all">
                <PhotoIcon className="w-5 h-5 text-rose-300" />
                <span className="text-xs text-rose-300 mt-1">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-secondary justify-center py-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary justify-center py-3 disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddReviewModal;