const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { setWallpaperFromURL } = require('./wallpaper');
const fs = require('fs');

let wallpaperUpdateInterval;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 500,
        show: false, // Hide the window initially
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show(); // Show the window once it's ready
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Listen for save-settings event from renderer process
ipcMain.on('save-settings', (event, settings) => {
    // Here you can handle the settings received from the renderer process
    console.log('Received settings:', settings);
    // Start the wallpaper update interval based on the user's settings
    startWallpaperUpdate(settings.frequency, settings.time, settings.scale);

    // Save settings to a file
    // Here, you should implement code to save settings to a file
    // For simplicity, let's assume settings are saved to a JSON file
    const settingsFilePath = path.join(__dirname, 'settings.json');
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings));

    // Update wallpaper immediately when settings are saved
    setWallpaperFromURL(settings);

    //Close mainWindow
    if (mainWindow){
        mainWindow.close();
    }
});

// Load saved settings when the app starts
app.on('ready', () => {
    const settingsFilePath = path.join(__dirname, 'settings.json');
    if (fs.existsSync(settingsFilePath)) {
        const savedSettings = JSON.parse(fs.readFileSync(settingsFilePath));
        startWallpaperUpdate(savedSettings.frequency, savedSettings.time, savedSettings.scale);
        setWallpaperFromURL(savedSettings);
        console.log(savedSettings)
    }
});

function startWallpaperUpdate(frequency, time, scale) {
    clearInterval(wallpaperUpdateInterval); // Clear any existing interval

    // Calculate the interval duration based on the selected frequency
    let intervalDuration;
    if (frequency === 'daily') {
        intervalDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    } else if (frequency === 'weekly') {
        intervalDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    }

    // Start the interval
    wallpaperUpdateInterval = setInterval(async () => {
        // Set the wallpaper at the specified time
        const now = new Date();
        if (now.getHours() === parseInt(time.split(':')[0]) && now.getMinutes() === parseInt(time.split(':')[1])) {
            try {
                await setWallpaperFromURL(scale);
            } catch (error) {
                console.error('Error setting wallpaper:', error);
            }
        }
    }, intervalDuration);
}
