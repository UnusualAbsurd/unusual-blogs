import { NextSeo } from "next-seo";
import Link from "next/link";

export default function FourOFour() {
  return (
    <>
      <NextSeo
        title="Not Found"
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/logo.png",
          },
        ]}
      />
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col items-center space-y-5">
          <h1 className="font-bold text-3xl text-white">Page not found</h1>
          <p className="font-semibold text-2xl text-gray-300">
            Looks like you have stepped into an empty cave.
          </p>
          <Link href={"/"} passHref>
            <button className="py-3 px-2 bg-gray-700 hover:bg-gray-800 rounded-md text-white">
              Go home
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
