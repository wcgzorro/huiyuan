import { z } from 'zod'

export const PostValidator = z.object({
  title: z
    .string()
    .min(1, {
      message: '标题不能为空',
    })
    .max(128, {
      message: '标题长度不能超过128个字符',
    }),
  subredditId: z.string(),
  content: z.any(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>
