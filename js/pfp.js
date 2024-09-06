
    // Function to shuffle an array (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    // Function to call backend and get the Twitter profile image URL
    function getProfileImage(username) {
        return fetch(`http://localhost:3000/get-twitter-profile?username=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.profile_image_url) {
                    return data.profile_image_url;
                } else {
                    console.error('Failed to get profile image URL:', data.error);
                    return null;
                }
            })
            .catch(error => {
                console.error('Error fetching profile image:', error);
                return null;
            });
    }

    // Fetch your data.json file and process it
    fetch('js/data.json')
        .then(response => response.json()) // Parse the JSON data
        .then(async jsonData => {
            let items = jsonData.items;
            let maxItems = 5;

            // Shuffle the items array
            shuffleArray(items);

            // Slice to limit the number of items
            items = items.slice(0, maxItems);

            const outputDiv = document.getElementById('pfps');
            if (!outputDiv) {
                console.error('Element with ID "pfps" not found');
                return;
            }

            for (const entry of items) {
                const tweetUrl = entry.tweet_url;
                const usernameMatch = tweetUrl.match(/twitter\.com\/([^\/]+)\/status/);
                const username = usernameMatch ? usernameMatch[1] : null;

                if (username) {
                    // Call the backend to get the profile image URL
                    const profileImageUrl = await getProfileImage(username);

                    if (profileImageUrl) {
                        // Create the a tag
                        const link = document.createElement('a');
                        link.href = tweetUrl;
                        link.target = "_blank"; // Opens link in a new tab
                        link.className = 'item'; // Use appropriate class if needed
                        link.style.backgroundImage = `url('${profileImageUrl}')`;

                        // Append the a tag to the output div
                        outputDiv.appendChild(link);
                    } else {
                        console.error(`Failed to load image for ${username}`);
                    }
                } else {
                    console.error('Failed to extract username from tweet URL:', tweetUrl);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
        });

