import { withSessionApi } from "../../../lib/session";
import { micahAvatar } from "../../../lib/util";
import { generate } from "rand-token";
import clientPromise from "../../../lib/mongodb";
import { simpleflake } from "simpleflakes";

export default withSessionApi(async (req, res) => {
  if (req.method == "POST") {
    const password = req.headers["password"] as string;
    const username = req.headers["username"] as string;
    const avatar = req.headers["avatar"] as string;

    if (!password || !username)
      return res.status(400).send({
        message: "Invalid request headers",
      });

    const new_avatar = micahAvatar(username);
    const new_token = generate(32);
    const client = await clientPromise;
    const db = client.db("Blogger").collection("users");

    const checkImage = async (url: string) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();

        return blob.type.startsWith("image/");
      } catch (e) {
        return false;
      }
    };

    const userId = simpleflake(
      Date.now(),
      23 - Math.round(Math.random() * 1000),
      Date.UTC(2000, 0, 1)
    );

    const new_user = await db.insertOne({
      username,
      password,
      avatar: (await checkImage(avatar)) == true ? avatar : new_avatar,
      token: new_token,
      blogs: [],
      id: userId.toString(),
    });

    req.session.user = {
      username,
      avatar: (await checkImage(avatar)) == true ? avatar : new_avatar,
      token: new_token,
      blogs: [],
      id: userId.toString(),
      friends: [],
    };

    await req.session.save();

    res.status(200).send(new_user);
  } else if (req.method != "POST")
    res.status(400).send({ message: "Method not allowed" });
});
