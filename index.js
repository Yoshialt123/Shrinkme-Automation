const { autoClickLink } = require('./bot');

// Replace with the shortened link
const shortenedLink = 'https://shrinkme.io/xyz123';
const siteKey = '6LcK3nQoAAAAALngDyLput6Bk_h6QoSq4G10ded7'; // Google reCAPTCHA site key

(async () => {
    console.log('Starting bot...');
    await autoClickLink(shortenedLink, siteKey);
})();
