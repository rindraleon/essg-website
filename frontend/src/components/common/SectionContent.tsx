import React from 'react';

interface SectionContentProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  headerContent?: React.ReactNode;
  loadingSkeletons?: React.ReactNode;
  sectionClassName?: string;
  containerClassName?: string;
  fluid?: boolean;
}

const SectionContent: React.FC<SectionContentProps> = ({
  children,
  loading = false,
  error = null,
  isEmpty = false,
  emptyMessage = 'Aucune donnée disponible.',
  errorMessage = 'Une erreur est survenue.',
  headerContent,
  loadingSkeletons,
  sectionClassName = '',
  containerClassName = '',
  fluid = false,
}) => {
  const wrapperClass = fluid
    ? 'w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12'
    : 'container mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <section className={sectionClassName}>
      <div className={`${wrapperClass} ${containerClassName}`}>
        {headerContent}

        {loading ? (
          loadingSkeletons
        ) : error ? (
          <div className="py-10 text-center text-red-600">{errorMessage}</div>
        ) : isEmpty ? (
          <div className="py-10 text-center text-gray-500">{emptyMessage}</div>
        ) : (
          children
        )}
      </div>
    </section>
  );
};

export default SectionContent;
