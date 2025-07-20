import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'border' | 'success' | 'rounded' | 'logout';
  children: React.ReactNode;
  icon?: React.ReactNode;
  isMinimized?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  icon,
  isMinimized = false,
  ...props
}) => {
  const base = 'px-4 py-2 font-medium transition-colors duration-200';

  const variants = {
    primary: 'bg-primary text-black border border-primary-dark border-blue-700 hover:bg-primary-hover focus:ring-2 focus:ring-primary-ring rounded-xl cursor-pointer',
    secondary: 'bg-border text-text hover:bg-gray-200 rounded-xl cursor-pointer',
    danger: 'bg-red-500 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-300 rounded-xl cursor-pointer',
    border: 'border-2 border-primary text-primary bg-bg hover:bg-primary hover:text-bg focus:ring-2 focus:ring-primary-ring rounded-xl cursor-pointer',
    success: 'bg-success text-white hover:bg-success-hover focus:ring-2 focus:ring-success-ring rounded-xl cursor-pointer',
    rounded: 'bg-[#2D60FF] text-white px-6 py-3 rounded-full text-sm hover:bg-[#254FCF] cursor-pointer',
    logout: `flex items-center text-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-300 ease-in-out group w-full ${isMinimized ? 'px-3 py-3 justify-center' : 'px-4 py-3 space-x-4'}`,
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {icon && icon}
      {children}
    </button>
  );
};

export default Button;
