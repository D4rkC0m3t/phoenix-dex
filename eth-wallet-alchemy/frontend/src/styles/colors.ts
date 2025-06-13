// Color palette for the Phoenix wallet application
export const colors = {
  // Primary colors
  orange: {
    DEFAULT: '#FF5F00',
    light: '#FF7F33',
    dark: '#E55500',
  },
  maroon: {
    DEFAULT: '#B20600',
    light: '#D10700',
    dark: '#8F0500',
  },
  darkBlue: {
    DEFAULT: '#00092C',
    light: '#000C45',
    dark: '#000620',
  },
  grey: {
    DEFAULT: '#EEEEEE',
    light: '#FFFFFF',
    dark: '#DDDDDD',
  },
  
  // UI colors
  background: {
    primary: '#00092C', // Dark blue as main background
    secondary: '#000620', // Darker blue for cards
    tertiary: '#000C45', // Lighter blue for hover states
  },
  
  text: {
    primary: '#EEEEEE', // Light grey for main text
    secondary: '#DDDDDD', // Darker grey for secondary text
    accent: '#FF5F00', // Orange for accent text
  },
  
  accent: {
    primary: '#FF5F00', // Orange as primary accent
    secondary: '#B20600', // Maroon as secondary accent
    tertiary: '#EEEEEE', // Light grey as tertiary accent
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #FF5F00 0%, #B20600 100%)',
    secondary: 'linear-gradient(135deg, #B20600 0%, #00092C 100%)',
    tertiary: 'linear-gradient(135deg, #00092C 0%, #FF5F00 100%)',
  },
  
  // Status colors
  status: {
    success: '#00C853',
    warning: '#FF5F00',
    error: '#B20600',
    info: '#2196F3',
  },
};

// CSS variable strings for use in styled-components or inline styles
export const cssVariables = `
  --color-orange: ${colors.orange.DEFAULT};
  --color-orange-light: ${colors.orange.light};
  --color-orange-dark: ${colors.orange.dark};
  
  --color-maroon: ${colors.maroon.DEFAULT};
  --color-maroon-light: ${colors.maroon.light};
  --color-maroon-dark: ${colors.maroon.dark};
  
  --color-dark-blue: ${colors.darkBlue.DEFAULT};
  --color-dark-blue-light: ${colors.darkBlue.light};
  --color-dark-blue-dark: ${colors.darkBlue.dark};
  
  --color-grey: ${colors.grey.DEFAULT};
  --color-grey-light: ${colors.grey.light};
  --color-grey-dark: ${colors.grey.dark};
  
  --color-background-primary: ${colors.background.primary};
  --color-background-secondary: ${colors.background.secondary};
  --color-background-tertiary: ${colors.background.tertiary};
  
  --color-text-primary: ${colors.text.primary};
  --color-text-secondary: ${colors.text.secondary};
  --color-text-accent: ${colors.text.accent};
  
  --color-accent-1: ${colors.accent.primary};
  --color-accent-2: ${colors.accent.secondary};
  --color-accent-3: ${colors.accent.tertiary};
  
  --gradient-primary: ${colors.gradients.primary};
  --gradient-secondary: ${colors.gradients.secondary};
  --gradient-tertiary: ${colors.gradients.tertiary};
  
  --color-status-success: ${colors.status.success};
  --color-status-warning: ${colors.status.warning};
  --color-status-error: ${colors.status.error};
  --color-status-info: ${colors.status.info};
`;

export default colors;
