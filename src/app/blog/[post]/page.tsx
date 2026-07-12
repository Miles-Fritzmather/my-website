import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "~/components/Container";
import { HStack, VStack } from "~/components/HelperDivs";
import Popup from "~/components/Popup";
import { getAllPostsMetadata, getPost } from "~/lib/posts";
import { PERSON, SITE_URL } from "~/lib/site";

export const dynamicParams = false;

type PostPageProps = Promise<{
  post: string;
}>;

export const generateStaticParams = async () => {
  const posts = await getAllPostsMetadata();
  return posts.map((post) => ({ post: post.filename }));
};

export async function generateMetadata({
  params,
}: {
  params: PostPageProps;
}): Promise<Metadata> {
  const post = await getPost((await params).post);
  if (!post) {
    return { title: "Post not found" };
  }

  const title = post.title;
  const description =
    post.description || `${post.title} — an article by ${PERSON.name}.`;

  return {
    title,
    description,
    authors: [{ name: PERSON.name, url: SITE_URL }],
    alternates: {
      canonical: `/blog/${post.filename}`,
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.filename}`,
      title: `${title} | ${PERSON.name}`,
      description,
      authors: [PERSON.name],
      publishedTime: post.date || undefined,
      images: [
        {
          url: "/logo.png",
          width: 512,
          height: 512,
          alt: PERSON.name,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${title} | ${PERSON.name}`,
      description,
      images: ["/logo.png"],
    },
  };
}

const PostPage = async ({ params }: { params: PostPageProps }) => {
  const post = await getPost((await params).post);

  if (!post) {
    notFound();
  }

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  return (
    <div className="flex w-full justify-center px-4 pb-24 pt-32 sm:px-10">
      <article className="w-full">
        <Popup>
          <Container>
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.3em] text-foreground/60 transition hover:text-foreground"
            >
              <ArrowLeft className="mr-2 size-4" /> Back to all posts
            </Link>
          </Container>
        </Popup>
        <Container className="mt-8 w-full">
          <VStack x="center" className="w-full">
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              {post.title}
            </h1>
            <HStack
              centered
              gap={8}
              className="text-sm font-medium uppercase tracking-[0.25em] text-foreground/50"
            >
              <p>
                By{" "}
                <Link href="/" className="underline-offset-4 hover:underline">
                  {PERSON.name}
                </Link>
              </p>
              <p>{formattedDate}</p>
              <p>{post.readTime} min read</p>
            </HStack>
            <div className="h-1 w-full rounded-full bg-foreground/10" />
            <div
              className="markdown mt-12"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </VStack>
        </Container>
      </article>
    </div>
  );
};

export default PostPage;
