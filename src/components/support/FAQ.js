import React from 'react';

const azureServices = [
  'Azure Storage',
  'Azure Cosmos DB',
  'Azure Active Directory',
  'Azure Functions',
  'Azure Databricks',
  'Azure Synapse Analytics',
  'Azure Machine Learning',
  'Azure DevOps',
  'Azure Monitor',
  'Azure Security Center',
];

const azureServiceQuestions = azureServices.map((service) => (
  <div key={service}>
    <h2>{service}</h2>
    <p>What is {service}?</p>
    <p>How do I use {service} in cloud-lab?</p>
    <p>What are the benefits of using {service}?</p>
  </div>
));

const FAQ = () => {
  return (
    <div>
      <h1>FAQ</h1>
      <ul>
        {azureServiceQuestions}
      </ul>
    </div>
  );
};

export default FAQ;