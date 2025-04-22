import React, { ReactNode } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import BackButton from '@/components/BackButton';
import { useTheme } from 'next-themes';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  lightBgColor?: string;
}

export const PageLayout = ({ children, className = '', lightBgColor = 'bg-soft-blue' }: PageLayoutProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Determine background class based on theme
  const bgClass = isDark 
    ? 'dark:bg-gradient-to-b dark:from-black dark:to-slate-900' 
    : lightBgColor;
  
  return (
    <div className={`min-h-screen px-2 py-4 flex flex-col animate-[slide-in-right_0.3s_ease] ${bgClass} ${className}`}>
      <div className="w-full flex justify-between items-center mb-6">
        <BackButton className="ml-1" />
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
};

export default PageLayout; 