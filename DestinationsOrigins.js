import React from 'react';
const Placeholder = ({ pageName }) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-blue-600">{pageName}</h2>
    <p className="mt-2 text-gray-600">This page is under construction and will manage {pageName.toLowerCase()} for the Tank Gauge System.</p>
  </div>
);
const DestinationsOrigins = () => <Placeholder pageName="Destinations & Origins" />;
export default DestinationsOrigins;