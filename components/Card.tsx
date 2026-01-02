import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 mb-4 ${className}`}>
      {title && (
        <h3 className="text-base font-semibold text-zinc-100 mb-2">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;