import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/profile_image/:username', async (req, res) => {
    const username = req.params.username;
    const bearerToken = ''; 

    try {
        const response = await fetch(`https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url`, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).send('Error fetching profile image');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
