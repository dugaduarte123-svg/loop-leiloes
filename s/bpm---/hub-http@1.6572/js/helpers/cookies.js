'use es6';

export const getCookie = (name, cookies) => {
    const value = `; ${cookies}`;
    const splitCookies = value.split(';');
    if (splitCookies.length) {
        for (let i = 0; i < splitCookies.length; i++) {
            const parts = splitCookies[i].split('=');
            if (parts.length === 2 && parts[0].trim() === name) {
                return parts[1];
            }
        }
    }
    return null;
};