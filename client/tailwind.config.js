/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
    theme: {
        extend: {
            colors: {
                dark: '#0e0e10',
                body: '#141414',
                'green-light': '#22c55e',
                'white-green': '#fafafa'
            }
        }
    },
    plugins: [require('@tailwindcss/forms')]
}
