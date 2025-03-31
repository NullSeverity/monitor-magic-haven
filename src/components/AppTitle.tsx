
import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';

interface AppTitleProps {
  className?: string;
}

const AppTitle: React.FC<AppTitleProps> = ({ className }) => {
  const { settings } = useTheme();
  
  return (
    <h1 className={className}>
      {settings.appTitle}
    </h1>
  );
};

export default AppTitle;
