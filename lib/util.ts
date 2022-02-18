import { User } from "../typings";

export function micahAvatar(name: string) {
  return `https://avatars.dicebear.com/api/micah/${name}.png`;
}

export function oneDay(timestamp: number) {
  const unixTime = timestamp * 1000;
  const date = new Date(unixTime);
  return date.toLocaleDateString("en-US");
}
