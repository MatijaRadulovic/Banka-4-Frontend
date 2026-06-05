const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173",

        env: {
            API_URL: "http://rafsi.davidovic.io:8080/api",
            BANKING_API_URL: "http://rafsi.davidovic.io:8081/api",
            TRADING_API_URL: "http://rafsi.davidovic.io:8082/api",
        },

        setupNodeEvents(on, config) {
            return config;
        },
    },
});