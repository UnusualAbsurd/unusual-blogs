import redisConnect from "../../lib/redis";
import { withSessionApi } from "../../lib/session";

export default withSessionApi(async (req, res) => {
  const redis = redisConnect();
  const data = await redis.get("foo");
  if (data) return res.send(data);
  if (!data) {
    const set = await redis.set("foo", "bar");
    res.send(set);
  }
});
