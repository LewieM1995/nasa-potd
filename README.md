# NASA Picture of the Day Wallpaper Setter

This Electron application sets the NASA Picture of the Day as your wallpaper at specified intervals.

## Installation

1. Clone this repository to your local machine:

git clone https://github.com/LewieM1995/nasa-potd.git


2. Install dependencies:

npm install

3. Start the app:

npx electron .


## Usage

1. Launch the application.
2. Set the wallpaper update frequency (daily or weekly) and the time of day.
3. Save the settings.
4. The application will download the NASA Picture of the Day at the specified time and set it as your wallpaper.

## Development

- **Main Process:** The main process handles the Electron lifecycle events and window management.
- **Renderer Process:** The renderer process is responsible for the user interface and interaction.
- **IPC Communication:** Inter-process communication is used to pass data between the main and renderer processes.

## Dependencies

- [Electron](https://www.electronjs.org/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [wallpaper](https://www.npmjs.com/package/wallpaper)
- [fs-extra](https://www.npmjs.com/package/fs-extra)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
