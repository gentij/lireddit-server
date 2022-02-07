export const __prod__ = process.env.NODE_ENV === "production";
export const __DBUSER__ = process.env.DB_USER;
export const __DBPASSWORD__ = process.env.DB_PASSWORD;
export const __PORT__ = process.env.PORT;
export const __SESSION_SECRET__ = process.env.SESSION_SECRET!;
export const __COOKIE_NAME__ = "qid";
export const __EMAIL_REGEX__ =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
