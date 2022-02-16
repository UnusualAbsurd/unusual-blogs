import { withSessionSsr } from "../../lib/session";
import { User } from "../../typings";
import Container from "../../components/ui/Container";
import { useState } from "react";
import { NotificationManager } from "react-notifications";
import animations from "../../styles/animations.module.scss";
import Link from "next/link";

interface Props {
  user?: User;
}

export default function AccountLogin({ user }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function login(origin: string, username: string, password: string) {
    return fetch(`${origin}/api/users/login`, {
      method: "POST",
      headers: {
        username,
        password,
      },
    }).then((response) => {
      if (response.status == 404) return undefined;
      if (response.status == 200) return true;
    });
  }

  return (
    <>
      <Container user={user} title="Login">
        <div className="flex flex-col justify-center items-center mt-32 lg:mt-52 space-y-2">
          <div className="py-10 px-10 bg-white rounded-md">
            <div className="flex flex-col justify-center space-y-4 h-full">
              <h1 className="text-black font-semibold text-3xl">Login</h1>
              <div className="flex flex-col items-start space-y-2">
                <p>Username</p>
                <input
                  type="text"
                  name="username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-black rounded-md w-[15rem] h-8 font-semibold"
                  maxLength={20}
                  placeholder=" Enter your account username"
                />
              </div>
              <div className="flex flex-col items-start space-y-2">
                <p>Password</p>
                <input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-black rounded-md w-[15rem] h-8 font-semibold"
                  maxLength={20}
                  placeholder=" Enter your account password"
                />
              </div>
              <div className="flex items-center">
                <button
                  disabled={loading}
                  className="py-2 px-10 bg-gray-700 hover:bg-gray-800 text-white rounded-md flex justify-center items-center"
                  onClick={() => {
                    if (!username)
                      return NotificationManager.error(
                        `You need to provide a valid username`
                      );
                    if (!password)
                      return NotificationManager.error(
                        `You need to provide a valid password`
                      );

                    setLoading(true);
                    login(window.origin, username, password).then((status) => {
                      if (status == undefined) {
                        setLoading(false);
                        NotificationManager.error(`Couldn't find that account`);
                      }
                      if (status == true) {
                        NotificationManager.success(`Successfully logged in`);
                        setTimeout(() => location.replace("/"), 3000);
                      }
                    });
                  }}
                >
                  {loading ? (
                    <div className={animations.dot_pulse}></div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
              <Link href={"/account/signup"} passHref>
                <div className="text-xm text-[#3366bb] hover:text-[#0645ad] hover:underline hover:underline-offset-[1px] cursor-pointer">
                  {"Don't have an account? Sign Up!"}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export const getServerSideProps = withSessionSsr(async function LoginRoute({
  req,
}) {
  const { user } = req.session;

  if (user)
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };

  return {
    props: {},
  };
});
