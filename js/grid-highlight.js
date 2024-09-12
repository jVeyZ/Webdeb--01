fetch('js/data.json')
    .then(response => response.json()) 
    .then(jsonData => {
        
        let items = jsonData.items;

        
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; 
            }
        }

        shuffleArray(items);

        let flattenedItems = [];

        items.forEach(item => {
            shuffleArray(item.image_urls); 

            item.image_urls.forEach((url) => {
                flattenedItems.push({
                    url: url,
                    tweet_url: item.tweet_url
                });
            });
        });


        shuffleArray(flattenedItems);

        const sizeClasses = {
            small: ['size-small'],
            medium: ['size-medium'],
            high: ['size-high']
        };

        function getRandomSizeClass() {
            const rand = Math.random();
            if (rand < 0.1) {
                return sizeClasses.high;
            } else if (rand < 0.4) {
                return sizeClasses.medium;
            } else {
                return sizeClasses.small;
            }
        }

      /*   function getAspectRatioClass(width, height, sizeClass) {
            const aspectRatio = width / height;
            if (sizeClass.includes('size-small') || sizeClass.includes('size-medium') || sizeClass.includes('size-large')) {
                if (aspectRatio < 0.67) {
                    return sizeClass.find(c => c.includes('v')); 
                } else if (aspectRatio > 1.42) {
                    return sizeClass.find(c => c.includes('h')); 
                }
            }
            return sizeClass[0]; 
        } */


        const outputDiv = document.getElementById('output');
        let itemsLoaded = 0;
        let maxarea = 48;
        let itemarea = 0;

        flattenedItems.forEach(entry => {
            const img = new Image();
            img.src = entry.url;
            img.onload = () => {
                const baseClasses = getRandomSizeClass();


                const link = document.createElement('a');
                link.href = entry.tweet_url;
                link.target = "_blank"; 
                link.className = 'item ' + baseClasses; 
                link.style.backgroundImage = `url('${entry.url}')`;
                if (baseClasses == sizeClasses.high) {
                    itemarea = 8;
                }
                else if (baseClasses == sizeClasses.medium) {
                    itemarea = 16;
                }
                else{
                    itemarea = 4
                }
                if (maxarea > 0 && maxarea-itemarea>=0) {
                    outputDiv.appendChild(link);
                    maxarea -= itemarea;
                }

                

                itemsLoaded++;
                if (itemsLoaded === flattenedItems.length) {
                    console.log('All images processed and added to the grid.');
                }
            };
        });
    });
