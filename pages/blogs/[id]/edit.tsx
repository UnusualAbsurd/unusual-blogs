import Container from "../../../components/ui/Container";
import { withSessionSsr } from "../../../lib/session";
import { User, Blog } from "../../../typings";
import { useRouter } from "next/router";
import { useState } from "react";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { NotificationManager } from "react-notifications";
import { stringify } from "querystring";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkSlug from "remark-slug";
import remarkToc from "remark-toc";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface Props {
  user: User;
  blog: Blog;
}

export default function CreateBlog({ user, blog }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(blog.title);
  const [subtitle, setSubtitle] = useState(blog.subtitle);
  const [content, setContent] = useState(blog.content);
  const [markdown, setMarkdown] = useState(blog.content);
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery({
    maxWidth: 728,
  });

  function create(
    origin: string,
    title: string,
    subtitle: string,
    content: string
  ) {
    return axios
      .post(
        `${origin}/api/blogs/${blog._id}/edit`,
        stringify({
          title,
          subtitle,
          content,
        }),
        {
          method: "POST",
          headers: {
            authorization: user.token,
          },
        }
      )
      .then(async (response) => {
        if (response.status !== 200) return undefined;
        if (response.status == 200) return response.data;
      });
  }

  return (
    <Container user={user} title="Edit Blog">
      {!isMobile && (
        <div className="flex justify-center items-center mt-32 lg:mt-52 space-x-4">
          <div
            className={clsx(
              "p-4 bg-white rounded-md h-full w-[20rem] sm:w-[50rem]"
            )}
          >
            <div className="flex flex-col justify-between space-y-4 h-full">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col">
                  <div
                    className={clsx(
                      "flex items-center font-montserrat font-bold text-black text-lg"
                    )}
                  >
                    <div>Edit blog</div>
                  </div>
                </div>
                <div className="text-lg text-black dark:text-white flex flex-col space-y-3">
                  Title
                  <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-black rounded-md w-[18rem] h-8 text-sm"
                    maxLength={35}
                    defaultValue={blog.title}
                    placeholder="Blog title"
                  />
                </div>
                <div className="text-lg text-black dark:text-white flex flex-col space-y-3">
                  Subtitle
                  <input
                    type="text"
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="border border-black rounded-md w-[18rem] h-8 text-sm"
                    placeholder="Blog subtitle"
                    defaultValue={blog.subtitle}
                  />
                </div>
                <div className="text-lg text-black flex flex-col space-y-3 group">
                  <div className="flex items-center space-x-2">
                    Content <div></div>
                    <p className="font-semibold">
                      {"[ Markdown and HTML Support ]"}
                    </p>
                  </div>
                  <textarea
                    className="bg-white text-black placeholder-gray-500 p-3 outline-none text-sm rounded-md overflow-auto w-[48rem] h-[10rem] border border-black"
                    onChange={(e) => {
                      setContent(e.target.value);
                      setMarkdown(e.target.value);
                    }}
                    defaultValue={blog.content}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  className="px-3 py-2 bg-gray-600 rounded-md hover:bg-transparent hover:bg-gray-700 text-white"
                  onClick={() => {
                    if (!title)
                      return NotificationManager.error(`Missing blog title`);
                    if (!subtitle)
                      return NotificationManager.error(`Missing blog subtitle`);
                    if (!content)
                      return NotificationManager.error(`Missing blog content`);

                    setLoading(true);
                    create(window.origin, title, subtitle, content).then(
                      (response) => {
                        if (!response)
                          return NotificationManager.error(
                            "Failed to edit the blog"
                          );
                        if (response) {
                          NotificationManager.success(
                            `Successfully edited the blog`
                          );
                          setTimeout(() => {
                            location.replace(`/blogs/${router.query.id}`);
                          }, 1500);
                        }
                      }
                    );
                  }}
                >
                  Edit blog
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="text-lg text-black p-4 bg-white rounded-md h-full w-[20rem] sm:w-[42rem] flex flex-col space-y-3 group">
              <div className="flex justify-center items-center">
                <p className="font-bold">Preview</p>
              </div>

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
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
      {
        // MOBILE
      }
      {isMobile && (
        <div className="flex flex-col justify-center items-center mt-32 lg:mt-52 space-y-2">
          <div
            className={clsx(
              "p-4 bg-white rounded-md h-full w-[20rem] sm:w-[55rem]"
            )}
          >
            <div className="flex flex-col justify-between space-y-4 h-full">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col">
                  <div
                    className={clsx(
                      "flex items-center font-montserrat font-bold text-black text-lg"
                    )}
                  >
                    <div>Edit blog</div>
                  </div>
                </div>
                <div className="text-lg text-black dark:text-white flex flex-col space-y-3">
                  Title
                  <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-black rounded-md w-[18rem] h-8 text-sm"
                    maxLength={35}
                    placeholder="Blog title"
                    defaultValue={blog.title}
                  />
                </div>
                <div className="text-lg text-black dark:text-white flex flex-col space-y-3">
                  Subtitle
                  <input
                    type="text"
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="border border-black rounded-md w-[18rem] h-8 text-sm"
                    placeholder="Blog subtitle"
                    defaultValue={blog.subtitle}
                  />
                </div>
                <div className="text-lg text-black flex flex-col space-y-3">
                  Content
                  <textarea
                    className="bg-white text-black placeholder-gray-500 p-3 outline-none text-sm rounded-md overflow-auto w-[18rem] h-[15rem] border border-black"
                    onChange={(e) => {
                      setContent(e.target.value);
                      setMarkdown(e.target.value);
                    }}
                    defaultValue={blog.content}
                  />
                </div>
              </div>
              <div className="text-lg text-black flex flex-col space-y-3 group">
                <p className="font-bold">Preview</p>

                <div className="border ">
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
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  className="px-3 py-2 bg-gray-600 rounded-md hover:bg-transparent hover:border hover:border-gray-600 text-white"
                  onClick={() => {
                    if (!title)
                      return NotificationManager.error(`Missing blog title`);
                    if (!subtitle)
                      return NotificationManager.error(`Missing blog subtitle`);
                    if (!content)
                      return NotificationManager.error(`Missing blog content`);

                    setLoading(true);
                    create(window.origin, title, subtitle, content).then(
                      (response) => {
                        if (!response)
                          return NotificationManager.error(
                            "Failed to edit the blog"
                          );
                        if (response) {
                          NotificationManager.success(
                            `Successfully edited the blog`
                          );
                          setTimeout(() => {
                            location.replace(`/blogs/${router.query.id}`);
                          }, 1500);
                        }
                      }
                    );
                  }}
                >
                  Edit blog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export const getServerSideProps = withSessionSsr(async function indexRoute(
  req
) {
  const { user } = req.req.session;
  if (!user)
    return {
      redirect: {
        destination: "/signup",
        permanent: true,
      },
    };

  const { data } = await axios.get(`http://localhost:3000/api/blogs`);
  const blog = data.find((blog: any) => blog._id == req.query.id);
  if (!blog || !user.blogs.includes(blog._id))
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };

  return {
    props: user ? { user, blog } : {},
  };
});
