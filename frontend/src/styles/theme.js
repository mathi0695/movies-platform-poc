export const theme = {
  primary: '#FFB800',
  secondary: '#1a1a2e',
  background: '#0f0f1e',
  surface: '#16213e',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  error: '#ff6b6b',
  success: '#51cf66',
  warning: '#ffd93d',
  info: '#4dabf7',
};

export const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${theme.background};
    color: ${theme.text};
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }
`;
