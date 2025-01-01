const Loader = (bool) => (
  <div
    className={`flex-1 h-full overflow-hidden ${
      bool ? "flex flex-col" : "hidden sm:flex flex-col"
    }`}
  >
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    </div>
  </div>
);

export default Loader;
