import { IncomingMessage, ServerResponse } from 'http';

import { getShoppingListItems,getShoppingListItemById,createShoppingListItem, updateShoppingListItem, deleteShoppingListItem
} from '../controllers/shoppinglist';

import { sendJson, sendError } from '../utils/response';

export const shoppingListItemsRoute = (req: IncomingMessage,res: ServerResponse
): void => {
  const url = req.url || '';
  if (url === '/items' && req.method === 'GET') {
    const items = getShoppingListItems();
    sendJson(res, 200, items);
    return;
  }
//post items
  if (url === '/items' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {

      try {
        const { name, quantity, status } = JSON.parse(body);
        // Validate required fields
        if ( name === undefined ||quantity === undefined || status === undefined ) {
          sendError(res, 400,'name, quantity and status are required' );
          return;
        }

        // Validate name
        if (typeof name !== 'string' || name.trim() === '') {
             sendError(res,400,'name must be a non-empty string');
          return;
        }

        // Validate quantity
        if (quantity !== undefined &&
          (typeof quantity !== 'number' ||quantity <= 0)) {
          sendError(  res, 400, 'quantity must be a number greater than 0'  );
          return;
        }

        // Validate status
        if (status !== undefined &&
          (status !== 'pending' && status !== 'completed')) {
          sendError( res,400,'status must be either pending or completed' );
          return;
        }

        const newItem = createShoppingListItem(name.trim(),quantity,status );
        sendJson(res, 201, newItem);
      } catch (error) {
        sendError( res,400,'Invalid JSON request body' );
      }
    });
    return;
  }
  // GET items by ID
  if (
    url.startsWith('/items/') &&
    req.method === 'GET'
  ) {
    const idString = url.split('/')[2];
    const id = Number(idString);

    if (!Number.isInteger(id) || id <= 0) {
      sendError(res, 400, 'Invalid item ID');
      return;
    }

    const item = getShoppingListItemById(id);

    if (!item) {
      sendError(res, 404, 'Item not found');
      return;
    }
    sendJson(res, 200, item);
    return; 
  }
  // put (update)
  if ( url.startsWith('/items/') && req.method === 'PUT') {
    const idString = url.split('/')[2];
    const id = Number(idString);

    if (!Number.isInteger(id) || id <= 0) {
      sendError(res, 400, 'Invalid item ID');
      return;
    }

    const existingItem = getShoppingListItemById(id);
    if (!existingItem) {
      sendError(res, 404, 'Item not found');
      return;
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
req.on('end', () => {
      try {
        const { name, quantity, status } = JSON.parse(body);
        if (name === undefined && quantity === undefined && status === undefined) {
          sendError(res, 400,'At least one field is required' ); return;
        }

        if(name !== undefined &&
          (typeof name !== 'string' || name.trim() === '')) {
          sendError(res,400,'name must be a non-empty string' );
          return;
        }

        if (quantity !== undefined &&
          (typeof quantity !== 'number' || quantity <= 0)) {
          sendError(res, 400,'quantity must be a number greater than 0');
          return;
        }

        if (status !== undefined &&
          (status !== 'pending' && status !== 'completed')) {
          sendError(res, 400,'status must be either pending or completed' );
          return;
        }

        const updatedItem = updateShoppingListItem(id,name?.trim(), quantity,status);
        sendJson(res, 200, updatedItem);
      } catch (error) {
 sendError(res, 400,  'Invalid JSON request body'  ); }
    });
    return;
  }
  // DELETE
  if (
    url.startsWith('/items/') &&
    req.method === 'DELETE'
  ) {
    const idString = url.split('/')[2];
    const id = Number(idString);

    if (!Number.isInteger(id) || id <= 0) {
      sendError(res, 400, 'Invalid item ID');
      return;
    }

    const deleted = deleteShoppingListItem(id);
    if (!deleted) {
      sendError(res, 404, 'Item not found');
      return;
    }

    // 204 = successfully deleted, no response body
    res.writeHead(204);
    res.end();
    return;
  }
  sendError(res, 404, 'Route not found');
};