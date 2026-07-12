import Link from "next/link";
import type { Metadata } from "next";
import Container from "~/components/Container";
import { HStack, VStack } from "~/components/HelperDivs";
import Popup from "~/components/Popup";
import { getAllPostsMetadata, type PostMetadata } from "~/lib/posts";
import { pageMetadata } from "~/lib/seo";
import { PERSON } from "~/lib/site";
import HeroBanner from "./HeroBanner";

export const metadata: Metadata = pageMetadata({
  title: "Writing",
  description: `Articles and notes by ${PERSON.name} on software engineering, design, and building products.`,
  path: "/blog",
});

const BlogPage = () => {
  return (
    <VStack y="top" x="center" className="w-full">
      <HeroBanner />
      <PostList />
    </VStack>
  );
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const Chip = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-sm font-medium uppercase tracking-[0.25em] text-foreground/50">
      {children}
    </p>
  );
};

const PostCard = ({ post }: { post: PostMetadata }) => {
  const formattedDate = post.date
    ? dateFormatter.format(new Date(post.date))
    : undefined;

  return (
    <Popup className="w-full" scaleIncrease={1.1} pullForce={1 / 10}>
      <Container className="w-full">
        <Link href={`/blog/${post.filename}`}>
          <VStack gap={3}>
            <HStack x="between" y="middle" fill>
              <h3 className="text-3xl font-black tracking-tight">
                {post.title}
              </h3>
              <HStack>
                {formattedDate && <Chip>{formattedDate}</Chip>}
                <Chip>{post.readTime} min read</Chip>
              </HStack>
            </HStack>
            {post.description && (
              <p className="text-base text-muted-foreground transition group-hover:text-foreground/80">
                {post.description}
              </p>
            )}
            <Chip>Read more →</Chip>
          </VStack>
        </Link>
      </Container>
    </Popup>
  );
};

const PostList = async () => {
  const postsMetadata = await getAllPostsMetadata();

  return (
    <VStack x="center" gap={12} className="w-full">
      <header>
        <h2 className="text-xl font-semibold uppercase tracking-[0.3em] text-foreground/60">
          Latest Posts
        </h2>
      </header>
      {postsMetadata.length === 0 ? (
        <p className="text-lg text-muted-foreground">
          No posts yet. Check back soon!
        </p>
      ) : (
        <VStack gap={8} className="w-full">
          {postsMetadata.map((post, index) => {
            return <PostCard key={index} post={post} />;
          })}
        </VStack>
      )}
    </VStack>
  );
};

export default BlogPage;
