import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  style,
  className = '',
  ...props
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'rgba(221, 170, 102, 0.2)',
        backgroundImage: 'linear-gradient(90deg, rgba(221, 170, 102, 0.2) 0%, rgba(241, 200, 136, 0.4) 50%, rgba(221, 170, 102, 0.2) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonPulse 1.5s ease-in-out infinite',
        ...style,
      }}
      className={`cocol-skeleton ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};
