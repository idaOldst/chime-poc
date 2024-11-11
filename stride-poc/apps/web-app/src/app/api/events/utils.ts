let clients: ReadableStreamDefaultController[] = [];

// Utility functions to manage clients
export const addClient = (controller: ReadableStreamDefaultController) => clients.push(controller);
export const removeClient = (controller: ReadableStreamDefaultController) => clients = clients.filter(c => c !== controller);
export const getClients = () => clients;

// const clients: { [clientId: string]: ReadableStreamDefaultController } = {};

// export const addClient = (clientId: string, controller: ReadableStreamDefaultController) => {
//     clients[clientId] = controller;
// };

// export const removeClient = (clientId: string) => {
//     delete clients[clientId];
// };

// export const getClients = () => clients;