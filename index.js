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
  console.log('Generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item, index));


  return items.join('');
}

function renderShoppingList(matchedItem) {
  //console.log('`renderShoppingList`');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  let filteredItems = [ ...STORE.items];
  if (STORE.hideCompleted){
    let newFilteredItems = filteredItems.filter(item => !item.checked);
    console.log(newFilteredItems);
    $('.js-shopping-list').html(generateShoppingItemsString(newFilteredItems));
  } else if (STORE.searchTerm && matchedItem === -1){
    $('.js-shopping-list').html('');
    console.log('no match ran');
  } 
  else if (STORE.searchTerm){
    let searchedItems = STORE.items.filter(item => item.searched === true);
    console.log(searchedItems);
    // let MatchedItemsObject = STORE.items[matchedItem];
    // let MatchedItemsObjectIntoArray = [];
    // MatchedItemsObjectIntoArray.push(MatchedItemsObject);
    // console.log(MatchedItemsObject);
    // console.log('match ran');
    $('.js-shopping-list').html(generateShoppingItemsString(searchedItems));
  } 
  else {
    
    $('.js-shopping-list').html(shoppingListItemsString);
  } 
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
  // this function will be responsible for when users want to delete a shopping list
  // item
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
  console.log('search for match ran');
  console.log(STORE.searchTerm);
  // console.log(STORE.items[0].name);
  // console.log(Object.values(STORE.items[0]));
  // let valueArray = [];
  // for (let i = 0; i < STORE.items.length; i++){
  //   valueArray.push(Object.values(STORE.items[i]));
  // }
  // console.log(valueArray);
  // let namesFromArray = valueArray.map(item => item[0]);
  // console.log(namesFromArray);
  let valueMap = STORE.items.map(item => Object.values(item)[0]);
  console.log(valueMap);
  let searchedItems = valueMap.filter(item => item.search(searchTerm) !== -1);
  console.log(searchedItems);
  let indexArrayOfSearchedItems = [];
  for (let i = 0; i < searchedItems.length; i++){
    if (searchedItems[i] === valueMap[0] || searchedItems[i] === valueMap[1] || searchedItems[i] === valueMap[2] || searchedItems[i] === valueMap[3] || searchedItems[i] === valueMap[4]) {
      indexArrayOfSearchedItems.push((valueMap.indexOf(searchedItems[i])));
    }
  }
  console.log(indexArrayOfSearchedItems);
  //console.log(STORE.items[indexArrayOfSearchedItems[1]]);
  
  // for (let i = 0; i < indexArrayOfSearchedItems.length; i++){
  //   STORE.items[indexArrayOfSearchedItems[i]].searched = true;
  //   //console.log(indexArrayOfSearchedItems[i]); 
  // }

  for (let i = 0; i < STORE.items.length; i++){
    if (indexArrayOfSearchedItems.includes(STORE.items.indexOf(STORE.items[i]))){
      STORE.items[i].searched = true;
    } else {
      console.log(STORE.items[i]);
      STORE.items[i].searched = false;
    }
  }
  
  
  // STORE.items[0].searched = true;
  // for (let i = 0; i < STORE.items.length; i++){
  //   if (STORE.items.indexOf[i] === indexArrayOfSearchedItems[0] || STORE.items[i] === indexArrayOfSearchedItems[1]) {
  //     console.log(STORE.items[i]);
  //     STORE.items[i].searched = true;
  //   }
  // }
  console.log(STORE);


  // let indexArrayOfSearchedItems = STORE.items.map(item => Object.values(item)[0]).filter(element => searchedItems.includes(element));
  // console.log(indexArrayOfSearchedItems);
  // let nameArray = STORE.items.map(obj => obj.name);
  // let nameResult = STORE.items.map(obj => obj.name).filter(objName => objName.search(searchTerm) !== -1).join();
  // let matchedItem = nameArray.indexOf(nameResult);
  //console.log(nameResult);
  //console.log(matchedItem);
  //return matchedItem;

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

//doc ready function
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