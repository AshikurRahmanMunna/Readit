const { shell } = require("electron");
const fs = require("fs");
const path = require("path");

const items = document.getElementById("items");

let readerJS;

fs.readFile(
  path.join(__dirname, "reader.js"),
  "utf-8",
  (err, data) => (readerJS = data)
);

exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

exports.getSelectedItem = () => {
  const currentItem = document.getElementsByClassName("read-item selected")[0];
  let index = 0;
  let child = currentItem;
  while ((child = child.previousElementSibling) !== null) index++;
  return { node: currentItem, index };
};
exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

exports.select = (e) => {
  this.getSelectedItem().node.classList.remove("selected");
  e.currentTarget.classList.add("selected");
};

exports.open = () => {
  if (!this.storage.length) return;

  // get selected item
  const selectedItem = this.getSelectedItem();

  const url = selectedItem.node.dataset.url;
  const readerWindow = window.open(
    url,
    "_blank",
    `
    width=1200,
    height=800,
    x=40,
    y=40,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
  `
  );

  readerWindow.eval(readerJS.replace(`"{{index}}"`, selectedItem.index));
};

exports.openNative = () => {
  if (!this.storage.length) return;
  const selectedItem = this.getSelectedItem().node;
  const url = selectedItem.node.dataset.url;
  shell.openExternal(url);
};

window.addEventListener("message", (e) => {
  if (e.data.action === "delete-reader-item") {
    e.source.close();
    this.delete(e.data.itemIndex);
  }
});

exports.delete = (index) => {
  items.removeChild(items.childNodes[index]);
  this.storage.splice(index, 1);
  this.save();
  if (this.storage.length) {
    const newlySelectedItemIndex = index === 0 ? 0 : index - 1;
    document
      .getElementsByClassName("read-item")
      [newlySelectedItemIndex].classList.add("selected");
  }
};

exports.changeSelection = (key) => {
  const selectedItem = this.getSelectedItem().node;
  if (key === "ArrowUp" && selectedItem.previousElementSibling) {
    selectedItem.classList.remove("selected");
    selectedItem.previousElementSibling.classList.add("selected");
  }
  if (key === "ArrowDown" && selectedItem.nextElementSibling) {
    selectedItem.classList.remove("selected");
    selectedItem.nextElementSibling.classList.add("selected");
  }
};

exports.addItem = (item, isNew = false) => {
  const itemNode = document.createElement("div");
  itemNode.setAttribute("class", "read-item");
  itemNode.setAttribute("data-url", item.url);
  itemNode.innerHTML = `
    <img src="${item.screenshot}" alt="${item.title}" />
    <p>${item.title}</p>
  `;
  items.appendChild(itemNode);
  itemNode.addEventListener("click", this.select);
  itemNode.addEventListener("dblclick", this.open);
  itemNode.addEventListener("keyup", (e) => e.key === "Enter" && this.open);
  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

this.storage.forEach((item) => this.addItem(item));
