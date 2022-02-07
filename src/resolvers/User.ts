import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

import { MyContext } from "../types";
import { User } from "../entities/User";
import { __COOKIE_NAME__, __EMAIL_REGEX__ } from "../constants";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field(() => String)
  field: string;

  @Field(() => String)
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: [FieldError];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    const user = await em.findOne(User, { email });
    console.log(user);
    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    console.log("hej bre hahaahah", options);

    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username length must be greater than 2",
          },
        ],
      };
    }
    if (!options.email.match(__EMAIL_REGEX__)) {
      return {
        errors: [{ field: "email", message: "Enter a valid email" }],
      };
    }

    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "Password length must be greater than 2",
          },
        ],
      };
    }

    const existingUser = await em.findOne(User, { username: options.username });
    if (existingUser) {
      return {
        errors: [
          {
            field: "username",
            message: "username is taken",
          },
        ],
      };
    }

    const hash = await argon2.hash(options.password);
    const user = em.create(User, { ...options, password: hash });
    await em.persistAndFlush(user);

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail", () => String) usernameOrEmail: string,
    @Arg("password", () => String) password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const query = usernameOrEmail.match(__EMAIL_REGEX__)
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail };
    const user = await em.findOne(User, query);

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "user does not exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(__COOKIE_NAME__);
        if (err) return resolve(err);
        resolve(true);
      })
    );
  }
}
