// src/components/InProgress.js
const InProgress = ({ feature }) => {
  return (
    <div className='flex items-center justify-center h-64'>
      <div className='text-center'>
        <h2 className='text-2xl font-semibold text-gray-700'>{feature}</h2>
        <p className='text-gray-500'>This feature is currently in progress.</p>
      </div>
    </div>
  );
};

export default InProgress;
