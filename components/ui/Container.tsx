import { NextSeo } from "next-seo";
import { ReactNode } from "react";
import { User } from "../../typings/index";
import Navbar from "../Navbar";

export interface ContainerProps {
  title?: string;
  children: ReactNode;
  description?: string;
  user?: User;
}

export default function Container({
  title,
  children,

  user,
}: ContainerProps) {
  return (
    <>
      <NextSeo
        title={title + " | Unusual Blogs"}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/logo.png",
          },
        ]}
      />
      <div className="flex flex-col h-screen justify-between">
        <Navbar user={user} />
        <div className="flex justify-center mx-8">
          <div className="max-w-7xl relative w-full">{children}</div>
        </div>
      </div>
    </>
  );
}
