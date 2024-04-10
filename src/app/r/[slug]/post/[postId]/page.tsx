import CommentsSection from "@/components/CommentsSection";
import EditorOutput from "@/components/EditorOutput";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface SubRedditPostPageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const SubRedditPostPage = async ({ params }: SubRedditPostPageProps) => {
  let cachedPost: CachedPost | null = null;
  console.log("params", params)
  try {
    const result = await redis.hGetAll(`post:${params.postId}`);
    console.log("result")
    console.log(result)
    if (Object.keys(result).length) {
      // Ensure the result is of the expected type, or convert it as necessary
      cachedPost = result as unknown as CachedPost;
      console.log("cachedPost");
      console.log(cachedPost);
    } else {
      // Handle the case where the hash does not exist or is empty
      console.log(`Post with ID ${params.postId} not found in cache.`);
    }
  } catch (error) {
    console.error(`Error fetching post from Redis: ${error}`);
  }
  let post: (Post & { votes: Vote[]; author: User }) | null = null;
  console.log(post);
  console.log(!cachedPost);

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }
  console.log("2");

  const postId = post?.id ?? cachedPost?.id;
  console.log(postId);
  if (!postId) return notFound();

  return (
    <div>
      <div className="flex justify-between bg-white px-4 py-4">


        <div className="sm:w-0 w-full flex-1 bg-white p-0 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            发表于
            {(post?.createdAt ?? cachedPost?.createdAt) &&
              formatTimeToNow(
                new Date((post?.createdAt ?? cachedPost?.createdAt)!)
              )}{" "}
            /{" "}{post?.author.name ?? cachedPost?.authorUsername}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
            {post?.title ?? cachedPost?.title}
          </h1>

          <EditorOutput content={post?.content ?? JSON.parse(cachedPost?.content || '')} />
          {/* <div>comment here</div> */}
        </div>
      </div>

      <div className='bg-white z-20 text-sm px-4 py-4 sm:px-6 flex justify-start items-center'>
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component */}
          <PostVoteServer
            postId={postId}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
        }
      >
        {/* @ts-expect-error Server Component */}
        <CommentsSection postId={post?.id ?? cachedPost?.id} />
      </Suspense>
    </div>
  );
};

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      {/* upvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      {/* score */}
      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}

export default SubRedditPostPage;