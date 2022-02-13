import { ObjectID } from "bson";
import clientPromise from "../../../../lib/mongodb";
import { withSessionApi } from "../../../../lib/session";

export default withSessionApi(async (req, res) => {
  if (req.method == "POST") {
    const client = await clientPromise;
    const db = client.db("Blogger").collection("blogs");
    const userdb = client.db("Blogger").collection("users");
    const blogdb = client.db("Blogger").collection("blogs");

    const user = await userdb.findOne({ token: req.headers.authorization });
    if (!user) return res.status(404).send({ message: "Unauthorized" });
    const blog = await blogdb.findOne({
      _id: new ObjectID(req.query.id as string),
    });
    if (!blog)
      return res.status(404).send({ message: "Couldn't find that blog" });

    if (blog && !user.blogs.includes(req.query.id))
      return res.status(403).send({ message: "Unauthorized" });

    const new_data = await db.deleteOne({
      _id: new ObjectID(blog._id),
    });

    res.status(200).send(new_data);
  } else if (req.method !== "POST")
    return res.status(400).send({ message: "Method not allowed" });
});
