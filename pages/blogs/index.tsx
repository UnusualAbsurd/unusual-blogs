import axios from "axios";
import { useEffect } from "react";
import { MiniPost } from "../../components/blogs/MiniPost";
import Container from "../../components/ui/Container";
import { withSessionSsr } from "../../lib/session";
import { Blog, DBUser, User } from "../../typings";
import { useMediaQuery } from "react-responsive";
import clientPromise from "../../lib/mongodb";

interface Props {
  user?: User;
  blogs: Blog[];
  users: DBUser[];
}

export default function Blogs({ user, blogs, users }: Props) {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Container user={user} title="Community Blogs">
      {!isMobile ? (
        <div className="flex flex-col justify-center items-center mt-32 lg:mt-52 space-y-2">
          <div className="bg-gray-900 px-5 rounded-md text-white flex flex-col items-center">
            <div className="flex flex-col items-center">
              <h1 className="text-5xl font-semibold">Top Community Blogs</h1>
            </div>
            <div className="mt-16 border-t-2 border-white flex flex-col items-center">
              <br />
              <div className="rounded-md grid grid-cols-3 gap-10">
                {blogs
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 9)
                  .map((blog, index) => {
                    return <MiniPost data={blog} users={users} key={index} />;
                  })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-32 lg:mt-52 space-y-2">
          <div className="bg-gray-900 px-5 rounded-md text-white flex flex-col items-center">
            <div className="flex flex-col items-center">
              <h1 className="text-5xl font-semibold">Top Community Blogs</h1>
            </div>
            <div className="mt-16 border-t-2 border-white flex flex-col items-center sm:space-y-10">
              <br />
              <div className="rounded-md space-y-1 grid sm:grid-cols-5 sm:gap-4">
                {blogs
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 9)
                  .map((blog, index) => {
                    return (
                      <>
                        <MiniPost data={blog} users={users} key={index} />
                        <br />
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
      <br />
    </Container>
  );
}

export const getServerSideProps = withSessionSsr(async function blogsRoute({
  req,
}) {
  const { user } = req.session;
  const { data: blogs } = await axios.get(`http://localhost:3000/api/blogs`);
  const client = await clientPromise;
  const users: object[] = [];

  await (
    await client.db("Blogger").collection("users").find({}).toArray()
  ).map((user) => {
    users.push({
      username: user.username,
      blogs: user.blogs,
    });
  });

  return {
    props: user ? { user, blogs, users } : { blogs, users },
  };
});
