import http , {IncomingMessage , ServerResponse} from 'http'
import { shoppingListItemsRoute } from './routes/shoppinglist';
//sprint 1
const PORT = 4000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    if(req.url?.startsWith('/shoppinglist')) {
        shoppingListItemsRoute(req, res);
    } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello, World!' }));
    }
};

//CREATING A NEW SERVER
const server = http.createServer(requestListener);
//LISTENING TO A SERVER 
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//sprint 2 CRUD 

