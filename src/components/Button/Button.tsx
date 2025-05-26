import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "secondary" | "test-primary" | "test-secondary";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "rounded-3xl border-2 font-medium focus:ring transition cursor-pointer";

  const variantStyles = {
    primary: "bg-amber-500 text-black border-amber-700 hover:bg-amber-100 active:bg-amber-200 focus:ring-amber-900",
    outline: "bg-transparent text-black border-black hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-900",
    secondary: "bg-amber-500 text-white hover:bg-amber-600 active:bg-gray-600 focus:ring-gray-500",
    "test-primary": "bg-orange-500 hover:bg-amber-100 text-white px-6 py-2 rounded shadow text-lg",
    "test-secondary": "bg-amber-500 hover:bg-amber-100 text-white px-6 py-2 rounded shadow text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
