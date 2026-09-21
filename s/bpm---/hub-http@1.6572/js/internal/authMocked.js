'use es6';

let mockAuth = false;
export function enableMockAuth() {
    mockAuth = true;
}
export function getMockAuth() {
    return mockAuth;
}