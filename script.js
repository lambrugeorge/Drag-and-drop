// Select DOM elements
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// State variables
let updatedOnLoad = false;
let draggedItem;
let currentColumn;

// Initialize arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Get saved columns from localStorage, or set default values
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Update localStorage with arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Filter Arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null)
  return filteredArray;
}

// Create DOM elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  columnEl.appendChild(listEl);
}

// Update columns in DOM and reset HTML
function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
    updatedOnLoad = true;
  }

  // Clear and update each column
  [backlogList, progressList, completeList, onHoldList].forEach((list, i) => {
    list.textContent = '';
    [backlogListArray, progressListArray, completeListArray, onHoldListArray][i].forEach((item, index) => {
      createItemEl(list, i, item, index);
    });
  });

  // Update localStorage
  updateSavedColumns();
}

// backlogList
backlogList.textContent = '';
backlogListArray.forEach((backlogItem, index) => {
  createItemEl(backlogList, 0, backlogItem, index);
});

backlogListArray = filterArray(backlogListArray)


//Progress Column
progressList.textContent = '';
progressListArray.forEach((progressItem, index) => {
  createItemEl(progressList, 1, progressItem, index);
});
progressListArray = filterArray(backlogListArray)


//Complete Column
completeList.textContent = '';
completeListArray.forEach((completeItem, index) => {
  createItemEl((completeList, 2, completeItem, index));
});
completeListArray = filterArray(backlogListArray)

//On Hold Column
onHoldList.textContent = '';
onHoldListArray.forEach((onHoldItem, index) => {
  createItemEl(onHoldList, 3, onHoldItem, index);
})
onHoldListArray = filterArray(backlogListArray)

//Run getSavedColumns only once, update Local storage

updatedOnLoad = true;
updateSavedColumns();



// Update Item -Delete if necessary , or update array value
const updateItem=(id, column)=> {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!selectedColumnEl[id].textContent)  {
    delete selectedArray[id];
  }
  updateDOM();
}

//Add to Column List, Reset TextBox
const addToColumn=(column)=> {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}



//Show add item input box

const showInputBox=(column)=>{
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

//Hide Item Input  Box
const hideInputBox=(column)=> {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);

}

// Allows arrays to reflect Drag and Drop Items
const rebuildArrays=() => {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++){
    backlogListArray.push(backlogList.children[i].textContent)
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++){
    progressListArray.push(progressList.children[i].textContent)
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++){
    completeListArray.push(completeList.children[i].textContent)
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++){
    onHoldListArray.push(onHoldList.children[i].textContent)
  }
  updateDOM();
}

// Create DOM elements for each list item
const createItemEl(columnEl, column, item, index) {
  console.log('item', item);
  console.log('column', column);
  console.log('index', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)')
  listEl.isContentEditable = true;
  listEl.id = index;
  list.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
  //Append
  columnEl.appendChild(listEl)
}









// Drag functions
function drag(e) {
  draggedItem = e.target;
};

function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

function drop(e) {
  e.preventDefault();
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over')
  })
  //Add Item to Column
  const parent = listColumns[currentColumn]
  parent.appendChild(draggedItem);
  rebuildArrays();
}


// On load
updateDOM();
