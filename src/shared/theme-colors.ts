export type Theme = "dark" | "light";

export type ThemeColors = {
  "--primary-color": string;
  "--secondary-color": string;
  "--background-color": string;
  "--text-color": string;
  "--chart-label": string;
  "--box-shadow": string;
  "--card-background": string;
};

export const themes: Record<Theme, ThemeColors> = {
  light: {
    "--primary-color": "#007bff",
    "--secondary-color": "#6c757d",
    "--background-color": "#ffffff",
    "--text-color": "#212529",
    "--chart-label": "rgba(0, 0, 0, 0.1)",
    "--box-shadow": "rgba(0, 0, 0, 0.45) 0 5px 11px -10px",
    "--card-background": "transparent",
  },
  dark: {
    "--primary-color": "#007bff",
    "--secondary-color": "#6c757d",
    "--background-color": "#212121",
    "--text-color": "#c8c8c8",
    "--chart-label": "rgba(255, 255, 255, 0.1)",
    "--box-shadow": "rgba(0, 0, 0, 1) 0 5px 9px -5px",
    "--card-background": "#282828",
  },
};
