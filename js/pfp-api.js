fetch('js/data.json')
  .then(response => response.json()) 
  .then(async jsonData => {
    let items = jsonData.items;
    const maxItems = 4; 


    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
      }
    }

    shuffleArray(items); 
    items = items.slice(0, maxItems); 

    const outputDiv = document.getElementById('pfps');
    if (!outputDiv) {
      console.error('Element with ID "pfps" not found');
      return;
    }

    const appendedProfiles = new Set();

    for (const entry of items) {
      if (!entry.tweet_url) {
        console.error('No tweet URL found for entry', entry);
        continue;
      }

      if (appendedProfiles.has(entry.profile_url)) {
        console.log(`Profile already added: ${entry.profile_url}`);
        continue; 
      }

      appendedProfiles.add(entry.profile_url);

      // Create the pfp 
      const link = document.createElement('a');
      link.href = entry.profile_url;
      link.target = "_blank";
      link.className = 'pfp';
      link.style.backgroundImage = `url('${entry.pfp_url}')`; 

      // Create the name 
      const name = document.createElement('a');
      name.href = entry.profile_url;
      name.target = "_blank";
      name.className = 'name';
      name.textContent = entry.profile_name;

      const block = document.createElement('div');
      block.className = 'profile'
  /*     block.href = entry.profile_url;
      block.target = "_blank";
      block.style.backgroundImage = `url('${entry.pfp_url}')`;  */

      // Append the a tag to the output div
      block.appendChild(link);
      block.appendChild(name);
      outputDiv.appendChild(block);
    }
  })
  .catch(error => {
    console.error('Error fetching or processing data:', error);
  });
