const puppeteer = require('puppeteer');
const { solveReCaptcha } = require('./captchaSolver');

// Function to auto-click the shortened link and solve reCAPTCHA
async function autoClickLink(link, siteKey) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Open the shortened URL
        await page.goto(link);

        // Wait for the reCAPTCHA to load
        await page.waitForSelector('.g-recaptcha');

        // Solve the reCAPTCHA using 2Captcha
        console.log('Solving reCAPTCHA...');
        const captchaSolution = await solveReCaptcha(siteKey, link);

        if (captchaSolution) {
            // Inject the solution into the reCAPTCHA form
            await page.evaluate((solution) => {
                document.getElementById('g-recaptcha-response').innerHTML = solution;
            }, captchaSolution);

            // Click the submit button to continue
            await page.click('#div-human-verification button');
            console.log('Form submitted, waiting for page to load...');
        }

        // Wait for the final page to load
        await page.waitForNavigation();
        console.log('Real link accessed!');
    } catch (err) {
        console.error('Error during bot operation:', err.message);
    } finally {
        await browser.close();
    }
}

module.exports = { autoClickLink };
