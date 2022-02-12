import type { NextPage } from "next";
import Container from "../components/ui/Container";
import { withSessionSsr } from "../lib/session";
import { User } from "../typings";

type HomeProps = {
  user?: User;
};

const Home: NextPage<HomeProps> = ({ user }) => {
  return (
    <>
      <Container user={user} title="Home">
        {null}
      </Container>
    </>
  );
};

export const getServerSideProps = withSessionSsr(async function indexRoute({
  req,
}) {
  const { user } = req.session;

  return {
    props: user ? { user } : {},
  };
});

export default Home;
