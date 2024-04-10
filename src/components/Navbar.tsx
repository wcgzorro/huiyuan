import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Icons } from './Icons'
import { buttonVariants } from './ui/Button'
import { UserAccountNav } from './UserAccountNav'
import SearchBar from './SearchBar'
import IconLogo from '../../public/assets/svg/logo.svg';

const Navbar = async () => {
  const session = await getServerSession(authOptions)
  // console.log("session");
  // console.log(session);
  return (
    <div className='fixed top-0 inset-x-0 h-fit min-h-[55px] bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
      <div className='container max-w-8xl h-full mx-auto flex items-center justify-between gap-2 pr-2 pl-2'>
        {/* logo */}
        <Link href='/' className='flex gap-2 items-center'>
          <IconLogo className='h-8 w-8 sm:h-10 sm:w-10'></IconLogo>
          {/* <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' /> */}
          <p className='hidden text-zinc-700 text-lg font-medium md:block'>绘园</p>
        </Link>

        {/* search bar */}
        <SearchBar />

        {/* actions */}
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href='/sign-in' className={`${buttonVariants()} px-2 min-w-0 whitespace-nowrap`}>
            登录
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar
