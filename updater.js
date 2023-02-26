const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
// require("dotenv").config();

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";
autoUpdater.autoDownload = false;
module.exports = () => {
  autoUpdater.checkForUpdates();
  // listen for updates found
  autoUpdater.on("update-available", () => {
    dialog
      .showMessageBox({
        type: "info",
        title: "Update Available",
        message:
          "A new version of Readit is available. Do you want to update it now.",
        buttons: ["Update", "No"],
      })
      .then((result) => {
        const buttonIndex = result.response;
        if (buttonIndex === 0) {
          autoUpdater.downloadUpdate();
        }
      });
  });
};
