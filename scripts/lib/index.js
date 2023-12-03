function createExecTime(name) {
    const startTime = Date.now();
    return {
        stop: () => {
            console.log(`${name} - ${Date.now() - startTime}ms`);
        },
    };
}

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function checkSpecialCharacters(path) {
    const NO_SPECIAL_CHARACTERS = new RegExp(/^[ A-Za-z0-9_-]*$/gm);
    if (!NO_SPECIAL_CHARACTERS.test(path || process.cwd())) {
        console.warn(`Hey! A folder in your Hades path has special characters in it.`);
        console.warn(`Please rename your folder, or folders to a name that doesn't have special characters in it.`);
        console.warn(`Special Characters: ()[]{}|:;'<>?,!@#$%^&*+=`);
        process.exit(1);
    }
}

export { checkSpecialCharacters, createExecTime, sleep };
