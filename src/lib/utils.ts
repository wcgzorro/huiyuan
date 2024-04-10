import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNowStrict } from 'date-fns'
import locale from 'date-fns/locale/zh-CN'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatDistanceLocale = {
  lessThanXSeconds: '刚才',
  xSeconds: '刚才',
  halfAMinute: '刚才',
  lessThanXMinutes: '{{count}}分钟',
  xMinutes: '{{count}}分钟',
  aboutXHours: '{{count}}小时',
  xHours: '{{count}}小时',
  xDays: '{{count}}天',
  aboutXWeeks: '{{count}}周',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}月',
  xMonths: '{{count}}月',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
}

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {}

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace('{{count}}', count.toString())

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result
    } else {
      if (result === '刚才') return result
      // return result + ' ago'
      return result + '之前'
    }
  }

  return result
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}
