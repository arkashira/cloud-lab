export interface LabMetric {
  week: string;
  totalLabs: number;
  activeLabs: number;
  avgSession: number;
  segment?: 'individual' | 'team';
}

export interface SegmentData {
  name: string;
  value: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export type ChartType = 'line' | 'bar' | 'pie';