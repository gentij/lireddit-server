import { Post } from "./entities/post";
import { __DBUSER__, __DBPASSWORD__, __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: "lireddit",
  type: "postgresql",
  user: __DBUSER__,
  password: __DBPASSWORD__,
  debug: !__prod__,
  replicas: [],
} as Parameters<typeof MikroORM.init>[0];
