import React from 'react';

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-10'
  };

  return (
    <div className="flex items-center">
      <img 
        src="/phoenix-logo.svg" 
        alt="Phoenix Wallet Logo"
        className={`${sizes[size]} w-auto`}
      />
      <span className={`ml-3 font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent ${
        size === 'sm' ? 'text-lg' :
        size === 'md' ? 'text-xl' : 'text-2xl'
      }`}>
        Phoenix
      </span>
    </div>
  );
};

export default Logo;
