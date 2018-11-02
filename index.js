/*eslint-env jquery*/
'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  hideCompleted: false,
};

function generateItemElement(item, itemIndex, template){
  return `
  <li class="js-item-index-element"
  data-item-index="${itemIndex}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
      </button>
    </div>
  </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item, index));


  return items.join('');
}

function renderShoppingList() {
  console.log('`renderShoppingList`');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  let filteredItems = [ ...STORE.items];
  if (STORE.hideCompleted){
    console.log('re-render ran');
    console.log(filteredItems);
    let newFilteredItems = filteredItems.filter(item => !item.checked);
    console.log(newFilteredItems);
    $('.js-shopping-list').html(generateShoppingItemsString(newFilteredItems));
    console.log('issue here');
  } 
  // insert that HTML into the DOM
  else {$('.js-shopping-list').html(shoppingListItemsString);}
}

function addItemToShoppingList (itemName){
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  // this function will be responsible for when users add a new shopping list item
  $('#js-shopping-list-form').submit(function(event){
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    console.log(newItemName);
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });

}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item).closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);

}

function handleItemCheckClicked() {
  // this function will be responsible for when users click the "check" button on
  // a shopping list item.
  $('.js-shopping-list').on('click', '.js-item-toggle', function(event){
    //console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItemFromStore (itemIndex){
  console.log('Deleting item at index ' + itemIndex);
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', function(event){
    //console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    deleteListItemFromStore(itemIndex);
    renderShoppingList();
  }); 
}

function toggleHideItems(){
  STORE.hideCompleted = !STORE.hideCompleted;
  console.log('toggler ran');
}

function handleItemToggle(){
  $('#js-completed-checkbox-form').click(function(){
    console.log('checkbox listener ran');
    toggleHideItems();
    renderShoppingList();
  });
}

//doc ready function
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleItemToggle();
}

$(handleShoppingList);