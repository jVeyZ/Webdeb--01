const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


const jsonFilePath = path.join(__dirname, 'data.json');
let jsonData = require(jsonFilePath);

async function scrapeProfile(profileHandle) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    try {
        await page.goto(`https://x.com/${profileHandle}/photo`);
        await page.waitForSelector('div[aria-label="Image"] img');
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

async function updateJsonWithProfileData() {
    for (let item of jsonData.items) {
        const profileHandle = item.tweet_url.split('/')[3]; 

        if (!item.profile_name || !item.pfp_url) {
            const profileData = await scrapeProfile(profileHandle);

            if (profileData) {
                item.profile_name = profileData.profile_name;
                item.profile_url = profileData.profile_url;
                item.pfp_url = profileData.pfp_url;

                console.log(`Updated profile data for ${profileHandle}`);
            }
        }
    }


    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log('JSON data updated successfully.');
}

updateJsonWithProfileData();
