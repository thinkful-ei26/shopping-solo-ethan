/*eslint-env jquery*/
'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false, searched: false},
    {name: 'oranges', checked: false, searched: false},
    {name: 'milk', checked: true, searched: false},
    {name: 'bread', checked: false, searched: false},
    {name: 'apricot', checked: false, searched: false}
  ],
  hideCompleted: false,
  searchTerm: null
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
      </button><br><br>
      <form id="js-shopping-item-update">
        <label for="shopping-list-update">Update this item</label>
        <input type="text" name="shopping-list-update" class="js-shopping-list-update">
        <button type="submit">Update</button>
    </form>
    </div>
  </li>`;
}


function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

function renderShoppingList() {
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  if (STORE.searchTerm && STORE.hideCompleted){
    let searchedAndFilteredItems = STORE.items.filter(item => item.searched && !item.checked);
    $('.js-shopping-list').html(generateShoppingItemsString(searchedAndFilteredItems));
  } else if (STORE.hideCompleted){
    let newFilteredItems = STORE.items.filter(item => !item.checked);
    $('.js-shopping-list').html(generateShoppingItemsString(newFilteredItems));
  } else if (STORE.searchTerm){
    let searchedItems = STORE.items.filter(item => item.searched);
    $('.js-shopping-list').html(generateShoppingItemsString(searchedItems));
  } else {
    $('.js-shopping-list').html(shoppingListItemsString);
  } 
}
 

function addItemToShoppingList (itemName){
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event){
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });

}

function toggleCheckedForListItem(itemIndex) {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item).closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);

}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', function(event){
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItemFromStore (itemIndex){
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', function(event){
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItemFromStore(itemIndex);
    renderShoppingList();
  }); 
}

function toggleHideItems(){
  STORE.hideCompleted = !STORE.hideCompleted;
}

function handleItemToggle(){
  $('#js-completed-checkbox-form').click(function(){
    toggleHideItems();
    renderShoppingList();
  });
}

function searchForMatch(searchTerm){
  STORE.searchTerm = searchTerm;
  STORE.items.map(item => item.searched = false);
  STORE.items.filter(item => item.name.search(searchTerm) !== -1).map(item => item.searched = true);
}

function handleItemSearch(){
  $('#js-shopping-list-search').submit(function (event){
    event.preventDefault();
    const searchTerm = $('.js-shopping-search-entry').val();
    searchForMatch(searchTerm);  
    renderShoppingList();
  });
}

function clearSearchStatus(){
  STORE.searchTerm = null;
  STORE.items.map(item => item.searched = false);
}

function handleClearItemSearch(){
  $('#js-shopping-list-clear').click(function (){
    clearSearchStatus();
    renderShoppingList();
    $('.js-shopping-search-entry').val('');
  });
}

function updateItemInPlace(itemIndex, updatedTerm){
  STORE.items[itemIndex].name = updatedTerm;
  STORE.items[itemIndex].checked = false;
}

function handleUpdateItem(){
  $('ul').on('submit', '#js-shopping-item-update', function (event){
    event.preventDefault();
    const itemIndex = getItemIndexFromElement($(this));
    const updatedTerm = $(this).find('.js-shopping-list-update').val();
    updateItemInPlace(itemIndex, updatedTerm);
    $('.js-shopping-list-update').val('');
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleItemToggle();
  handleItemSearch();
  handleClearItemSearch();
  handleUpdateItem();
}

$(handleShoppingList);