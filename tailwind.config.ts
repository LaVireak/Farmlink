import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
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
primary: '#154212',
secondary: '#006e1c',
'secondary-container': '#d5f3cf',
'on-secondary-container': '#1b1c1a',
surface: '#fbf9f6',
'surface-container-lowest': '#ffffff',
'surface-container-low': '#f5f3f0',
'surface-container': '#efeeea',
'surface-container-high': '#e9e8e5',
'surface-container-highest': '#e3e2df',
'on-surface': '#1b1c1a',
'on-surface-variant': '#42493e',
outline: '#72796e',
'outline-variant': '#c2c9bb',
error: '#b42318',
'error-container': '#fee4e2',
},
fontFamily: {
body: ['Inter', 'sans-serif'],
label: ['Inter', 'sans-serif'],
},
},
},
plugins: [],
}
