import { Discovery } from "aws-sdk";
import Instagram from "instagram-web-api";

export default function Insta({ posts }) {
  return (
    <div>
      <ul className={styles.list}>
        {posts.map(({ node }, i) => {
          return (
            <li key={i}>
              <img src={node.display_resources[0].src} />
              <p>{node.edge_media_to_caption.edges[0]?.node.text}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function getStaticProps(context) {
  const client = new Instagram({
    username: "INSTAGRAM_USERNAME",
    password: "INSTAGRAM_PASSWORD",
  });
  await client.login();

  const response = await client.getPhotosByUsername({
    username: "INSTAGRAM_USERNAME",
  });

  return {
    props: {
      posts: response.user.edge_owner_to_timeline_media.edges,
    }, // will be passed to the page component as props
  };
}
