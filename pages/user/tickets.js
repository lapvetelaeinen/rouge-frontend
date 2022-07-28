import { useSession, getSession, signOut, signIn } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <h1>Du måste vara inloggad för att se dina biljetter.</h1>
        <button onClick={signIn}>Logga in</button>
      </>
    );
  }

  return (
    <>
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
      <button onClick={() => signOut()}>Logga ut</button>
    </>
  );
}
