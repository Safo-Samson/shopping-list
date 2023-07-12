const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector(".btn");
const cancelBtn = document.querySelector(".cancelBtn");
const hideBtn = document.querySelector(".help");
const guide = document.querySelector(".guide");
let isEditMode = false;
// let isCancelBtnClicked = false;

function displayItems() {
	const itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach((item) => addItemToDOM(item));
	checkUI();
}

function onAddItemSubmit(e) {
	e.preventDefault();

	const newItem = itemInput.value;

	// Validate Input
	if (newItem.trim() === "") {
		alert("Please add an item");
		return;
	}

	// Check for edit mode
	if (isEditMode) {
		const itemToEdit = itemList.querySelector(".edit-mode");

		removeItemFromStorage(itemToEdit.textContent);
		itemToEdit.classList.remove("edit-mode");
		itemToEdit.remove();
		isEditMode = false;
	} else {
		if (checkIfItemExists(newItem)) {
			alert("That item already exists!");
			return;
		}
	}

	// Create item DOM element
	addItemToDOM(newItem);

	// Add item to local storage
	addItemToStorage(newItem);

	checkUI();

	itemInput.value = "";
}

function addItemToDOM(item) {
	// Create list item
	const li = document.createElement("li");
	li.appendChild(document.createTextNode(item));

	const button = createButton("remove-item btn-link text-red");
	li.appendChild(button);

	// Add li to the DOM
	itemList.appendChild(li);
}

function createButton(classes) {
	const button = document.createElement("button");
	button.className = classes;
	const icon = createIcon("fa-solid fa-xmark");
	button.appendChild(icon);
	return button;
}

function createIcon(classes) {
	const icon = document.createElement("i");
	icon.className = classes;
	return icon;
}

function addItemToStorage(item) {
	const itemsFromStorage = getItemsFromStorage();

	// Add new item to array
	itemsFromStorage.push(item);

	// Convert to JSON string and set to local storage
	localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
	let itemsFromStorage;

	if (localStorage.getItem("items") === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem("items"));
	}

	return itemsFromStorage;
}

function onClickItem(e) {
	if (e.target.parentElement.classList.contains("remove-item")) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		setItemToEdit(e.target);
	}
}

function checkIfItemExists(item) {
	const itemsFromStorage = getItemsFromStorage();
	return itemsFromStorage.includes(item);
}

//item to edit
function setItemToEdit(item) {
	// just making sure you dont select the ul itself
	if (item.tagName === "UL") {
		return;
	}

	isEditMode = true;

	itemList
		.querySelectorAll("li")
		.forEach((i) => i.classList.remove("edit-mode"));

	item.classList.add("edit-mode");
	itemFormOnFocus();
	formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Edit Item';

	//show cancel button
	cancelBtn.style.display = "block";

	formBtn.style.backgroundColor = "#228B22";
	itemInput.value = item.textContent;

	// Set focus to input by sending the cursor to the end of the text
	itemInput.focus();
	itemInput.setSelectionRange(itemInput.value.length, itemInput.value.length);
	// isCancelBtnClicked = false;
}

function removeItem(item) {
	if (confirm("Are you sure?")) {
		// Remove item from DOM
		item.remove();

		// Remove item from storage
		removeItemFromStorage(item.textContent);

		checkUI();
	}
}

function removeItemFromStorage(item) {
	let itemsFromStorage = getItemsFromStorage();

	// Filter out item to be removed
	itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

	// Re-set to localstorage
	localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems() {
	if (confirm("This will clear all items!")) {
		while (itemList.firstChild) {
			itemList.removeChild(itemList.firstChild);
		}

		// Clear from localStorage
		localStorage.removeItem("items");

		checkUI();
	}
}

function filterItems(e) {
	const items = itemList.querySelectorAll("li");
	const text = e.target.value.toLowerCase();

	items.forEach((item) => {
		const itemName = item.firstChild.textContent.toLowerCase();

		if (itemName.indexOf(text) != -1) {
			item.style.display = "flex";
		} else {
			item.style.display = "none";
		}
	});
}

//check UI function
function checkUI() {
	itemInput.value = "";

	const items = itemList.querySelectorAll("li");

	if (items.length === 0) {
		clearBtn.style.display = "none";
		itemFilter.style.display = "none";
	} else {
		clearBtn.style.display = "block";
		itemFilter.style.display = "block";
	}

	formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
	formBtn.style.backgroundColor = "#333";
	cancelBtn.style.display = "none";
	keepBrightnessAsItIs();

	isEditMode = false;
}

/********************************************************
 * My own functionality
 *******************************************************/
//brightness mode functionality
function keepBrightnessAsItIs() {
	if (document.body.style.backgroundColor == "black") {
		darkMode();
	} else {
		lightMode();
	}
}

function lightMode() {
	const allItems = document.querySelectorAll(".items li");
	document.body.style.backgroundColor = "white";
	document.querySelector("h1").style.color = "black";
	document.querySelector(".btn").style.backgroundColor = "black";
	document.querySelector(".btn").style.color = "white";

	//changing the color of the texts in the item
	allItems.forEach((item) => (item.style.color = "black"));
	document.getElementById("clear").style.color = "black";

	guideItem = document.querySelectorAll(".guide li");
	guideItem.forEach((item) => (item.style.color = "black"));
}

function darkMode() {
	const allItems = document.querySelectorAll(".items li");
	document.body.style.backgroundColor = " black";
	document.querySelector("h1").style.color = "white";
	document.querySelector(".btn").style.backgroundColor = "white";
	document.querySelector(".btn").style.color = "black";

	//changing the color of the texts in the item
	allItems.forEach((item) => (item.style.color = "white"));
	document.getElementById("clear").style.color = "white";

	guideItem = document.querySelectorAll(".guide li");
	guideItem.forEach((item) => (item.style.color = "white"));
}
function brightnessModeButton() {
	if (document.body.style.backgroundColor !== "white") {
		lightMode();
	} else {
		darkMode();
	}
}

// change brightness mode
let modeToggle = document.getElementById("mode-toggle");
modeToggle.addEventListener("click", brightnessModeButton);

// changing form outline color when in focus
const itemFormOnFocus = () => {
	itemInput.style.outlineColor = "#045a94";
	itemInput.style.outlineWidth = "2px";
	itemInput.style.outlineStyle = "solid";
};

const itemFormOnBlur = () => {
	itemInput.style.outline = "none";
};

itemInput.addEventListener("focus", itemFormOnFocus);
itemInput.addEventListener("blur", itemFormOnBlur);

//changing filter outline color when in focus
const itemFilterOnFocus = () => {
	itemFilter.style.outlineColor = "#045a94";
	itemFilter.style.outlineWidth = "2px";
	itemFilter.style.outlineStyle = "solid";
};

const itemFilterOnBlur = () => {
	itemFilter.style.outline = "none";
};

itemFilter.addEventListener("focus", itemFilterOnFocus);
itemFilter.addEventListener("blur", itemFilterOnBlur);

//add event listener to cancel button
const cancelBtnClicked = (e) => {
	e.preventDefault();
	// isCancelBtnClicked = true;
	itemInput.value = "";

	itemList
		.querySelectorAll("li")
		.forEach((i) => i.classList.remove("edit-mode"));

	formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
	cancelBtn.style.display = "none";
	formBtn.style.backgroundColor = "#333";
	keepBrightnessAsItIs();
	isEditMode = false;
};

cancelBtn.addEventListener("submit", cancelBtnClicked);

// hide the guide section
hideBtn.addEventListener("click", () => {
	if (guide.style.display === "none") {
		guide.style.display = "block";
	} else {
		guide.style.display = "none";
	}
});

// Initialize app
function init() {
	// Event Listeners
	itemForm.addEventListener("submit", onAddItemSubmit);
	itemForm.addEventListener("focus", itemFormOnFocus);
	itemList.addEventListener("click", onClickItem);
	itemInput.addEventListener("blur", itemFormOnBlur);
	clearBtn.addEventListener("click", clearItems);
	itemFilter.addEventListener("input", filterItems);
	//added event listener to cancel button
	cancelBtn.addEventListener("click", cancelBtnClicked);
	document.addEventListener("DOMContentLoaded", displayItems);

	checkUI();
}

init();
