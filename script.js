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

//Complete Column
completeList.textContent = '';
completeListArray.forEach((completeItem, index) => {
  createItemEl((completeList, 0, completeItem, index));
});

//On Hold Column
onHoldList.textContent = '';
onHoldListArray.forEach((onHoldItem, index) => {
  createItemEl(onHoldList, 0, onHoldItem, index);
})

//Run getSavedColumns only once, update Local storage

updatedOnLoad = true;
updateSavedColumns();



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
