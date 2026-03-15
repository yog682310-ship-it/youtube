const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core'); // Best working fork of ytdl-core

const app = express();

// CORS allow karein taaki aapki website isse connect kar sake
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.send('YT Downloader API is running successfully!');
});

app.get('/api/download', async (req, res) => {
    const { url, type } = req.query;

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        // Video ki details nikalein
        const info = await ytdl.getInfo(url);
        // Title ko clean karein taaki file ka naam sahi rahe
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); 

        if (type === 'audio') {
            // Audio ke liye
            res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
            ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            // Video ke liye (720p with audio by default)
            res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
            ytdl(url, { filter: 'audioandvideo', quality: 'highest' }).pipe(res);
        }
    } catch (error) {
        console.error("Download Error: ", error);
        res.status(500).json({ error: 'Failed to process video' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
