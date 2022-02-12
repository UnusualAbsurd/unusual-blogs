import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Container from "../../../components/ui/Container";
import { withSessionSsr } from "../../../lib/session";
import { Blog, User } from "../../../typings";

interface Props {
  user?: User;
  blog: Blog;
}

export default function Blogs({ user, blog }: Props) {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!localStorage.getItem(`view-${id}`)) {
      axios.post(`${window.origin}/api/blogs/${id}/views`);
      localStorage.setItem(`view-${id}`, Date.now().toString());
    }
  }, [id]);

  return (
    <Container user={user} title="Community Blogs">
      {null}
    </Container>
  );
}

export const getServerSideProps = withSessionSsr(async function blogsRoute(
  req
) {
  const { user } = req.req.session;
  const { data } = await axios.get(`http://localhost:3000/api/blogs`);
  const { id } = req.query;
  const blog = data.find((blog: Blog) => blog._id == id);
  if (!blog)
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };

  return {
    props: user ? { user, blog } : { blog },
  };
});
