import { ObjectID } from "bson";
import clientPromise from "../../../../lib/mongodb";
import { withSessionApi } from "../../../../lib/session";

export default withSessionApi(async (req, res) => {
  if (req.method == "POST") {
    const client = await clientPromise;
    const db = client.db("Blogger").collection("blogs");

    const { id } = req.query;
    const old_data = await db.findOne({ _id: new ObjectID(id as string) });
    const new_data = await db.updateOne(
      {
        _id: new ObjectID(id as string),
      },
      {
        $inc: {
          views: +1,
        },
      }
    );

    res.status(200).send({ old_data, new_data });
  } else if (req.method !== "POST")
    return res.status(400).send({ message: "Method not allowed" });
});
