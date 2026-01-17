export const BASE_URL = 'https://shfe-diplom.neto-server.ru/';

export const request = async (url, method = 'GET', body = null) => {
    const options = {
        method,
        cache: 'no-store',
    };

    if (body) {
        options.body = body;
    }

    try {
        const finalUrl = method === 'GET'
            ? `${BASE_URL}${url}${url.includes('?') ? '&' : '?'}timestamp=${Date.now()}`
            : `${BASE_URL}${url}`;

        const response = await fetch(finalUrl, options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};