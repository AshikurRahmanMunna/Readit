const { Menu, shell } = require("electron");

module.exports = (appWebContent) => {
  const template = [
    {
      label: "Items",
      submenu: [
        {
          label: "Add Item",
          accelerator: "CommandOrControl+N",
          click: () => appWebContent.send("menu-show-modal"),
        },
        {
          label: "Open Item",
          accelerator: "CommandOrControl+Enter",
          click: () => appWebContent.send("open-item"),
        },
        {
          label: "Delete Item",
          accelerator: "CommandOrControl+Backspace",
          click: () => appWebContent.send("delete-item"),
        },
        {
          label: "Open In Browser",
          accelerator: "CommandOrControl+Shift+Enter",
          click: () => appWebContent.send("item-open-browser"),
        },
        {
          label: "Search",
          accelerator: "CommandOrControl+S",
          click: () => appWebContent.send("search"),
        },
      ],
    },
    {
      role: "editMenu",
    },
    {
      role: "windowMenu",
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: () => {
            shell.openExternal(
              "https://github.com/AshikurRahmanMunna/url-manager-electron"
            );
          },
        },
      ],
    },
  ];

  if (process.platform === "darwin") template.unshift({ role: "appMenu" });

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
};
