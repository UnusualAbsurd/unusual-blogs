import { ObjectID } from "bson";
import { ImEye, ImDrawer } from "react-icons/im";
import Container from "../../components/ui/Container";
import clientPromise from "../../lib/mongodb";
import { withSessionSsr } from "../../lib/session";
import { Blog, DBUser, User } from "../../typings";
import Link from "next/link";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";

interface Props {
  user?: User;
  account: DBUser;
  blogs: Blog[];
}

export default function UserPage({ user, account, blogs }: Props) {
  const isMobile = useMediaQuery({ maxWidth: 728 });
  //   const [views, setViews] = useState(0);

  //   useEffect(() => {
  //     blogs.map((blog) => blog.views).reduce()
  //   }, [])

  return (
    <>
      <Container user={user} title={account.username}>
        <div className="flex justify-center items-center mt-32 lg:mt-52 space-x-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={account.avatar}
                alt="User Avatar"
                width={68}
                height={68}
                className="rounded-full"
              />
              <div className="flex flex-col items-start">
                <h1 className="text-white font-bold text-4xl">
                  {account.username}
                </h1>
                <p className="text-gray-400 flex items-center space-x-1">
                  <ImDrawer /> <p>Total Blogs: {blogs.length}</p>
                </p>
                <p className="text-gray-400 flex items-center space-x-1">
                  <ImEye />{" "}
                  <p>
                    Total Views:{" "}
                    {blogs.map((blog) => blog.views).reduce((a, b) => a + b, 0)}
                  </p>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <h2 className="text-lg text-white font-semibold">Blogs</h2>
              {!isMobile ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    {blogs.map((blog) => (
                      <UserPost author={account} blog={blog} key={blog._id} />
                    ))}
                  </div>
                  <br />
                </>
              ) : (
                <>
                  <ul className="space-y-5">
                    {blogs.map((blog) => (
                      <UserPost author={account} blog={blog} key={blog._id} />
                    ))}
                  </ul>
                  <br />
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export const getServerSideProps = withSessionSsr(async function userRoute(req) {
  const { user } = req.req.session;

  const db = (await clientPromise).db("Blogger");
  const users = await db.collection("users").find({}).toArray();
  const db_account = await users.find((user) => user.id == req.query.id);
  if (!db_account)
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };

  const account = {
    username: db_account.username,
    avatar: db_account.avatar,
    blogs: db_account.blogs,
    id: db_account.id,
  };

  const blog_data = (await db.collection("blogs").find({}).toArray()).filter(
    (blog) => db_account.blogs.includes(blog._id.toString())
  );
  const blogs: object[] = [];
  blog_data.forEach((blog) => {
    blogs.push({
      title: blog.title,
      _id: blog._id.toString(),
      subtitle: blog.subtitle,
      views: blog.views,
    });
  });

  return {
    props: {
      account,
      user: user ? user : null,
      blogs: blogs ? blogs : null,
    },
  };
});

interface UserPostProps {
  blog: Blog;
  author: DBUser;
}

function UserPost({ blog, author }: UserPostProps) {
  return (
    <div
      className={clsx(
        "p-4 bg-gray-700 dark:bg-dark-100 rounded-md h-full w-[20rem] sm:w-[20rem]"
      )}
    >
      <div className="flex flex-col justify-between space-y-4 h-full">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <div
              className={clsx(
                "flex items-center font-montserrat font-bold text-white",
                blog.title.length > 25
                  ? "text-md leading-1"
                  : blog.title.length > 15
                  ? "text-xl"
                  : "text-2xl leading-2"
              )}
            >
              <div>{blog.title}</div>
            </div>
            <div className="text-sm text-gray-300">
              Written by {author.username}
            </div>
          </div>
          <div className="text-sm text-white dark:text-white flex flex-col space-y-3">
            {blog.subtitle}
            <p className="text-xs text-gray-400 flex items-center space-x-1">
              <ImEye color="rgb(156 163 175)" /> <div>{blog.views}</div>
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Link href={`/blogs/${blog._id}`} passHref>
            <button className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-transparent hover:border hover:border-gray-600">
              Read Blog
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
