// src/Loader.js

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center  text-white">
      <div className="spinner border-t-4 border-purple-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
      <h2 className="mt-4 text-2xl text-purple-500">Classify</h2>
    </div>
  );
};

export default Loader;
