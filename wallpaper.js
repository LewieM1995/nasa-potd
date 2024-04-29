async function setWallpaperFromURL(settings) {
    try {
        // Dynamically import the path module
        const path = await import('path');
        // Dynamically import the fs module
        const fs = await import('fs');
        // Dynamically import the fetch module
        const fetch = (await import('node-fetch')).default;
        // Dynamically import the wallpaper module
        const wallpaperModule = await import('wallpaper');

        // Define the base URL for fetching the image
        const baseURL = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`;

        // Fetch the image URL
        const response = await fetch(baseURL);
        const data = await response.json();
        const imageUrl = data.hdurl;

        console.log('Image URL:', imageUrl);

        // Check if imageUrl is empty or undefined
        if (!imageUrl) {
            throw new Error('Image URL is empty or undefined');
        }

        // Fetch the image content as an ArrayBuffer
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        // Define the image path
        const imagePath = path.join(__dirname, 'wallpaper.jpg');

        // Write the image buffer to a file
        fs.writeFileSync(imagePath, imageBuffer);

        console.log('Wallpaper downloaded successfully.');

        // Set wallpaper from the downloaded image file
        await wallpaperModule.setWallpaper(imagePath, { scale: settings.scale });
        console.log('Wallpaper set successfully.');
    } catch (error) {
        console.error('Error setting wallpaper:', error);
    }
}

module.exports = { setWallpaperFromURL };
