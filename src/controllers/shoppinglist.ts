import {ShoppingListItem} from '../types/shoppinglist';

let shoppingListsItems: ShoppingListItem[] = [];
let currentId = 1;

//getting all items in the shopping list
export const getShoppingListItems= (): ShoppingListItem[] => {
  return shoppingListsItems;
};


//getiing item by id
export const getShoppingListItemById = (id: number): ShoppingListItem | undefined => {
  return shoppingListsItems.find((item) => item.id === id);
}

//creating a new item in the shopping list
export const createShoppingListItem = (name: string, quantity: number, status: 'pending' | 'completed'): ShoppingListItem => {
  const newItem: ShoppingListItem = {id: currentId++,name, quantity, status
  };
  shoppingListsItems.push(newItem);
  return newItem;
};

//updating an item in the shopping list
export const updateShoppingListItem = (id: number, name: string, quantity: number, status: 'pending' | 'completed'): ShoppingListItem | undefined => {
  const itemIndex = shoppingListsItems.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    shoppingListsItems[itemIndex] = { ...shoppingListsItems[itemIndex], name, quantity, status };
    return shoppingListsItems[itemIndex];
  }
  return undefined;
};

//deleting an item in the shopping list
export const deleteShoppingListItem = (id: number): boolean => {
  const itemIndex = shoppingListsItems.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    shoppingListsItems.splice(itemIndex, 1);
    return true;
  }
  return false;
};
