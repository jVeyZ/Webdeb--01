// Fetch and process data from json
fetch('js/data.json')
  .then(response => response.json()) // Parse the JSON data
  .then(async jsonData => {
    let items = jsonData.items;
    const maxItems = 5; // Adjust as needed

    // Step 3: Randomize the order using the Fisher-Yates Shuffle
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
    }

    function processProfile(tweetUrl) {
        return tweetUrl.replace(/\/status\/[^\/]+/, ''); // Modify for profile
    }

    shuffleArray(items); // Shuffle the items
    items = items.slice(0, maxItems); // Limit the number of items to maxItems

    const outputDiv = document.getElementById('pfps');
    if (!outputDiv) {
      console.error('Element with ID "pfps" not found');
      return;
    }

    // Function to extract profile from tweet URL (handles both twitter.com and x.com)
    function extractProfile(url) {
      const match = url.match(/(?:twitter|x)\.com\/([^\/]+)\/status/);
      return match ? match[1] : null;
    }

    // Fetch profile image URL from Puppeteer backend API
    async function fetchProfileImage(profile) {
        try {
          const response = await fetch(`http://localhost:3000/api/profile-image/${profile}`);
          const text = await response.text(); // Get the response as text first
      
          // Attempt to parse JSON
          let data;
          try {
            data = JSON.parse(text);
          } catch (error) {
            console.error('Failed to parse JSON:', error);
            return null;
          }
      
          return data.imageUrl; // Return the profile image URL
        } catch (error) {
          console.error('Error fetching profile image:', error);
          return null;
        }
      }
      

    // Process each item
    for (const entry of items) {
      if (!entry.tweet_url) {
        console.error('No tweet URL found for entry', entry);
        continue;
      }
      let profUrl = processProfile(entry.tweet_url);
      const profile = extractProfile(entry.tweet_url);
      if (!profile) {
        console.error('Profile could not be extracted from', entry.tweet_url);
        continue;
      }

      // Fetch the profile image URL using Puppeteer backend
      const profileImageUrl = await fetchProfileImage(profile);
      if (!profileImageUrl) {
        console.error('Failed to find profile image for', profile);
        continue;
      }

      // Create the a tag
      const link = document.createElement('a');
      link.href = profUrl;
      link.target = "_blank";
      link.className = 'item';
      link.style.backgroundImage = `url('${profileImageUrl}')`; // Set background image

      // Append the a tag to the output div
      outputDiv.appendChild(link);
    }
  })
  .catch(error => {
    console.error('Error fetching or processing data:', error);
  });
