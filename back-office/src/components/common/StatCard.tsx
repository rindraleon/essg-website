import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number | string;
  color?: 'gray' | 'blue' | 'green' | 'amber';
  subtitle?: string;
}

const colorClasses = {
  gray: 'text-gray-900',
  blue: 'text-blue-600',
  green: 'text-green-600',
  amber: 'text-amber-500',
};

const StatsCard: React.FC<StatCardProps> = React.memo(
  ({ title, value, color = 'gray', subtitle }) => {
    return (
      <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
        <CardContent className="flex flex-col items-center py-4">
          <Typography variant="h4" className={`font-bold ${colorClasses[color]}`}>
            {value}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" className="text-gray-400 mt-1">
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }
);

StatsCard.displayName = 'StatsCard';

export default StatsCard;
