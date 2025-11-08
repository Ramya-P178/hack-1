export type CaseStudy = {
  id: string;
  title: string;
  summary: string;
  url?: string;
  logo?: string; // public path to logo image (optional)
};

const caseStudies: Record<string, CaseStudy[]> = {
  "AI & Machine Learning": [
    {
      id: 'ai-1',
      title: 'Predictive Maintenance for Manufacturing',
      summary: 'Reduced downtime by 35% using time-series forecasting and anomaly detection models.',
      url: 'https://example.com/case-studies/ai-predictive-maintenance',
      logo: '/assets/logos/manufacturing.png',
    },
    {
      id: 'ai-2',
      title: 'Customer Churn Prediction',
      summary: 'Improved retention by 12% through targeted ML-driven campaigns.',
      url: 'https://example.com/case-studies/churn-prediction',
      logo: '/assets/logos/retail.png',
    },
  ],
  'Web Development': [
    {
      id: 'web-1',
      title: 'Headless E‑commerce Platform',
      summary: 'Built a headless storefront with 60% faster page loads and improved conversion.',
      url: 'https://example.com/case-studies/headless-ecommerce',
      logo: '/assets/logos/ecommerce.png',
    },
  ],
  'Cloud Solutions': [
    {
      id: 'cloud-1',
      title: 'Cloud Migration for Fintech',
      summary: 'Migrated legacy systems to cloud-native architecture reducing infra costs by 28%.',
      url: 'https://example.com/case-studies/cloud-migration',
      logo: '/assets/logos/cloud.png',
    },
  ],
  'Mobile Applications': [
    {
      id: 'mobile-1',
      title: 'Cross-platform Mobile App for Logistics',
      summary: 'Delivered React Native app, improving delivery tracking and driver routing.',
      url: 'https://example.com/case-studies/logistics-app',
      logo: '/assets/logos/logistics.png',
    },
  ],
  'Cloud Infrastructure': [
    {
      id: 'infra-1',
      title: 'Infrastructure as Code for SaaS',
      summary: 'Implemented Terraform IaC and CI/CD reducing deploy time from hours to minutes.',
      url: 'https://example.com/case-studies/iac-saas',
      logo: '/assets/logos/terraform.png',
    },
  ],
  'Digital Transformation': [
    {
      id: 'dt-1',
      title: 'Legacy Modernization for Healthcare',
      summary: 'Modernized monolith into microservices enabling faster feature delivery.',
      url: 'https://example.com/case-studies/legacy-modernization',
      logo: '/assets/logos/healthcare.png',
    },
  ],
  'Digital Web Development': [
    {
      id: 'dw-1',
      title: 'PWA for News Platform',
      summary: 'Built a PWA with offline reading and push notifications increasing engagement.',
      url: 'https://example.com/case-studies/pwa-news',
      logo: '/assets/logos/news.png',
    },
  ],
};

export default caseStudies;
