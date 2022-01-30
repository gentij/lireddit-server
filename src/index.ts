import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import dotenv from "dotenv";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

dotenv.config();

import { __PORT__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/Hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: "*",
    },
  });

  app.listen(__PORT__, () => {
    console.log(`server listening on port ${__PORT__}`);
  });
};

main().catch((err) => console.log(err));
