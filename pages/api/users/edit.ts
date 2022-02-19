import { withSessionApi } from "../../../lib/session";
import { micahAvatar } from "../../../lib/util";
import clientPromise from "../../../lib/mongodb";

export default withSessionApi(async (req, res) => {
  if (req.method == "POST") {
    const username = req.headers["username"] as string;
    const avatar = req.headers["avatar"] as string;

    if (!username)
      return res.status(400).send({
        message: "Invalid request headers",
      });

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

    const new_avatar =
      (await checkImage(avatar)) == true ? avatar : micahAvatar(username);

    const user = await db.findOne({ token: `${req.session.user?.token}` });
    if (!user)
      return res.status(404).send({ message: "Couldn't find that user" });

    const new_data = await db.updateOne(
      {
        token: req.session.user?.token,
      },
      {
        $set: {
          username,
          avatar: new_avatar,
        },
      }
    );

    req.session.user = {
      username,
      avatar: new_avatar,
      token: user.token,
      blogs: user.blogs,
      id: user.id,
      friends: user.friends,
    };

    await req.session.save();
    res.send(new_data);
  } else if (req.method != "POST")
    res.status(400).send({ message: "Method not allowed" });
});
