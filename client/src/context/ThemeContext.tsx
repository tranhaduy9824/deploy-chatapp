/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("themeDark");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme: boolean) => {
      const newTheme = !prevTheme;
      localStorage.setItem("themeDark", JSON.stringify(newTheme));
      return newTheme;
    });
  };

  useEffect(() => {
    const root = document.documentElement;

    if (isDarkTheme) {
      root.style.setProperty("--bg-primary", "#2d2d2d");
      root.style.setProperty("--bg-sub-primary", "#6d6d6d");
      root.style.setProperty("--text-color", "white");
    } else {
      root.style.setProperty("--bg-primary", "#a68bff");
      root.style.setProperty("--bg-sub-primary", "#dce2f0");
      root.style.setProperty("--text-color", "white");
      root.style.setProperty("--bg-primary-gentle", "#c2d6ff");
      root.style.setProperty("--bg-sub-primary-gentle", "#f0f5ff");
    }

    root.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
