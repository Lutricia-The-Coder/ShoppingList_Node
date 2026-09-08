import http , {IncomingMessage , ServerResponse} from 'http'
import { shoppingListItemsRoute } from './routes/shoppinglist';

//sprint 1
const PORT = 4000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    if(req.url?.startsWith('/items')) {
        shoppingListItemsRoute(req, res);
    } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
    }
};

//CREATING A NEW SERVER
const server = http.createServer(requestListener);
//LISTENING TO A SERVER 
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//vali

