import clientPromise from "../../../lib/mongodb";
import { withSessionApi } from "../../../lib/session";

export default withSessionApi(async (req, res) => {
  const client = await clientPromise;
  const db = client.db("Blogger").collection("blogs");
  const blogs = await db.find({}).toArray();

  res
    .status(200)
    .send(
      blogs
        ? blogs.filter((blog) => blog.private_blog == null)
        : { message: `No blogs` }
    );
});
