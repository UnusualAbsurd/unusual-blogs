import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Container from "../../../components/ui/Container";
import { withSessionSsr } from "../../../lib/session";
import { Blog, User } from "../../../typings";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkSlug from "remark-slug";
import remarkToc from "remark-toc";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface Props {
  user?: User;
  blog: Blog;
}

export default function Blogs({ user, blog }: Props) {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!localStorage.getItem(`view-${id}`)) {
      axios.post(`${window.origin}/api/blogs/${id}/views`);
      localStorage.setItem(`view-${id}`, Date.now().toString());
    }
  }, [id]);

  return (
    <Container user={user} title="Community Blogs">
      <div className="flex flex-col justify-center items-center mt-32 lg:mt-52 space-y-2 text-white text-lg">
        <ReactMarkdown
          remarkPlugins={[remarkSlug, remarkToc, remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: "h2",
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
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
    </Container>
  );
}

export const getServerSideProps = withSessionSsr(async function blogsRoute(
  req
) {
  const { user } = req.req.session;
  const { data } = await axios.get(`http://localhost:3000/api/blogs`);
  const { id } = req.query;
  const blog = data.find((blog: Blog) => blog._id == id);
  if (!blog)
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };

  return {
    props: user ? { user, blog } : { blog },
  };
});
