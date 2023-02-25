const { BrowserWindow } = require("electron");

let offscreenWindow;

const readItem = (url, callback) => {
  offscreenWindow = new BrowserWindow({
    height: 1440,
    width: 1440,
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });

  //   load the url
  offscreenWindow.loadURL(url);
  offscreenWindow.webContents.on("did-finish-load", (e) => {
    let title = offscreenWindow.getTitle();
    offscreenWindow.webContents.capturePage().then((image) => {
      let screenshot = image.toDataURL();
      callback({ title, screenshot, url });
      offscreenWindow.close();
      offscreenWindow = null;
    });
  });
};

module.exports = readItem;
