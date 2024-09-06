fetch('js/data.json')
.then(response => response.json()) // Parse the JSON data
.then(jsonData => {
    let items = jsonData.items;
    let maxItems = 5;

    // Step 3: Randomize the order using the Fisher-Yates Shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    function processUrl(url) {
        return url.replace(/\/status\/[^\/]+/, '/photo');
    }

    function processProfile(url) {
        return url.replace(/\/status\/[^\/]+/, '');
    }

    function pfp(url, callback) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            console.log('Image URL:', img.src);
            if (callback) callback(img.src);
        };
        img.onerror = () => {
            console.error('Failed to load image from:', img.src);
            if (callback) callback(null);
        };
    }

    shuffleArray(items);

    items = items.slice(0, maxItems);

    const outputDiv = document.getElementById('pfps');
    if (!outputDiv) {
        console.error('Element with ID "pfps" not found');
        return;
    }

    items.forEach(entry => {
        const img = new Image();
        img.src = entry.url;
        img.onload = () => {
            const { width, height } = img;
            let imgUrl = processUrl(entry.tweet_url);
            let profUrl = processProfile(entry.tweet_url);
            console.log(imgUrl);
            console.log(profUrl);


            // Create the a tag
            const link = document.createElement('a');
            link.href = profUrl;
            link.target = "_blank";
            link.className = 'item';

            // Use pfp to set the background image
            pfp(imgUrl, (imageSrc) => {
                if (imageSrc) {
                    link.style.backgroundImage = `url('${imageSrc}')`;
                } else {
                    console.error('Image source not available.');
                }
            });

            // Append the a tag to the output div
            outputDiv.appendChild(link);
        };
        img.onerror = () => {
            console.error(`Failed to load image from ${entry.url}`);
        };
    });
})
.catch(error => {
    console.error('Error fetching or processing data:', error);
});
