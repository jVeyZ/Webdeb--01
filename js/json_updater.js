const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Load the existing JSON data
const jsonFilePath = path.join(__dirname, 'data.json');
let jsonData = require(jsonFilePath);

async function scrapeProfile(profileHandle) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    try {
        await page.goto(`https://x.com/${profileHandle}/photo`);
        await page.waitForSelector('div[aria-label="Image"] img');
        // Get the profile picture URL
        const profileImageUrl = await page.evaluate(() => {
            const imgTag = document.querySelector('div[aria-label="Image"] img');
            return imgTag ? imgTag.src : null;
        });

        await browser.close();

        if (profileImageUrl) {
            return {
                profile_name: `@${profileHandle}`,
                profile_url: `https://x.com/${profileHandle}`,
                pfp_url: profileImageUrl
            };
        } else {
            console.log(`Profile image not found for ${profileHandle}`);
            return null;
        }

    } catch (error) {
        console.error(`Error scraping profile for ${profileHandle}:`, error);
        await browser.close();
        return null;
    }
}

// Update the JSON with the new profile data
async function updateJsonWithProfileData() {
    for (let item of jsonData.items) {
        const profileHandle = item.tweet_url.split('/')[3]; // Extract handle from tweet_url

        // Check if profile data already exists in the item
        if (!item.profile_name || !item.pfp_url) {
            const profileData = await scrapeProfile(profileHandle);

            if (profileData) {
                // Append the new profile data
                item.profile_name = profileData.profile_name;
                item.profile_url = profileData.profile_url;
                item.pfp_url = profileData.pfp_url;

                console.log(`Updated profile data for ${profileHandle}`);
            }
        }
    }

    // Write the updated data back to the JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log('JSON data updated successfully.');
}

updateJsonWithProfileData();
