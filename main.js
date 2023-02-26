// Modules
const { app, BrowserWindow, ipcMain } = require("electron");
const appMenu = require("./menus");
const path = require("path");
const windowStateKeeper = require("electron-window-state");
const readItem = require("./readItem");
const updater = require("./updater");
require("dotenv").config();

let mainWindow;

ipcMain.on("new-item", (e, itemUrl) => {
  readItem(itemUrl, (item) => {
    e.sender.send("new-item-success", item);
  });
});

function createWindow() {
  const state = windowStateKeeper({ defaultHeight: 650, defaultWidth: 500 });
  mainWindow = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    minWidth: 350,
    maxWidth: 650,
    title: "URL Manager",
    minHeight: 300,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  setTimeout(updater, 3000);

  appMenu(mainWindow.webContents);

  state.manage(mainWindow);
  mainWindow.loadFile(path.join(__dirname, "renderer", "main.html"));
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
