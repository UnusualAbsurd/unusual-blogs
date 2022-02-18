import { useState } from "react";
import Container from "../../../components/ui/Container";
import SearchBox from "../../../components/ui/SearchBox";
import clientPromise from "../../../lib/mongodb";
import { withSessionSsr } from "../../../lib/session";
import { DBUser, User } from "../../../typings";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

interface Props {
  user?: User;
  users: DBUser[];
}

export default function CommunityUsers({ user, users }: Props) {
  const [search, setSearch] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 728 });

  return (
    <>
      <Container user={user} title="Community Users">
        <div className="flex justify-center items-center mt-32 lg:mt-52 space-x-4">
          <div className="flex flex-col items-center text-white space-y-3">
            <div className="flex flex-col items-center space-y-6">
              <h1 className="text-5xl text-white font-semibold">
                Find your friends
              </h1>

              <SearchBox
                setSearch={setSearch}
                placeholder="Input user id or username"
                boxSize="medium"
              />
            </div>
            {!isMobile && (
              <>
                <div className="w-[70rem] border border-t-[1px] border-gray-500"></div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="grid grid-cols-3 gap-5">
                    {search
                      ? users
                          .filter(
                            (user) =>
                              user.username
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              user.id == search
                          )
                          .map((user) => (
                            <UserContainer user={user} key={user.id} />
                          ))
                      : users
                          .slice(0, 50)
                          .map((user) => (
                            <UserContainer user={user} key={user.id} />
                          ))}
                  </div>
                </div>
              </>
            )}
            {isMobile && (
              <>
                <div className="w-[20rem] border border-t-[1px] border-gray-500"></div>
                <div className="flex flex-col items-center space-y-2">
                  {users
                    .filter(
                      (user) =>
                        user.username
                          .toLowerCase()
                          .includes(search.toLowerCase()) || user.id == search
                    )
                    .map((user) => (
                      <UserContainer user={user} key={user.id} />
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

interface UserContainerProps {
  user: DBUser;
}

function UserContainer({ user }: UserContainerProps) {
  return (
    <>
      <div
        className="p-4 bg-gray-600 dark:bg-dark-100 rounded-md h-full w-[20rem] sm:w-[20rem] flex items-center space-x-5 hover:bg-gray-700 cursor-pointer"
        onClick={() => {}}
      >
        <div className="flex items-end justify-start text-white">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt="User Avatar"
                width="35"
                height="35"
                className="rounded-full"
              />

              <p className="text-white font-semibold">{user.username}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withSessionSsr(async function indexRoute({
  req,
}) {
  const { user } = req.session;
  const users_db = await (
    await clientPromise
  )
    .db("Blogger")
    .collection("users")
    .find({}, { projection: { _id: 0 } })
    .toArray();
  const users = users_db;

  if (!user)
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };

  return {
    props: { user, users },
  };
});
