import clsx from "clsx";
import Link from "next/link";
import { User, Blog, DBUser } from "../../typings/index";
import { ImEye } from "react-icons/im";

interface Props {
  data: Blog;
  users?: DBUser[];
}

export function MiniPost({ data, users }: Props) {
  return (
    <>
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
                  data.title.length > 25
                    ? "text-md leading-1"
                    : data.title.length > 15
                    ? "text-xl"
                    : "text-2xl leading-2"
                )}
              >
                <div>{data.title}</div>
              </div>
              <div className="text-sm text-gray-300">
                Written by{" "}
                {users?.find((user) => user.blogs.includes(data._id))?.username}
              </div>
            </div>
            <div className="text-sm text-white dark:text-white flex flex-col space-y-3">
              {data.subtitle}
              <p className="text-xs text-gray-400 flex items-center space-x-1">
                <ImEye color="rgb(156 163 175)" /> <div>{data.views}</div>
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Link href={`/blogs/${data._id}`} passHref>
              <button className="px-3 py-2 bg-gray-600 rounded-md hover:bg-transparent hover:border hover:border-gray-600">
                Read Blog
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
