'use es6';

export function setMockAuth(mocked) {
    return options => Object.assign({}, options, {
        mockAuth: mocked
    });
}