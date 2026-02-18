# Theme

## Framework
- Docusaurus 3.9.2 with Infima CSS framework
- Tailwind CSS 4.x (via @tailwindcss/postcss)
- React 19

## CSS Variables (custom.css)

```css
/* Light mode */
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-color-primary-darker: #277148;
  --ifm-color-primary-darkest: #205d3b;
  --ifm-color-primary-light: #33925d;
  --ifm-color-primary-lighter: #359962;
  --ifm-color-primary-lightest: #3cad6e;
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
}

/* Dark mode */
[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
  --ifm-color-primary-dark: #21af90;
  --ifm-color-primary-darker: #1fa588;
  --ifm-color-primary-darkest: #1a8870;
  --ifm-color-primary-light: #29d5b0;
  --ifm-color-primary-lighter: #32d8b4;
  --ifm-color-primary-lightest: #4fddbf;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
}
```

## Color Palette
- Primary (light): #2e8555 (forest green)
- Primary (dark): #25c2a0 (teal)
- Infima system variables: --ifm-color-emphasis-100/200/600

## Typography
- Infima defaults (system font stack)
- Code: 95% size

## Tailwind
- Using @tailwindcss/postcss plugin
- Utilities and components layers imported in custom.css
