import { Post } from "./entities/post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

import { __DBUSER__, __DBPASSWORD__, __prod__ } from "./constants";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: "lireddit",
  user: __DBUSER__,
  ...(__prod__ ? { password: __DBPASSWORD__ } : {}),
  type: "postgresql",
  debug: !__prod__,
  replicas: [],
} as Parameters<typeof MikroORM.init>[0];
