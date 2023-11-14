module.exports = {
    mode: "jit", 
    purge: ["./**/*.html", "./src/**/*.css"],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
        
        },
    },
    variants: {
        extend: {
            // ringWidth: ["active"], 
        },
    },
    plugins: [],
};