// This file is required by the index.html file and will
// be executed in the renderer process for that window.

const { ipcRenderer, shell } = require("electron");
const items = require("./items.js");

// All of the Node.js APIs are available in this process.
const showModalBtn = document.getElementById("show-modal");
const closeModalBtn = document.getElementById("close-modal");
const modal = document.getElementById("modal");
const addItemBtn = document.getElementById("add-item");
const urlInput = document.getElementById("url");
const urlError = document.getElementById("url-error");
const search = document.getElementById("search");

// handle search
search.addEventListener("keyup", (e) => {
  Array.from(document.getElementsByClassName("read-item")).forEach((item) => {
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? "flex" : "none";
  });
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    items.changeSelection(e.key);
  }
});

const toggleModalButtons = () => {
  if (addItemBtn.disabled) {
    addItemBtn.disabled = false;
    addItemBtn.style.opacity = 1;
    addItemBtn.innerText = "Add Item";
    closeModalBtn.style.display = "inline";
  } else {
    addItemBtn.style.opacity = 0.5;
    addItemBtn.innerText = "Adding...";
    closeModalBtn.style.display = "none";
    addItemBtn.disabled = true;
  }
};

const showModal = () => {
  urlInput.focus();
  modal.style.display = "flex";
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
};

// handle show and close modal
showModalBtn.addEventListener("click", showModal);

ipcRenderer.on("menu-show-modal", showModal);

ipcRenderer.on("open-item", items.open);

ipcRenderer.on("delete-item", () => {
  const selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
});

ipcRenderer.on("item-open-browser", items.openNative);

ipcRenderer.on("search", () => {
  search.focus();
});

addItemBtn.addEventListener("click", () => {
  const url = urlInput.value;
  if (!url) {
    return (urlError.innerText = "URL is required");
  }
  ipcRenderer.send("new-item", url);
  toggleModalButtons();
});

ipcRenderer.on("new-item-success", (e, newItem) => {
  items.addItem(newItem, true);
  toggleModalButtons();
  modal.style.display = "none";
  urlInput.value = "";
});

urlInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addItemBtn.click();
});
