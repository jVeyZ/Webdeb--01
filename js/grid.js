fetch('js/data.json')
.then(response => response.json()) // Parse the JSON data
.then(jsonData => {
    // Step 2: Extract the list of items
    let items = jsonData.items;

    // Step 3: Randomize the order using the Fisher-Yates Shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    shuffleArray(items);

    // Step 4: Flatten the structure and randomize URLs within each item
    let flattenedItems = [];

    items.forEach(item => {
        shuffleArray(item.image_urls);  // Shuffle the image_urls array for each item

        item.image_urls.forEach((url, index) => {
            flattenedItems.push({
                url: url,
                tweet_url: item.tweet_url
            });
        });
    });

    // Shuffle the flattened list of URLs
    shuffleArray(flattenedItems);

    // Define size classes for random assignment
    const sizeClasses = {
        small: ['size-small', 'size-small-h', 'size-small-v'],
        medium: ['size-medium', 'size-medium-h', 'size-medium-v'],
        large: ['size-large', 'size-large-h', 'size-large-v']
    };

    function getRandomSizeClass() {
        const rand = Math.random();
        if (rand < 0.1) {
            // 10% chance for large
            return sizeClasses.large;
        } else if (rand < 0.4) {
            // 30% chance for medium
            return sizeClasses.medium;
        } else {
            // Default to small
            return sizeClasses.small;
        }
    }

    function getAspectRatioClass(width, height, sizeClass) {
        const aspectRatio = width / height;
        if (sizeClass.includes('size-small') || sizeClass.includes('size-medium') || sizeClass.includes('size-large')) {
            if (aspectRatio < 0.67) {
                return sizeClass.find(c => c.includes('v')); // Vertical
            } else if (aspectRatio > 1.42) {
                return sizeClass.find(c => c.includes('h')); // Horizontal
            }
        }
        return sizeClass[0]; // Default size class if no variation
    }

    // Load image dimensions and apply size classes
    const outputDiv = document.getElementById('output');
    let itemsLoaded = 0;

    flattenedItems.forEach(entry => {
        const img = new Image();
        img.src = entry.url;
        img.onload = () => {
            const { width, height } = img;
            const baseClasses = getRandomSizeClass();
            const finalClass = getAspectRatioClass(width, height, baseClasses);

            // Create the a tag
            const link = document.createElement('a');
            link.href = entry.tweet_url;
            link.target = "_blank"; // Opens link in a new tab
            link.className = 'item ' + finalClass; // Add final size class
            link.style.backgroundImage = `url('${entry.url}')`;

            // Append the a tag to the output div
            outputDiv.appendChild(link);

            itemsLoaded++;
            if (itemsLoaded === flattenedItems.length) {
                console.log('All images processed and added to the grid.');
            }
        };
    });
});