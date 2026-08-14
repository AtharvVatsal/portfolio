import React, { createContext, useContext, useState } from 'react';

// Theme definitions — materials, not decoration
const themes = {
  purple: {
    // Background is always #0A0908 — warm near-black
    gradient: 'bg-notebook-bg',
    accent: '#6366F1',        // Blueprint blue
    accentSecondary: '#A855F7',
    accentFaint: 'rgba(99, 102, 241, 0.08)',
    spotlight: 'rgba(99, 102, 241, 0.15)',
    label: 'Blueprint',
  },
  cyan: {
    gradient: 'bg-notebook-bg',
    accent: '#22D3EE',
    accentSecondary: '#06B6D4',
    accentFaint: 'rgba(34, 211, 238, 0.08)',
    spotlight: 'rgba(34, 211, 238, 0.15)',
    label: 'Cyan',
  },
  green: {
    gradient: 'bg-notebook-bg',
    accent: '#34D399',
    accentSecondary: '#10B981',
    accentFaint: 'rgba(52, 211, 153, 0.08)',
    spotlight: 'rgba(52, 211, 153, 0.15)',
    label: 'Emerald',
  },
};

const ThemeContext = createContext(undefined);

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
    themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
