import defaultTheme from 'tailwindcss/defaultTheme'

module.exports = {
    content: [
        "./src/**/*.{html,ts,js}",   
        "./*.{html,ts,js}",          
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    // ...
}