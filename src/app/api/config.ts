export const API_CONFIG = {
    BASE_URL: '/',
    TIMEOUT: 15000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
};

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/authenticate',
    },
    REFERENCES: {
        CORE: '/payment',
        SEARCH: '/payment/search',
        CANCEL: '/payment/cancel'
    },
};