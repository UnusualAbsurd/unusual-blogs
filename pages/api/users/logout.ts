import { withSessionApi } from "../../../lib/session";

export default withSessionApi(async (req, res) => {
  await req.session.destroy();
  res.redirect("/");
});
