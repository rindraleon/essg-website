import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactElement;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, loading = false }) => {
  const isPositive = change?.startsWith('+');

  if (loading) {
    return (
      <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <div className="animate-pulse">
          <div className="mb-2 h-4 w-1/2 rounded bg-ink-100"></div>
          <div className="mb-2 h-8 w-3/4 rounded bg-ink-100"></div>
          <div className="h-4 w-1/4 rounded bg-ink-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-sm border border-ink-100 bg-white p-5  transition-all duration-200 hover:shadow-card-hover">
      <span className="absolute inset-x-0 top-0 h-1 opacity-80" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-sm font-medium text-ink-500">{title}</p>
          <p className="mb-2 text-2xl font-bold tracking-tight text-ink-900">{value}</p>
          {change && (
            <span
              className={`inline-flex items-center gap-1 text-sm font-semibold ${
                isPositive ? 'text-brand-600' : 'text-red-600'
              }`}
            >
              <span aria-hidden="true">{isPositive ? '↗' : '↘'}</span>
              {change}
            </span>
          )}
        </div>
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-brand-20 text-brand-600 ring-1 ring-brand-100 transition-transform duration-200 group-hover:scale-105">
            {React.isValidElement(icon)
              ? React.cloneElement(icon, {
                  sx: { fontSize: 24 },
                } as React.SVGProps<SVGSVGElement>)
              : icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
