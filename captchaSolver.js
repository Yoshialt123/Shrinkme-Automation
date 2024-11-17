const axios = require('axios');

// Replace with your 2Captcha API key
const apiKey = 'YOUR_2CAPTCHA_API_KEY';

// Function to solve reCAPTCHA using 2Captcha
async function solveReCaptcha(siteKey, pageUrl) {
    try {
        // Step 1: Send the CAPTCHA request to 2Captcha
        const captchaRequest = await axios.post('http://2captcha.com/in.php', null, {
            params: {
                key: apiKey,
                method: 'userrecaptcha',
                googlekey: siteKey,
                pageurl: pageUrl
            }
        });

        // Check if the request was successful
        if (captchaRequest.data.status !== 1) {
            throw new Error('Failed to send CAPTCHA request.');
        }

        const captchaId = captchaRequest.data.request;
        console.log('Captcha request sent successfully. ID:', captchaId);

        // Step 2: Retrieve the CAPTCHA solution after some delay
        let solutionResponse;
        let attempts = 0;

        // Retry up to 5 times (2.5 minutes max)
        while (attempts < 5) {
            solutionResponse = await axios.get(`http://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}`);
            
            if (solutionResponse.data.status === 1) {
                console.log('Captcha solved:', solutionResponse.data.request);
                return solutionResponse.data.request; // Return the solution
            }

            console.log('Waiting for 15 seconds before retrying...');
            await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds
            attempts++;
        }

        throw new Error('Failed to solve CAPTCHA after multiple attempts.');
    } catch (err) {
        console.error('Error solving reCAPTCHA:', err.message);
    }
}

module.exports = { solveReCaptcha };
