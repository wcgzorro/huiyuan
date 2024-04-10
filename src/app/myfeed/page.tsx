import { redirect } from 'next/navigation'
import CustomFeed from '@/components/homepage/CustomFeed'
import { buttonVariants } from '@/components/ui/Button'
import { Home as HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { authOptions, getAuthSession } from '@/lib/auth'

export default async function MyFeed() {
  const session = await getAuthSession()
  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || '/login')
  }
  const PostCustomFeed = await CustomFeed();
  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl'>我的关注</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-5 py-6'>
        {/* @ ts-expect-error server component */}
        {/* {session ? <CustomFeed /> : <GeneralFeed />} */}
        {PostCustomFeed}
        

        {/* subreddit info */}
        <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
          <div className='bg-emerald-100 px-6 py-4'>
            <p className='font-semibold py-3 flex items-center gap-1.5'>
              <HomeIcon className='h-4 w-4' />
              主页
            </p>
          </div>
          <dl className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <p className='text-zinc-500'>
                创建属于你的版块
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: 'w-full mt-4 mb-6',
              })}
              href={`/r/create`}>
              创建版块
            </Link>
          </dl>
        </div>
      </div>
    </>
  )
}
