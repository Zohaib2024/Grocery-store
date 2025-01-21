import React, { ReactNode } from "react";

// Define types for the props
interface WrapperProps {
  children: ReactNode; // children can be any valid React node (e.g., JSX, string, number, etc.)
  className?: string; // className is optional, so it has a default value of undefined
}

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div
      className={`w-full max-w-[1280px] px-5 md:px-10 mx-auto ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

export default Wrapper;
