import { User } from ".";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
