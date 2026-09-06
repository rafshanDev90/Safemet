import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`w-full max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
