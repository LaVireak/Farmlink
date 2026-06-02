import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
darkMode: 'class',
content: [
'./app.vue',
'./app/**/*.{vue,js,ts}',
'./components/**/*.{vue,js,ts}',
'./layouts/**/*.vue',
'./pages/**/*.vue',
'./plugins/**/*.{js,ts}',
'./error.vue',
],
theme: {
extend: {
colors: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    'secondary-container': 'var(--color-secondary-container)',
    'on-secondary-container': 'var(--color-on-secondary-container)',
    surface: 'var(--color-surface)',
    'surface-container-lowest': 'var(--color-surface-lowest)',
    'surface-container-low': 'var(--color-surface-low)',
    'surface-container': 'var(--color-surface-container)',
    'surface-container-high': 'var(--color-surface-high)',
    'surface-container-highest': 'var(--color-surface-highest)',
    'on-surface': 'var(--color-on-surface)',
    'on-surface-variant': 'var(--color-on-surface-variant)',
    outline: 'var(--color-outline)',
    'outline-variant': 'var(--color-outline-variant)',
    error: 'var(--color-error)',
    'error-container': 'var(--color-error-container)',
},
fontFamily: {
body: ['Inter', 'sans-serif'],
label: ['Inter', 'sans-serif'],
},
},
},
plugins: [],
}
