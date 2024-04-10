'use client'

import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { FC, useRef } from 'react'
import EditorOutput from './EditorOutput'
import PostVoteClient from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  post: Post & {
    author: User
    votes: Vote[]
  }
  votesAmt: number
  subredditName: string
  currentVote?: PartialVote
  commentAmt: number
}

const Post: FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subredditName,
  commentAmt,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null)

  return (
    <div className='rounded-md bg-white shadow'>
      <div className='px-2 py-2 flex justify-between'>
        

        <div className='w-0 flex-1 ml-1'>
          <div className='max-h-40 mt-1 text-xs text-gray-500'>
            {subredditName ? (
              <>
                <span>版块/</span>
                <a
                  className='underline text-zinc-900 text-sm underline-offset-2'
                  href={`/r/${subredditName}`}>
                  {subredditName}
                </a>
                <span className='px-1'>•</span>
              </>
            ) : null}
            <span>发表于{formatTimeToNow(new Date(post.createdAt))} / {post.author.name}</span>
            
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>

            <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
              {post.title}
            </h1>
            
            <div
              className='relative text-sm max-h-96 w-full overflow-clip'
              ref={pRef}>
              {/* 透明遮罩层 */}
              <div className="absolute inset-0 z-30"></div>
              <EditorOutput content={post.content} />
              {pRef.current?.clientHeight === 160 ? (
                // blur bottom if content is too long
                <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent'></div>
              ) : null}
            </div>
            
          </a>
        </div>
      </div>

      <div className='bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6 flex justify-start items-center'>
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className='w-fit flex items-center gap-2 mr-4'>
          <MessageSquare className='h-4 w-4' /> {commentAmt} 评论
        </Link>

        <PostVoteClient
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        />
      </div>
    </div>
  )
}
export default Post
