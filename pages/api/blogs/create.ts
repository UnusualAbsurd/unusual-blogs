import clientPromise from "../../../lib/mongodb";
import { withSessionApi } from "../../../lib/session";
import { Blog } from "../../../typings";

export default withSessionApi(async (req, res) => {
  if (req.method == "POST") {
    const client = await clientPromise;
    const db = client.db("Blogger").collection("blogs");
    const userdb = client.db("Blogger").collection("users");
    const user = await userdb.findOne({ token: req.headers.authorization });
    if (!user) return res.status(403).send({ message: "Unauthorized" });

    const { title, subtitle, content, private_blog }: Blog = req.body;

    if (!title) return res.status(400).send({ message: "Missing blog title" });
    if (!subtitle)
      return res.status(400).send({ message: "Missing blog subtitle" });
    if (!content)
      return res.status(400).send({ message: "Missing blog content" });

    const new_data = await db.insertOne({
      title,
      subtitle,
      content,
      private_blog: private_blog == true ? true : null,
      views: 0,
    });

    userdb.updateOne(
      {
        token: req.headers.authorization,
      },
      {
        $push: {
          blogs: `${new_data.insertedId}`,
        },
      }
    );

    res.status(200).send(new_data);
  } else if (req.method !== "POST")
    return res.status(400).send({ message: "Method not allowed" });
});
