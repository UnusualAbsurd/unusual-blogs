import { ObjectID } from "bson";
import clientPromise from "../../../../lib/mongodb";
import { withSessionApi } from "../../../../lib/session";

export default withSessionApi(async (req, res) => {
  if (req.method == "POST") {
    const client = await clientPromise;
    const db = client.db("Blogger").collection("blogs");

    const { id } = req.query;
    const { user, avatar, content, date } = req.body;
    const old_data = await db.findOne({ _id: new ObjectID(id as string) });

    let new_data: any;

    if (old_data?.comments) {
      new_data = await db.updateOne(
        {
          _id: new ObjectID(id as string),
        },
        {
          $push: {
            comments: { user: JSON.parse(user), avatar, content, date },
          },
        }
      );
    } else {
      new_data = await db.updateOne(
        {
          _id: new ObjectID(id as string),
        },
        {
          $set: {
            comments: [{ user: JSON.parse(user), avatar, content, date }],
          },
        }
      );
    }

    res.send(new_data);
  } else if (req.method !== "POST")
    return res.status(400).send({ message: "Method not allowed" });
});
