import {IncomingMessage , ServerResponse} from "http"

import { getShoppingListItems , getShoppingListItemById , createShoppingListItem , updateShoppingListItem , deleteShoppingListItem } from "../controllers/shoppinglist";
//adding routes for shopping list items
export const shoppingListItemsRoute = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith('/shoppinglist/items')) {
    console.log(req.url,'Request received for all shopping list items');
    
    const items = getShoppingListItems();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(items));

  } else if (req.url?.startsWith('/shoppinglist/item/')) {
    const id = parseInt(req.url.split('/').pop() || '0');
    const item = getShoppingListItemById(id);
    if (item) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(item));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Item not found' }));
    }
  }
};