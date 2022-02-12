import Container from "../../../components/ui/Container";
import { withSessionSsr } from "../../../lib/session";
import { User } from "../../../typings";
import Link from "next/link";
import { useState } from "react";
import animations from "../../../styles/animations.module.scss";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { NotificationManager } from "react-notifications";
import { stringify } from "querystring";
import axios from "axios";

interface Props {
  user: User;
}

export default function CreateBlog({ user }: Props) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
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
        `${origin}/api/blogs/create`,
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
        console.log(response.status);
        if (response.status !== 200) return undefined;
        if (response.status == 200) return response.data;
      });
  }

  return (
    <Container user={user} title="Create Blog">
      {!isMobile && (
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
                    <div>Create a blog</div>
                  </div>
                </div>
                <div className="text-lg text-black dark:text-white flex flex-col space-y-3">
                  Title
                  <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-black rounded-md w-[18rem] h-8 text-sm"
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
                  />
                </div>
                <div className="text-lg text-black flex flex-col space-y-3">
                  Content
                  <textarea
                    className="bg-white text-black placeholder-gray-500 p-3 outline-none text-sm rounded-md overflow-auto w-[53rem] border border-black"
                    onChange={(e) => setContent(e.target.value)}
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
                            "Failed to create the blog"
                          );
                        if (response) {
                          NotificationManager.success(
                            `Successfully created the blog`
                          );
                          setTimeout(() => {
                            location.replace(`/blogs/${response.insertedId}`);
                          }, 1500);
                        }
                      }
                    );
                  }}
                >
                  Create blog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                    <div>Create a blog</div>
                  </div>
                </div>
                <div className="text-lg text-black dark:text-white flex flex-col space-y-3">
                  Title
                  <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-black rounded-md w-[18rem] h-8 text-sm"
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
                  />
                </div>
                <div className="text-lg text-black flex flex-col space-y-3">
                  Content
                  <textarea
                    className="bg-white text-black placeholder-gray-500 p-3 outline-none text-sm rounded-md overflow-auto w-[18rem] h-[15rem] border border-black"
                    onChange={(e) => setContent(e.target.value)}
                  />
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
                            "Failed to create the blog"
                          );
                        if (response) {
                          NotificationManager.success(
                            `Successfully created the blog`
                          );
                          setTimeout(() => {
                            location.replace(`/blogs/${response.insertedId}`);
                          }, 1500);
                        }
                      }
                    );
                  }}
                >
                  Create blog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export const getServerSideProps = withSessionSsr(async function indexRoute({
  req,
}) {
  const { user } = req.session;
  if (!user)
    return {
      redirect: {
        destination: "/signup",
        permanent: true,
      },
    };

  return {
    props: user ? { user } : {},
  };
});
