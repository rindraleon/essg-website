import React from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Chargement...' }) => {
  return (
    <div className="flex items-center justify-center p-4" role="status" aria-live="polite">
      <div className="text-center">
        <div
          aria-hidden="true"
          className="mb-4 inline-block size-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600 motion-reduce:animate-none"
        />
        <p className="text-small text-ink-500">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
