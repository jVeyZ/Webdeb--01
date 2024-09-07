const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all requests

app.get('/api/profile-image/:profile', async (req, res) => {
    const profile = req.params.profile;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        console.log(`Navigating to profile: https://x.com/${profile}/photo`);

        // Navigate to the profile page
        await page.goto(`https://x.com/${profile}/photo`, { waitUntil: 'networkidle2' });

        // Extract the profile image from the background-image style or img tag
        const profileImageUrl = await page.evaluate(() => {
            // First, try to get the image from the background-image style
            const divWithBackgroundImage = document.querySelector('div[aria-label="Image"] div[style*="background-image"]');
            if (divWithBackgroundImage) {
                const style = divWithBackgroundImage.style.backgroundImage;
                const url = style.match(/url\("(.*?)"\)/);
                if (url && url[1]) {
                    return url[1]; // Return the URL inside background-image
                }
            }

            // If background-image is not available, fall back to the <img> tag
            const imgTag = document.querySelector('div[aria-label="Image"] img');
            if (imgTag && imgTag.src) {
                return imgTag.src; // Return the src attribute of the img tag
            }

            return null; // Return null if no image is found
        });

        await browser.close();

        if (profileImageUrl) {
            console.log(`Profile image found for ${profile}: ${profileImageUrl}`);
            res.json({ imageUrl: profileImageUrl });
        } else {
            console.log(`Profile image not found for ${profile}`);
            res.status(404).send({ error: 'Profile image not found' });
        }
    } catch (error) {
        console.error(`Error fetching profile image for ${profile}:`, error);
        res.status(500).send({ error: 'Error fetching profile image' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
