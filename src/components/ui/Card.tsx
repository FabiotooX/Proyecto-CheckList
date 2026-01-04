import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
    return (
        <div className={`
      bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden
      ${hover ? 'transition-all duration-300 hover:shadow-md hover:-translate-y-1' : ''}
      ${className}
    `}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`px-6 py-4 border-b border-slate-100 ${className}`}>
        {children}
    </div>
);

export const CardTitle = ({ children }: { children: ReactNode }) => (
    <h3 className="text-lg font-semibold text-slate-800">{children}</h3>
);

export const CardContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);
