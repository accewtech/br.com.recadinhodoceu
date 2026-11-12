import type { GetServerSideProps } from "next";
import { getSessionFromCookieHeader } from "../../src/shared/auth";
import MessageV1 from "../../src/v1/page";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");

  const session = getSessionFromCookieHeader(req.headers.cookie ?? null);
  if (!session) {
    return {
      redirect: {
        destination: "/login?returnTo=%2Fv1",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default MessageV1;
