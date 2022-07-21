// lib/load-posts.js

// The following function is shared
// with getStaticProps and API routes
// from a `lib/` directory
export async function getThisEvent(id) {
  const response = await fetch("/api/events");
  const data = await response.json();

  //   const found = data.find((event) => event == id);

  //   console.log(data);

  return data;
}
