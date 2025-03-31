import React from 'react';

export function Alert({ children, className = '' }) {
  return <div className={`rounded-lg border p-4 ${className}`}>{children}</div>;
}

export function AlertTitle({ children, className = '' }) {
  return <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>{children}</h5>;
}

export function AlertDescription({ children, className = '' }) {
  return <div className={`text-sm ${className}`}>{children}</div>;
}