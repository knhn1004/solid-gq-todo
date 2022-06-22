import { createServer } from '@graphql-yoga/node';

let todos = [
  {
    id: '1',
    text: 'Learn GraphQL + Solid',
    done: false,
  },
];

const typeDefs = `
	type Todo {
		id: ID!
		done: Boolean!
		text: String!
	}
	type Query {
		getTodos: [Todo]!
	}
`;

const resolvers = {
  Query: {
    getTodos: () => todos,
  },
};

const server = createServer({
  schema: { typeDefs, resolvers },
  cors: {
    origin: process.env.NODE_ENV === 'development' ? '*' : undefined,
  },
});

server.start();
