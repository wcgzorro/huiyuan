'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from '@/hooks/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { CreateSubredditPayload } from '@/lib/validators/subreddit'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Page = () => {
  const router = useRouter()
  const [input, setInput] = useState<string>('')
  const { loginToast } = useCustomToasts()

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      }

      const { data } = await axios.post('/api/subreddit', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: '版块名已存在.',
            description: '请重新输入一个版块名称.',
            variant: 'destructive',
          })
        }

        if (err.response?.status === 422) {
          return toast({
            title: '版块名错误.',
            description: '版块名长度需要在1到21个字符之间.',
            variant: 'destructive',
          })
        }

        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      toast({
        title: '出错了.',
        description: '不能创版块.',
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`)
    },
  })

  return (
    <div className='container flex items-center h-full max-w-3xl mx-auto'>
      <div className='relative bg-white w-full h-fit p-4 rounded-lg space-y-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>创建新版块</h1>
        </div>

        <hr className='bg-red-500 h-px' />

        <div>
          <p className='text-lg font-medium'>请填写版块名称</p>
          <p className='text-xs pb-2'>
            名称不能为空
          </p>
          <div className='relative'>
            <p className='absolute text-sm left-1 w-18 inset-y-0 grid place-items-center text-zinc-400'>
              版块/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        <div className='flex justify-end gap-4'>
          <Button
            disabled={isLoading}
            variant='subtle'
            onClick={() => router.back()}>
            取消
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}>
            确认
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page
