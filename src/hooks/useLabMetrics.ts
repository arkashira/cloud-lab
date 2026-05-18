import { useState, useEffect, useMemo } from 'react';
import { LabMetric, SegmentData } from '../types/metrics';

const mockData: LabMetric[] = [
  { week: '2026-05-01', totalLabs: 120, activeLabs: 85, avgSession: 45, segment: 'individual' },
  { week: '2026-05-08', totalLabs: 145, activeLabs: 92, avgSession: 48, segment: 'team' },
  { week: '2026-05-15', totalLabs: 168, activeLabs: 105, avgSession: 52, segment: 'individual' },
  { week: '2026-05-22', totalLabs: 189, activeLabs: 120, avgSession: 55, segment: 'team' },
  { week: '2026-05-29', totalLabs: 205, activeLabs: 135, avgSession: 58, segment: 'individual' },
  { week: '2026-06-05', totalLabs: 220, activeLabs: 148, avgSession: 60, segment: 'team' },
];

const segmentDistribution: SegmentData[] = [
  { name: 'Individual', value: 65 },
  { name: 'Team', value: 35 },
];

export const useLabMetrics = () => {
  const [metrics, setMetrics] = useState<LabMetric[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setMetrics(mockData);
      } catch (err) {
        setError('Failed to load metrics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (filter === 'all') return metrics;
    return metrics.filter(item => item.segment === filter);
  }, [metrics, filter]);

  const formattedData = useMemo(() => {
    return filteredData.map(item => ({
      ...item,
      date: new Date(item.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [filteredData]);

  const totals = useMemo(() => {
    return {
      totalLabs: filteredData.reduce((sum, item) => sum + item.totalLabs, 0),
      activeLabs: filteredData.reduce((sum, item) => sum + item.activeLabs, 0),
      avgSession: Math.round(filteredData.reduce((sum, item) => sum + item.avgSession, 0) / filteredData.length) || 0,
    };
  }, [filteredData]);

  return {
    metrics: formattedData,
    filteredData,
    filter,
    setFilter,
    loading,
    error,
    totals,
    segmentDistribution,
  };
};