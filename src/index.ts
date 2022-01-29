import { MikroORM } from "@mikro-orm/core";
import dotenv from "dotenv";
import { Post } from "./entities/post";
dotenv.config();

import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const posts = await orm.em.find(Post, {});
  console.log(posts);
};

main();
