import Link from "next/link";
import { User } from "../typings/index";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineMenu, AiOutlineUserAdd } from "react-icons/ai";
import { FaAddressBook } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { IoIosCreate } from "react-icons/io";
import { ReactNode, useEffect, useState } from "react";

export interface NavbarProps {
  user?: User;
  removeLeftImage?: boolean;
}

interface LinksPropsObject {
  name: string | null;
  path: string | null;
  icon?: ReactNode;
}

interface LinksProps {
  data: LinksPropsObject[];
}

function Links({ data }: LinksProps) {
  return (
    <>
      {data.map((res, index) => {
        return (
          <li key={Math.random() * index}>
            <Link href={res.path as string} passHref>
              <button
                className="text-white hover:text-gray-300 space-x-1 text-[20px] font-semibold"
                style={{
                  display: `${res.icon ? "flex" : ""}`,
                  alignItems: `${res.icon ? "center" : ""}`,
                }}
              >
                {res.icon ? res.icon : null} <div>{res.name}</div>
              </button>
            </Link>
          </li>
        );
      })}
    </>
  );
}

export default function Navbar({ user, removeLeftImage }: NavbarProps) {
  const [hamburger, setHamburger] = useState(false);
  const [mobileAccountExpanded, setMobileAccountExpanded] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = hamburger ? "hidden" : "auto";
  }, [hamburger]);

  useEffect(() => {
    const handleResize = () => {
      setHamburger(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="absolute inset-x-0 top-0">
        <div className="flex justify-center items-center text-lg">
          <nav className="max-w-[150rem] bg-gray-700 flex justify-between p-5 mt-0 w-full z-[1]">
            <div className="flex items-center space-x-[32rem]">
              {removeLeftImage ? null : (
                <Link href={"/"} passHref>
                  <img
                    src={"/logo.png"}
                    alt="Logo"
                    height={50}
                    width={50}
                    className="rounded-full cursor-pointer"
                  />
                </Link>
              )}
              <ul className="ml-5 space-x-10 hidden lg:flex">
                <Links
                  data={[
                    {
                      name: "Community Blogs",
                      path: "/blogs",
                      icon: <FaAddressBook />,
                    },
                    {
                      name: "Create a blog",
                      path: "/blogs/create",
                      icon: <IoIosCreate />,
                    },
                  ]}
                />
              </ul>
            </div>
            <div className="items-center relative hidden lg:flex space-x-16">
              {!user ? (
                <Link href={"/account/signup"} passHref>
                  <button className="py-2 px-2 text-4xl text-white rounded-md flex flex-col items-center space-x-2 group ">
                    <AiOutlineUserAdd />
                  </button>
                </Link>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="py-2 px-2 text-white rounded-md flex items-center space-x-2">
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        height={48}
                        width={48}
                        className="rounded-full bg-transparent"
                      />
                      <div>
                        <Link href={`/users/${user._id}`}>
                          <p className="text-2xl hover:underline hover:underline-offset-1 cursor-pointer">
                            {user.username}
                          </p>
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={"/account/edit"} passHref>
                        <button className="py-2 px-2 bg-transparent border border-gray-300 text-gray-300 hover:bg-white hover:text-gray-400 rounded-md">
                          <FiEdit />
                        </button>
                      </Link>
                      <Link href={"/api/users/logout"} passHref>
                        <button className="py-2 px-2 bg-transparent border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white rounded-md">
                          <FiLogOut />
                        </button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div
              className="items-center relative flex lg:hidden cursor-pointer select-none text-gray-200"
              onClick={() => setHamburger(!hamburger)}
            >
              <AiOutlineMenu height="32px" width="32px" />
            </div>
          </nav>
          {hamburger && (
            <>
              <ul className="absolute flex flex-col space-y-1 bg-gray-800 dark:bg-dark-200 box-border w-screen h-screen z-[9999999] px-6 top-[74px]">
                <br />
                <Links
                  data={[
                    {
                      name: "Community Blogs",
                      path: "/blogs",
                      icon: <FaAddressBook />,
                    },
                    {
                      name: "Create a blog",
                      path: "/blogs/create",
                      icon: <IoIosCreate />,
                    },
                  ]}
                />
                <br />
                {user && (
                  <div className="mt-5 pt-5 border-t-[1px] border-gray-700">
                    <div
                      className="flex items-center justify-between w-full select-none"
                      onClick={() =>
                        setMobileAccountExpanded(!mobileAccountExpanded)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <div className="py-2 px-2 text-white rounded-md flex items-center space-x-2">
                          <img
                            src={user.avatar}
                            alt="User Avatar"
                            height={38}
                            width={38}
                            className="rounded-full bg-transparent"
                          />
                          <div>
                            <p>{user.username}</p>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Link href={"/account/edit"} passHref>
                            <button className="py-2 px-2 bg-transparent border border-gray-300 text-gray-300 hover:bg-white hover:text-gray-400 rounded-md">
                              <FiEdit />
                            </button>
                          </Link>
                          <Link href={"/api/users/logout"} passHref>
                            <button className="py-2 px-2 bg-transparent border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white rounded-md">
                              <FiLogOut />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!user && (
                  <div className="mt-5 pt-5 border-t-[2px] border-gray-700">
                    <div
                      className="flex items-center justify-between w-full select-none"
                      onClick={() =>
                        setMobileAccountExpanded(!mobileAccountExpanded)
                      }
                    >
                      <Link href={"/account/signup"} passHref>
                        <div className="flex items-center space-x-2">
                          <div className="text-white text-4xl">
                            <AiOutlineUserAdd />
                          </div>
                          <p className="text-gray-300 pt-4">
                            Create an account
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}
