const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');




function addItem(event){
    event.preventDefault();

    // user entered input
    let newItem = itemInput.value;

    if(newItem ===""){
        alert("Enter something");
        return;
    }




}



//event listeners
itemForm.addEventListener('submit', addItem);