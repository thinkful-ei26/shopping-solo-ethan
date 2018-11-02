/*eslint-env jquery*/
'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false},
    {name: 'apricot', checked: false}
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
  console.log('Generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

function renderShoppingList(indexArray) {
  //console.log('`renderShoppingList`');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  let filteredItems = [ ...STORE.items];
  if (STORE.hideCompleted){
    let newFilteredItems = filteredItems.filter(item => !item.checked);
    //console.log(newFilteredItems);
    $('.js-shopping-list').html(generateShoppingItemsString(newFilteredItems));
  } else if (STORE.searchTerm && indexArray.length === 0){
    $('.js-shopping-list').html('');
    console.log('no match ran');
  } else if (STORE.searchTerm){
    let searchedAndFound = STORE.items.filter(i => STORE.items[i] === indexArray[1]);
    console.log(searchedAndFound);

    let MatchedItemsObject = STORE.items[matchedItem];
    let MatchedItemsObjectIntoArray = [];
    console.log(MatchedItemsObjectIntoArray);
    //for (let i )
    MatchedItemsObjectIntoArray.push(MatchedItemsObject);
    console.log(MatchedItemsObject);
    console.log('match ran');
    $('.js-shopping-list').html(generateShoppingItemsString(MatchedItemsObjectIntoArray));
  } else {
    $('.js-shopping-list').html(shoppingListItemsString);
  } 
}
 

function addItemToShoppingList (itemName){
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
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
  $('.js-shopping-list').on('click', '.js-item-toggle', function(event){
    //console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    //console.log(itemIndex);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItemFromStore (itemIndex){
  console.log('Deleting item at index ' + itemIndex);
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', function(event){
    //console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    //console.log(itemIndex);
    deleteListItemFromStore(itemIndex);
    renderShoppingList();
  }); 
}

function toggleHideItems(){
  STORE.hideCompleted = !STORE.hideCompleted;
  //console.log('toggler ran');
}

function handleItemToggle(){
  $('#js-completed-checkbox-form').click(function(){
    console.log('checkbox listener ran');
    toggleHideItems();
    renderShoppingList();
  });
}

function searchForMatch(searchTerm){
  STORE.searchTerm = searchTerm;
  //console.log('search for match ran');
  let nameArray = STORE.items.map(obj => obj.name);
  let nameResult = STORE.items.map(obj => obj.name).filter(objName => objName.search(searchTerm) !== -1);//.join('');
  //let matchedItem = nameArray.indexOf(nameResult);
  let indexArray = [];
  for (let i = 0; i < nameResult.length; i++){
    indexArray.push(nameArray.indexOf(nameResult[i]));
  }
  console.log(nameResult);
  console.log(indexArray);
  //console.log(matchedItem);
  //return matchedItem;
  return indexArray;
}

function handleItemSearch(){
  $('#js-shopping-list-search').submit(function (event){
    event.preventDefault();
    const searchTerm = $('.js-shopping-search-entry').val();
    $('.js-shopping-search-entry').val('');
    const matchedItem = searchForMatch(searchTerm);  
    renderShoppingList(matchedItem);
  });
}

function handleUpdateItem(){
  $('ul').on('submit', '#js-shopping-item-update', function (event){
    event.preventDefault();
    const itemIndex = getItemIndexFromElement($(this));
    const updatedTerm = $(this).find('.js-shopping-list-update').val();
    deleteListItemFromStore(itemIndex);
    addItemToShoppingList(updatedTerm);
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
  handleUpdateItem();
}

$(handleShoppingList);