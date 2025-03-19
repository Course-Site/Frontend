import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", className = "", children, ...props }) => {
  const baseStyles =
    "rounded-3xl border-2 font-medium focus:ring transition cursor-pointer";
  
  const variantStyles = {
    primary: "bg-amber-50 text-black border-amber-950 hover:bg-amber-100 active:bg-amber-200 focus:ring-amber-900",
    outline: "bg-transparent text-black border-black hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-900",
    secondary: "bg-amber-500 text-white py-3 hover:bg-amber-600 active:bg-gray-600 focus:ring-gray-500",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
