const Heading = ({ text1, text2 , className,  children}: { text1: string; text2?: string, className?: string, children?: React.ReactNode }) => {
  return (
     <div className={`${className ? className : 'text-center'} text-2xl`}>
        <div className="inline-flex gap-2 uppercase  items-center mb-3">
        <p className="text-gray-500">
            {text1} <span className="text-gray-700 font-medium">{text2}</span>
        </p>
        <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700 "></p>
        </div>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            {children}
        </p>
   </div>
  );
};
export default Heading;
