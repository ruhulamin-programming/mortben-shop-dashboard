const CustomLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-20">
      <div className="spinner ease-linear rounded-full border-4 border-t-4 border-[#63B883] border-t-transparent w-10 h-10 animate-spin"></div>
      <p className="mt-2 text-lg text-[#63B883] font-semibold animate-pulse">
        {message}
      </p>
      <style jsx>{`
        .spinner {
          border-top-color: transparent;
          border-right-color: #63b883;
          border-bottom-color: #63b883;
          border-left-color: #63b883;
        }
      `}</style>
    </div>
  );
};

export default CustomLoader;
