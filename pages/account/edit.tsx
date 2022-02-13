import { withSessionSsr } from "../../lib/session";
import { User } from "../../typings";
import Container from "../../components/ui/Container";
import { useState } from "react";
import { NotificationManager } from "react-notifications";
import animations from "../../styles/animations.module.scss";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

interface Props {
  user: User;
}

export default function AccountLogin({ user }: Props) {
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({
    maxWidth: 728,
  });

  function edit(origin: string, username: string, avatar: string) {
    return fetch(`${origin}/api/users/edit`, {
      method: "POST",
      headers: {
        username,
        avatar,
      },
    }).then((response) => {
      if (response.status !== 200) return undefined;
      if (response.status == 200) return true;
    });
  }

  return (
    <>
      <Container user={user} title="Login">
        {!isMobile && (
          <div className="flex flex-col justify-center items-center mt-32 lg:mt-52 space-y-2">
            <div className="py-10 px-10 bg-white rounded-md">
              <div className="flex flex-col justify-center space-y-4 h-full">
                <h1 className="text-black font-semibold text-3xl">
                  Edit Account
                </h1>
                <div className="flex flex-col items-start space-y-2">
                  <p>Username</p>
                  <input
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-black rounded-md w-[15rem] h-8 font-semibold"
                    maxLength={25}
                    defaultValue={user.username}
                    placeholder=" Enter your account username"
                  />
                </div>
                <div className="flex flex-col items-start space-y-2">
                  <p>Avatar URL</p>
                  <input
                    type="url"
                    onChange={(e) => setAvatar(e.target.value)}
                    className="border border-black rounded-md w-[25rem] h-8 font-semibold"
                    defaultValue={user.avatar}
                    placeholder=" Enter image url"
                  />
                </div>
                <div className="flex items-center">
                  <button
                    className="py-2 px-10 bg-gray-700 hover:bg-gray-800 text-white rounded-md flex justify-center items-center"
                    disabled={loading}
                    onClick={() => {
                      if (!username)
                        return NotificationManager.error(
                          `You need to provide a valid username to change`
                        );

                      setLoading(true);
                      edit(window.origin, username, avatar).then((res) => {
                        if (!res) {
                          setLoading(false);
                          NotificationManager.error(
                            `Failed to edit the user account`
                          );
                        }
                        if (res == true) {
                          NotificationManager.success(
                            `Successfully saved the changes`
                          );
                          setTimeout(() => location.replace("/"), 3000);
                        }
                      });
                    }}
                  >
                    {loading ? (
                      <div className={animations.dot_pulse}></div>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {isMobile && (
          <div className="flex flex-col justify-center items-center mt-32 lg:mt-52 space-y-2">
            <div className="py-10 px-16 bg-white rounded-md">
              <div className="flex flex-col justify-center space-y-4 h-full">
                <h1 className="text-black font-semibold text-3xl">
                  Edit Account
                </h1>
                <div className="flex flex-col items-start space-y-2">
                  <p>Username</p>
                  <input
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-black rounded-md w-[15rem] h-8 font-semibold"
                    maxLength={25}
                    defaultValue={user.username}
                    placeholder=" Enter your account username"
                  />
                </div>
                <div className="flex flex-col items-start space-y-2">
                  <p>Avatar URL</p>
                  <input
                    type="url"
                    onChange={(e) => setAvatar(e.target.value)}
                    className="border border-black rounded-md w-[15rem] h-8 font-semibold"
                    defaultValue={user.avatar}
                    placeholder=" Enter image url"
                  />
                </div>
                <div className="flex items-center">
                  <button
                    className="py-2 px-10 bg-gray-700 hover:bg-gray-800 text-white rounded-md flex justify-center items-center"
                    disabled={loading}
                    onClick={() => {
                      if (!username)
                        return NotificationManager.error(
                          `You need to provide a valid username to change`
                        );

                      setLoading(true);
                      edit(window.origin, username, avatar).then((res) => {
                        if (!res) {
                          setLoading(false);
                          NotificationManager.error(
                            `Failed to edit the user account`
                          );
                        }
                        if (res == true) {
                          NotificationManager.success(
                            `Successfully saved the changes`
                          );
                          setTimeout(() => location.replace("/"), 3000);
                        }
                      });
                    }}
                  >
                    {loading ? (
                      <div className={animations.dot_pulse}></div>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps = withSessionSsr(async function LoginRoute({
  req,
}) {
  const { user } = req.session;

  if (!user)
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };

  return {
    props: { user },
  };
});
