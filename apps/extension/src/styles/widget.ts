export const widgetCss = `
  :host {
    all: initial;
    position: fixed;
    right: 12px;
    bottom: 12px;
    z-index: 2147483000;
    color-scheme: light;
  }

  *, *::before, *::after { box-sizing: border-box; }

  button { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }

  .tutor-launcher {
    width: 28px;
    height: 28px;
    padding: 0;
    border: 1px solid #d9dadd;
    border-radius: 6px;
    background: #fff;
    color: #4d5156;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }

  .tutor-launcher:hover { border-color: #b8bbc0; color: #202124; }

  .tutor-launcher:focus-visible,
  .tutor-icon-button:focus-visible,
  .tutor-close-button:focus-visible {
    outline: 2px solid #3974d8;
    outline-offset: 2px;
  }

  .tutor-card {
    width: 184px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 7px 8px;
    border: 1px solid #dfe1e4;
    border-radius: 7px;
    background: #fff;
    color: #242629;
    box-shadow: 0 2px 7px rgba(0, 0, 0, 0.07);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .tutor-row { display: flex; align-items: center; gap: 6px; min-height: 18px; }
  .tutor-status { flex: 1; font-size: 12px; line-height: 1.2; }
  .tutor-status--correct { color: #176b3a; }
  .tutor-status--incorrect { color: #9b2c2c; }
  .tutor-status--error { color: #5f6368; font-size: 11px; }

  .tutor-icon-button {
    width: 18px;
    height: 18px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #6b7075;
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
  }

  .tutor-close-button {
    min-height: 25px;
    padding: 0 7px;
    border: 1px solid #d4d6d8;
    border-radius: 5px;
    background: #fff;
    color: #34373a;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
  }

  .tutor-close-button:hover { background: #f7f7f7; }

  .tutor-spinner {
    width: 11px;
    height: 11px;
    border: 2px solid #d8dadd;
    border-top-color: #555b61;
    border-radius: 50%;
    animation: tutor-spin 0.75s linear infinite;
  }

  @keyframes tutor-spin { to { transform: rotate(360deg); } }

  @media (prefers-reduced-motion: reduce) {
    .tutor-spinner { animation-duration: 1.5s; }
  }
`;

