// components/Loader.jsx
// Loading spinner component

const Loader = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} border-brand-200 border-t-brand-600 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-gray-500 font-body">{text}</p>}
    </div>
  );
};

export default Loader;
