import { MD3DarkTheme } from 'react-native-paper';

export const theme = {
  ...MD3DarkTheme,

  colors: {
    ...MD3DarkTheme.colors,

    /* 🔵 PRIMARY — Electric Blue */
    primary: '#4C7CF5',
    primaryContainer: '#1C2A52',
    onPrimary: '#EAF0FF',
    onPrimaryContainer: '#AFC4FF',

    /* 🟧 SECONDARY — Warm Amber */
    secondary: '#F5A623',
    secondaryContainer: '#4A3415',
    onSecondary: '#FFF4D6',
    onSecondaryContainer: '#FFD08C',

    /* 🟢 TERTIARY — Mint Green */
    tertiary: '#7CF5C6',
    tertiaryContainer: '#1C3A32',
    onTertiary: '#003329',
    onTertiaryContainer: '#B7FFEA',

    /* ⚠ FEEDBACK COLORS */
    error: '#FF5C5C',
    errorContainer: '#4A1C1C',
    success: '#1CCF8A',
    warning: '#FFD54A',
    info: '#69A7FF',

    /* 🌑 DARK SURFACES */
    background: '#0B0F19',        // deep navy-black
    onBackground: '#EAF0FF',

    surface: '#151A28',           // card surfaces
    onSurface: '#DFE6FF',

    surfaceVariant: '#1E2535',
    onSurfaceVariant: '#A8B0C6',

    /* 🧱 ELEVATION LEVELS */
    elevation: {
      level0: 'transparent',
      level1: '#121726',
      level2: '#161C2D',
      level3: '#1A2134',
      level4: '#1E263B',
      level5: '#232B43',
    },

    /* 🔲 OUTLINES & BORDERS */
    outline: '#3E455A',
    outlineVariant: '#2A3042',

    /* 🌫 BACKDROP */
    backdrop: 'rgba(76, 124, 245, 0.12)',

    /* ✨ OTHER SEMANTIC COLORS */
    shadow: '#000000',
    scrim: '#000000',
  },

  /* 🔘 ROUNDED UI STYLE */
  roundness: 14,
};
