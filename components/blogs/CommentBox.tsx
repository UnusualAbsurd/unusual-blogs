import { Blog, User } from "../../typings";
import { AiOutlineSend } from "react-icons/ai";
import { useEffect, useState } from "react";
import ms from "ms";
import axios from "axios";
import { stringify } from "querystring";

interface Props {
  blog: Blog;
  user?: User;
}

export default function CommentBox({ blog, user }: Props) {
  const [content, setContent] = useState<string>();
  const [currentComments, setCurrentComments] = useState(blog.comments);

  useEffect(() => setCurrentComments(blog.comments), [blog]);

  const comment = (origin: string) => {
    if (user && content) {
      axios.post(
        `${origin}/api/blogs/${blog._id}/comments`,
        stringify({
          user: JSON.stringify(user),
          content,
          date: new Date(Date.now()).toISOString(),
        })
      );

      currentComments?.push({
        user,
        content,
        date: new Date(Date.now()).toISOString(),
      });
    }
  };

  return (
    <>
      <div className="bg-gray-700 px-5 py-2 rounded-md">
        <h1 className="text-white text-2xl font-bold">{blog.title} Comments</h1>
        <br />
        <div className="flex flex-col space-y-2">
          {currentComments?.map((comment, index) => {
            if (!comment) return;
            return (
              <div
                className="flex items-center justify-between hover:bg-gray-800 py-1 rounded-md px-2 group"
                key={index + 1}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={comment.user.avatar}
                    alt="User Avatar"
                    width={35}
                    height={35}
                    className="flex rounded-full"
                  />
                  <div className="flex flex-col items-start   ">
                    <div className="flex items-center space-x-1">
                      <p className="text-lg text-white font-semibold">
                        {comment.user.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.date).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">{comment.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <br />
        {user && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="rounded-md outline-none overflow-auto py-1 w-[80rem]"
              maxLength={145}
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
            <button
              className="bg-gray-800 text-white rounded-md font-bold py-2 px-2 hover:bg-gray-900"
              onClick={(e) => {
                if (!content) return;
                comment(window.origin);
                setContent("");
              }}
            >
              <AiOutlineSend />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
