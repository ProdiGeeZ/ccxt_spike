import defaultTheme from 'tailwindcss/defaultTheme'

module.exports = {
    content: [
        "./public/**/*.html",
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