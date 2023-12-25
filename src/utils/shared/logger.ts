import chalk from 'chalk';

const formatMessage = (message) => {
    let formattedMessage = message;
    if (Array.isArray(message) || typeof message === 'object') {
        formattedMessage = JSON.stringify(message, null, 2);
    }
    return formattedMessage;
};

export const logger = {
    debug(message) {
        if (process.env.ENVIRONMENT === 'dev') {
            const formattedMessage = formatMessage(message);
            console.log(chalk.magentaBright('[DEBUG]'), formattedMessage);
        }
    },
    info(message) {
        const formattedMessage = formatMessage(message);
        console.log(chalk.blueBright('[INFO]'), formattedMessage);
    },
    warn(message) {
        const formattedMessage = formatMessage(message);
        console.log(chalk.yellowBright('[WARN]'), formattedMessage);
    },
    error(message) {
        const formattedMessage = formatMessage(message);
        console.log(chalk.redBright('[ERROR]'), formattedMessage);
    },
};
