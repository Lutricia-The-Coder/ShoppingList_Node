import { IncomingMessage, ServerResponse } from 'http';

import { getShoppingListItems, getShoppingListItemById, createShoppingListItem, updateShoppingListItem, deleteShoppingListItem
} from '../controllers/shoppinglist';

export const shoppingListItemsRoute = ( req: IncomingMessage,res: ServerResponse) => {

  const url = req.url || '';
  // GET 
  if (url === '/items' && req.method === 'GET') {
    const items = getShoppingListItems();
    res.writeHead(200, {'Content-Type': 'application/json' });
    res.end(JSON.stringify(items));
    return;
  }
  // POST ITEMS
  if (url === '/items' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const { name, quantity, status } = JSON.parse(body);

        // Validation 
        if (!name || quantity === undefined || !status) {
          res.writeHead(400, { 'Content-Type': 'application/json'  });
        res.end(JSON.stringify({ error: 'name, quantity and status are required' }));
          return;
        }

        //checking if the bname is  string
        if (typeof name !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'name must be a string'}));
          return;
        }
//checking if quantity is a number and greater than 0
        if (typeof quantity !== 'number' || quantity <= 0) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'quantity must be a number greater than 0'}));
          return;
        }
//making sue the status is updated to either pending or completed
        if (status !== 'pending' && status !== 'completed') {
          res.writeHead(400, {'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'status must be pending or completed' }));
          return;
        }

        const newItem = createShoppingListItem( name, quantity, status );
        res.writeHead(201, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(newItem));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({error: 'Invalid request body' }));
      }
    });
    return;
  }

  // GET /items/:id
  if (url.startsWith('/items/') && req.method === 'GET') {
    const idString = url.split('/')[2];
    const id = Number(idString);

    if (!Number.isInteger(id)) {
      res.writeHead(400, {'Content-Type': 'application/json'});
 res.end(JSON.stringify({ error: 'Invalid item ID'}));
      return;
    }

    const item = getShoppingListItemById(id);
    if (!item) {
      res.writeHead(404, { 'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({  error: 'Item not found' }));
      return;
    }
    res.writeHead(200, {'Content-Type': 'application/json' });
 res.end(JSON.stringify(item));
    return;
  }

  // PUT/item(update)
  //if the id entered is invalid 
  if (url.startsWith('/items/') && req.method === 'PUT') {
    const idString = url.split('/')[2];
    const id = Number(idString);

    if (!Number.isInteger(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json'  });
 res.end(JSON.stringify({error: 'Invalid item ID' }));
      return;
    }
//checking if item exists before updating it 
    const existingItem = getShoppingListItemById(id);
    if (!existingItem) {
     res.writeHead(404, {  'Content-Type': 'application/json'});
      res.end(JSON.stringify({  error: 'Item not found' }));
      return;
    }

    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const { name, quantity, status } = JSON.parse(body);
        if (!name || quantity === undefined || !status) {
          res.writeHead(400, { 'Content-Type': 'application/json'});
 res.end(JSON.stringify({error: 'name, quantity and status are required' }));
          return;
        }

        if (typeof name !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json'});
res.end(JSON.stringify({ error: 'name must be a string'}));
         return;
        }
        if (typeof quantity !== 'number' || quantity <= 0) {
          res.writeHead(400, {'Content-Type': 'application/json'});
res.end(JSON.stringify({ error: 'quantity must be a number greater than 0'}));
        return;
        }

        if (status !== 'pending' && status !== 'completed') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({  error: 'status must be pending or completed'}));
          return;
        }

        const updatedItem = updateShoppingListItem(id, name,quantity, status);
        res.writeHead(200, {'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedItem));
      } catch (error) {
        res.writeHead(400, {'Content-Type': 'application/json'});
 res.end(JSON.stringify({ error: 'Invalid request body'})); }});
    return;
  }
  // DELETE /items/:id
  if (url.startsWith('/items/') && req.method === 'DELETE') {
    const idString = url.split('/')[2];
    const id = Number(idString);
    if (!Number.isInteger(id)) {
   res.writeHead(400, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({ error: 'Invalid item ID'})); return;
    }

    const deleted = deleteShoppingListItem(id);
    if (!deleted) {
      res.writeHead(404, {  'Content-Type': 'application/json' }); 
      res.end(JSON.stringify({  error: 'Item not found'}));
      return; 
     }res.writeHead(204);
    res.end();
    return;
  }
  // when Route not found
  res.writeHead(404, { 'Content-Type': 'application/json'});
res.end(JSON.stringify({ error: 'Route not found' }));
};