import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { BsFillTrashFill } from "react-icons/bs";
import { FaShare } from "react-icons/fa";
import Container from "../../../components/ui/Container";
import { withSessionSsr } from "../../../lib/session";
import { Blog, DBUser, User } from "../../../typings";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkSlug from "remark-slug";
import remarkToc from "remark-toc";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { NotificationManager } from "react-notifications";
import clientPromise from "../../../lib/mongodb";
import Link from "next/link";

interface Props {
  user?: User;
  blog: Blog;
  // users: DBUser[];
  blogs: Blog[];
  author: DBUser;
}

export default function Blogs({ user, blog, author }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(`view-${id}`)) {
      axios.post(`${window.origin}/api/blogs/${id}/views`);
      localStorage.setItem(`view-${id}`, Date.now().toString());
    }
  }, [id]);

  function delete_blog(origin: string, id: string) {
    return fetch(`${origin}/api/blogs/${id}/delete`, {
      headers: {
        authorization: user?.token as string,
      },
      method: "POST",
    }).then((response) => {
      return response.status;
    });
  }

  return (
    <Container user={user} title="Community Blogs">
      <div className="flex justify-center items-center mt-32 lg:mt-52 space-y-2 text-white text-lg">
        <div className="flex flex-col items-center space-y-10">
          <div className="flex flex-col items-start space-y-3">
            <div className="space-y-2">
              <div>
                <h1 className="text-5xl font-semibold">{blog.title}</h1>
                <p className="text-gray-500 text-2xl">{blog.subtitle}</p>
              </div>
              <div className="flex items-center space-x-1">
                <img
                  src={author.avatar}
                  alt="User Avatar"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <p className="text-sm text-gray-200">{author.username}</p>
              </div>{" "}
            </div>
            <div className="flex items-center space-x-5">
              <p
                className="text-gray-500 text-xs cursor-pointer hover:underline hover:underline-offset-1 flex items-center space-x-1"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.origin}/blogs/${blog._id}`
                  );
                  NotificationManager.success(
                    `Successfully copied the link to your clipboard!`
                  );
                }}
              >
                <FaShare /> <div>Share</div>
              </p>
              {user?.blogs.includes(blog._id) && (
                <>
                  <Link href={`/blogs/${blog._id}/edit`}>
                    <p className="text-gray-500 text-xs cursor-pointer hover:underline hover:underline-offset-1 flex items-center space-x-1">
                      <FiEdit /> <div>Edit</div>
                    </p>
                  </Link>
                  <div>
                    <p
                      className="text-rose-500 text-xs cursor-pointer hover:underline hover:underline-offset-1 flex items-center space-x-1"
                      onClick={() => {
                        delete_blog(window.origin, blog._id).then((res) => {
                          if (res != 200)
                            return NotificationManager.error(
                              `Couldn't delete blog`
                            );
                          else {
                            NotificationManager.success(
                              `Successfully deleted the blog`
                            );
                            setTimeout(() => location.replace("/blogs"), 1500);
                          }
                        });
                      }}
                    >
                      <BsFillTrashFill /> <div>Delete</div>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-0">
            <ReactMarkdown
              remarkPlugins={[remarkSlug, remarkToc, remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: "h2",
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </Container>
  );
}

export const getServerSideProps = withSessionSsr(async function blogsRoute(
  req
) {
  const { user } = req.req.session;
  const { data } = await axios.get(`http://localhost:3000/api/blogs`);
  const { id } = req.query;
  const client = await clientPromise;
  const blog = data.find((blog: Blog) => blog._id == id);
  if (!blog)
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };

  const authordb = (
    await client.db("Blogger").collection("users").find({}).toArray()
  ).find((user) => user.blogs.includes(blog._id));

  const author = {
    username: authordb?.username,
    avatar: authordb?.avatar,
  };

  return {
    props: user ? { user, blog, author } : { blog, author },
  };
});
