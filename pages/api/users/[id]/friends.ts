import clientPromise from "../../../../lib/mongodb";
import { withSessionApi } from "../../../../lib/session";

export default withSessionApi(async (req, res) => {
  if (req.method == "POST") {
    const client = await clientPromise;
    const userdb = client.db("Blogger").collection("users");
    const user = await userdb.findOne({ token: req.headers.authorization });
    if (!user) return res.status(403).send({ message: "Unauthorized" });
    if (!req.query.friend)
      return res.status(400).send({ message: "Bad query request" });

    if (user.friends?.includes(req.query.friend))
      return res
        .status(201)
        .send({ message: "User already have that user as a friend" });

    const new_data = await userdb.updateOne(
      {
        id: req.session.user?.id,
      },
      {
        $set: {
          friends: user.friends?.length
            ? [...user.friends, req.query.friend]
            : [req.query.friend],
        },
      }
    );

    if (req.session.user) {
      const olduser = req.session.user;

      req.session.user = {
        username: olduser?.username,
        id: olduser.id,
        blogs: olduser.blogs,
        avatar: olduser.avatar,
        token: olduser.token,
        friends: user.friends?.length
          ? ([...user.friends, req.query.friend] as string[])
          : ([req.query.friend] as string[]),
      };
    }

    await req.session.save();

    res.status(200).send(new_data);
  } else if (req.method == "GET") {
    const client = await clientPromise;
    const userdb = client.db("Blogger").collection("users");
    const user = await userdb.findOne({ token: req.headers.authorization });
    if (!user) return res.status(403).send({ message: "Unauthorized" });

    return res.send(user.friends?.length ? user.friends : []);
  }
});
