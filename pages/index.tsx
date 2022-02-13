import type { NextPage } from "next";
import Container from "../components/ui/Container";
import { withSessionSsr } from "../lib/session";
import { User } from "../typings";
import Image from "next/image";

type HomeProps = {
  user?: User;
};

const Home: NextPage<HomeProps> = ({ user }) => {
  return (
    <>
      <Container user={user} title="Home">
        <div className="flex justify-center items-center mt-32 lg:mt-52 space-x-4">
          <div className="flex items-center space-x-10">
            <div className="flex flex-col items-start space-y-1">
              <h1 className="font-bold text-1xl text-white">Unusual Blogs</h1>
              <div className="text-lg text-gray-300">
                Unusual Blogs is a website where users can create a blog easily
                and share them to other users. You can create a blog with
                markdown and html syntax it is a user friendly website , and it
                is built with react.
              </div>
              <br />
              <div className="text-sm text-white">
                <ul className="flex flex-col items-center">
                  <li className="flex items-center space-x-2">
                    <p>Developer:</p>{" "}
                    <p className="text-blue-500 hover:underline hover:underline-offset-1 cursor-pointer">
                      UnusualAbsurd
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <Image
              src={"/boy-laptop.png"}
              alt="Logo"
              width={1024}
              height={512}
            />
          </div>
        </div>
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
