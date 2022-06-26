const ServerlessClient = require('serverless-postgres')

export const client = new ServerlessClient({
    user: "postgres",
    host: "database-1.crhrmvpcwyde.us-east-1.rds.amazonaws.com",
    database: "lesson4",
    password: "JFjUsdgmPbaTKtQp0Dvq",
    port: "5432",
    debug: true,
    delayMs: 3000,
});
