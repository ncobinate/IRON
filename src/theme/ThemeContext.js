import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, spacing, font } from './index';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const scheme = useColorScheme();
  const colors = scheme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ colors, spacing, font, scheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
