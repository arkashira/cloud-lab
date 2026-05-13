import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TemplateCatalog from '../components/TemplateCatalog';

// Mock data: 12 templates with varying components
const mockTemplates = [
  {
    id: 't1',
    name: 'Basic VPC',
    description: 'A minimal VPC setup',
    previewImage: '/images/vpc.png',
    components: ['VPC'],
  },
  {
    id: 't2',
    name: 'EKS Cluster',
    description: 'EKS cluster with autoscaling',
    previewImage: '/images/eks.png',
    components: ['EKS'],
  },
  {
    id: 't3',
    name: 'VPC + EKS',
    description: 'Combined VPC and EKS',
    previewImage: '/images/vpc-eks.png',
    components: ['VPC', 'EKS'],
  },
  {
    id: 't4',
    name: 'S3 Bucket',
    description: 'Simple S3 bucket',
    previewImage: '/images/s3.png',
    components: ['S3'],
  },
  {
    id: 't5',
    name: 'Lambda Function',
    description: 'Serverless Lambda',
    previewImage: '/images/lambda.png',
    components: ['Lambda'],
  },
  {
    id: 't6',
    name: 'RDS Instance',
    description: 'Managed RDS',
    previewImage: '/images/rds.png',
    components: ['RDS'],
  },
  {
    id: 't7',
    name: 'CloudFront Distribution',
    description: 'CDN via CloudFront',
    previewImage: '/images/cloudfront.png',
    components: ['CloudFront'],
  },
  {
    id: 't8',
    name: 'IAM Roles',
    description: 'IAM role definitions',
    previewImage: '/images/iam.png',
    components: ['IAM'],
  },
  {
    id: 't9',
    name: 'VPC + S3',
    description: 'VPC with S3 access',
    previewImage: '/images/vpc-s3.png',
    components: ['VPC', 'S3'],
  },
  {
    id: 't10',
    name: 'EKS + Lambda',
    description: 'EKS cluster with Lambda functions',
    previewImage: '/images/eks-lambda.png',
    components: ['EKS', 'Lambda'],
  },
  {
    id: 't11',
    name: 'VPC + EKS + RDS',
    description: 'Full stack with VPC, EKS, and RDS',
    previewImage: '/images/full-stack.png',
    components: ['VPC', 'EKS', 'RDS'],
  },
  {
    id: 't12',
    name: 'Custom Template',
    description: 'User defined template',
    previewImage: '/images/custom.png',
    components: ['Custom'],
  },
];

describe('TemplateCatalog filtering', () => {
  beforeEach(() => {
    render(<TemplateCatalog templates={mockTemplates} />);
  });

  test('renders all templates initially', () => {
    const cards = screen.getAllByTestId('template-card');
    expect(cards).toHaveLength(mockTemplates.length);
  });

  test('search filters templates by name or description', () => {
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'VPC' } });

    const filteredCards = screen.getAllByTestId('template-card');
    // Templates containing 'VPC' in name or description: t1, t3, t9, t11
    expect(filteredCards).toHaveLength(4);
    const names = filteredCards.map(card => card.querySelector('.template-name').textContent);
    expect(names).toEqual(
      expect.arrayContaining(['Basic VPC', 'VPC + EKS', 'VPC + S3', 'VPC + EKS + RDS'])
    );
  });

  test('component filter shows only templates with selected component', () => {
    const componentSelect = screen.getByRole('combobox', { name: /component/i });
    fireEvent.change(componentSelect, { target: { value: 'EKS' } });

    const filteredCards = screen.getAllByTestId('template-card');
    // Templates containing 'EKS': t2, t3, t10, t11
    expect(filteredCards).toHaveLength(4);
    const names = filteredCards.map(card => card.querySelector('.template-name').textContent);
    expect(names).toEqual(
      expect.arrayContaining(['EKS Cluster', 'VPC + EKS', 'EKS + Lambda', 'VPC + EKS + RDS'])
    );
  });

  test('search and component filter combined', () => {
    const searchInput = screen.getByPlaceholderText(/search/i);
    const componentSelect = screen.getByRole('combobox', { name: /component/i });

    fireEvent.change(searchInput, { target: { value: 'VPC' } });
    fireEvent.change(componentSelect, { target: { value: 'S3' } });

    const filteredCards = screen.getAllByTestId('template-card');
    // Only t9 matches both VPC and S3
    expect(filteredCards).toHaveLength(1);
    expect(filteredCards[0].querySelector('.template-name').textContent).toBe('VPC + S3');
  });
});