import React from 'react';
import { Card, CardContent, Typography, Box } from '@material-ui/core';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  gradient?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}) => {
  return (
    <Card 
      sx={{ 
        background: gradient,
        color: 'white',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;