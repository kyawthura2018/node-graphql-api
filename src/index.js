const express = require('express');
const http = require('http');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
require('./config');
const web3Connect = require('./utils/Web3');

const typeDefs = require('./types/typeDefs');
const resolvers = require('./resolvers/Resolvers');

const app = express();
const PORT = 4000;

//const api = new web3Connect();

const server = new ApolloServer({ typeDefs, resolvers });
app.use(cors());
server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, (err) => {
  if (err) throw err;
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});

// const express = require('express');
// const { createServer } = require('http');
// const { PubSub } = require('apollo-server');
// const { ApolloServer, gql } = require('apollo-server-express');

// const app = express();

// const pubsub = new PubSub();
// const MESSAGE_CREATED = 'MESSAGE_CREATED';

// const typeDefs = gql`
//   type Query {
//     messages: [Message!]!
//   }
//   type Subscription {
//     messageCreated: Message
//   }
//   type Message {
//     id: String
//     content: String
//   }
// `;

// const resolvers = {
//   Query: {
//     messages: () => [
//       { id: 0, content: 'Hello!' },
//       { id: 1, content: 'Bye!' }
//     ]
//   },
//   Subscription: {
//     messageCreated: {
//       subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED)
//     }
//   }
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers
// });

// server.applyMiddleware({ app, path: '/graphql' });

// const httpServer = createServer(app);
// server.installSubscriptionHandlers(httpServer);

// httpServer.listen({ port: 8000 }, () => {
//   console.log('Apollo Server on http://localhost:8000/graphql');
// });

// let id = 2;

// setInterval(() => {
//   pubsub.publish(MESSAGE_CREATED, {
//     messageCreated: { id, content: new Date().toString() }
//   });

//   id++;
// }, 1000);
