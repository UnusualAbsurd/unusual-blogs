import { Dispatch, SetStateAction, useState } from "react";
import Container from "../../../components/ui/Container";
import SearchBox from "../../../components/ui/SearchBox";
import clientPromise from "../../../lib/mongodb";
import { withSessionSsr } from "../../../lib/session";
import { DBUser, User } from "../../../typings";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { FaUserPlus } from "react-icons/fa";
import Confirm from "../../../components/ui/Confirm";
import { NotificationManager } from "react-notifications";
import axios from "axios";

interface Props {
  user: User;
  users: DBUser[];
}

export default function CommunityUsers({ user, users }: Props) {
  const [search, setSearch] = useState("");
  const [pickedUserId, setPickedUserId] = useState<{
    username: string;
    id: string;
  }>({ username: "", id: "" });
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

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
                            (account) =>
                              account.id !== user.id &&
                              (account.username
                                .toLowerCase()
                                .replace(/\s+/g, "")
                                .includes(
                                  search.toLowerCase().replace(/\s+/g, "")
                                ) ||
                                account.id == search)
                          )

                          .map((user) => (
                            <UserContainer
                              user={user}
                              key={user.id}
                              openModal={openModal}
                              setPicked={setPickedUserId}
                            />
                          ))
                      : users
                          .filter(
                            (account) =>
                              account.id !== user.id &&
                              (account.username
                                .toLowerCase()
                                .replace(/\s+/g, "")
                                .includes(
                                  search.toLowerCase().replace(/\s+/g, "")
                                ) ||
                                account.id == search)
                          )
                          .slice(0, 50)
                          .map((user) => (
                            <UserContainer
                              user={user}
                              key={user.id}
                              openModal={openModal}
                              setPicked={setPickedUserId}
                            />
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
                      (account) =>
                        account.id !== user.id &&
                        (account.username
                          .toLowerCase()
                          .replace(/\s+/g, "")
                          .includes(search.toLowerCase().replace(/\s+/g, "")) ||
                          account.id == search)
                    )
                    .map((user) => (
                      <UserContainer
                        user={user}
                        key={user.id}
                        openModal={openModal}
                        setPicked={setPickedUserId}
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
        <>
          <Confirm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={`Are you sure you want to friend ${pickedUserId.username} ?`}
            description=""
            onConfirm={(e) => {
              if (pickedUserId.id == user.id)
                return NotificationManager.error(`You cannot friend yourself`);
              axios(`/api/users/${user.id}/friends?friend=${pickedUserId.id}`, {
                method: "POST",
                headers: {
                  authorization: user.token,
                },
              }).then((response) => {
                if (response.status != 200)
                  return NotificationManager.error(response.data.message);
                else
                  NotificationManager.success(
                    "Successfully sent a friend request to " +
                      pickedUserId.username
                  );
              });
            }}
            onCancel={() => {}}
          />
        </>
      </Container>
    </>
  );
}

interface UserContainerProps {
  user: DBUser;
  openModal: () => any;
  setPicked: Dispatch<SetStateAction<{ username: string; id: string }>>;
}

function UserContainer({ user, openModal, setPicked }: UserContainerProps) {
  return (
    <>
      <div
        className="p-4 bg-gray-600 dark:bg-dark-100 rounded-md h-full w-[20rem] sm:w-[20rem] flex items-center space-x-5"
        onClick={() => {}}
      >
        <div className="flex items-center justify-between text-white w-full">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt="User Avatar"
                width="35"
                height="35"
                className="rounded-full"
              />

              <Link href={`/users/${user.id}`} passHref>
                <p className="text-white font-semibold hover:underline hover:underline-offset-1 cursor-pointer">
                  {user.username}
                </p>
              </Link>
            </div>
          </div>
          <FaUserPlus
            className="text-green-500 hover:text-green-600 cursor-pointer"
            onClick={() => {
              openModal();
              setPicked({
                username: user.username,
                id: user.id,
              });
            }}
          />
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
