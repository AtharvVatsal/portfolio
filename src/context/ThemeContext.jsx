import React, { createContext, useContext, useState } from 'react';

// Theme definitions
const themes = {
  purple: {
    gradient: 'from-indigo-950 via-black to-violet-950',
    primary: 'from-purple-400 to-pink-500',
    secondary: 'from-cyan-400 to-purple-500',
    spotlight: 'rgba(168, 85, 247, 0.4)'
  },
  cyan: {
    gradient: 'from-cyan-950 via-black to-blue-950',
    primary: 'from-cyan-400 to-blue-500',
    secondary: 'from-blue-400 to-cyan-500',
    spotlight: 'rgba(34, 211, 238, 0.4)'
  },
  green: {
    gradient: 'from-emerald-950 via-black to-teal-950',
    primary: 'from-emerald-400 to-green-500',
    secondary: 'from-green-400 to-emerald-500',
    spotlight: 'rgba(52, 211, 153, 0.4)'
  }
};

// Create context
const ThemeContext = createContext(undefined);

// Theme Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('purple');

  const cycleTheme = () => {
    const themeOrder = ['purple', 'cyan', 'green'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const value = {
    theme,
    setTheme,
    currentTheme: themes[theme],
    cycleTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
