const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const { TODOS, Users } = require("./todos");
const { expressMiddleware } = require("@apollo/server/express4");

async function startserver() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    const typeDefs = `
        type User {
            id: ID!
            name: String
            username: String
            email: String
        }

        type Todo {
            id: ID!
            name: String
            completed: Boolean
            title: String
            user: User
        }

        type Query {
            getTodos: [Todo]
            getUsers: [User]
            getUser(id: ID!): User  # ✅ Fix: Added id argument
        }
    `;

    const resolvers = {
        Query: {
            getTodos: () => TODOS,
            getUsers: () => Users,
            getUser: (parent, { id }) => Users.find((e) => e.id == id.toString()),
        },
        Todo: {
            user: (todo) => Users.find((e) => e.id === todo.userId),
        },
    };

    const server = new ApolloServer({ typeDefs, resolvers });

    await server.start();
    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, () => {
        console.log("Server Running on port 8000...");
    });
}

startserver();
