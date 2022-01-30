import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  created_at = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updated_at = new Date();

  @Field(() => String)
  @Property({ type: "text" })
  title!: string;
}
