import { withSessionApi } from "../../../lib/session";
import clientPromise from "../../../lib/mongodb";

export default withSessionApi(async (req, res) => {
  if (req.method == "POST") {
    const password = req.headers["password"] as string;
    const username = req.headers["username"] as string;

    if (!password || !username)
      return res.status(400).send({
        message: "Invalid request headers",
      });

    const client = await clientPromise;
    const db = client.db("Blogger").collection("users");

    const data = await db.findOne({
      username,
      password,
    });

    if (!data)
      return res
        .status(404)
        .send({ message: "No user data found", status: 404 });

    if (data) {
      req.session.user = {
        username: data.username,
        avatar: data.avatar,
        token: data.token,
        blogs: data.blogs,
      };

      await req.session.save();
      res.status(200).send(data);
    }
  } else if (req.method != "POST")
    res.status(400).send({ message: "Method not allowed" });
});
