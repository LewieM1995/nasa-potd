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
    console.log('Received settings:', settings);
    // Start the wallpaper update interval based on the user's settings
    startWallpaperUpdate(settings.frequency, settings.time, settings.scale);

    // Save settings to a file
    const settingsFilePath = path.join(app.getPath('userData'), 'settings.json');
    try {
        fs.writeFileSync(settingsFilePath, JSON.stringify(settings));
        console.log('Settings saved successfully.');
    } catch (error) {
        console.error('Error saving settings:', error);
    }

    // Update wallpaper immediately when settings are saved
    setWallpaperFromURL(settings);

    /*//Close mainWindow
    if (mainWindow){
        mainWindow.close();
    }*/
});

// Load saved settings when the app starts
app.on('ready', () => {
    const settingsFilePath = path.join(app.getPath('userData'), 'settings.json');
    try {
        if (fs.existsSync(settingsFilePath)) {
            const savedSettings = JSON.parse(fs.readFileSync(settingsFilePath));
            startWallpaperUpdate(savedSettings.frequency, savedSettings.time, savedSettings.scale);
            setWallpaperFromURL(savedSettings);
            console.log('Loaded saved settings:', savedSettings);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
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
