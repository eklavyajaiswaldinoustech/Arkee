import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mb-6">
      {icon || (
        <svg
          className="w-12 h-12 text-rose-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
    </div>
    <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
      {title}
    </h3>
    <p className="text-gray-500 text-sm max-w-xs mb-6">{description}</p>
    {(actionLabel && actionPath) && (
      <Link to={actionPath} className="btn-primary">
        {actionLabel}
      </Link>
    )}
    {(actionLabel && onAction) && (
      <button onClick={onAction} className="btn-primary">
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;