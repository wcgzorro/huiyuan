
# Breadit - A Modern Fullstack Reddit Clone 

Built with the Next.js App Router, TypeScript & Tailwind


## Features

 - Infinite scrolling for dynamically loading posts
 - Authentication using NextAuth & Google
 - Custom feed for authenticated users
 - Advanced caching using [Upstash Redis](https://upstash.com/?utm_source=Josh2)
 - Optimistic updates for a great user experience
 - Modern data fetching using React-Query
 - A beautiful and highly functional post editor
 - Image uploads & link previews
 - Full comment functionality with nested replies
 - ... and much more


## Getting started

To get started with this project, run

```bash
  git clone -b starter-code https://github.com/joschan21/breadit.git
```

and copy these .env.example variables into a separate .env file:

```bash
DATABASE_URL=
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

REDIS_URL=
REDIS_SECRET=
```

if you'd like, you can paste this snippet for quick component creation (optional):
```typescript
// vscode settings -> user snippets -> typescriptreact.json
```

```json
"Typescript React Function Component": {
    "prefix": "fc",
    "body": [
      "import { FC } from 'react'",
      "",
      "interface ${TM_FILENAME_BASE}Props {",
      "  $1",
      "}",
      "",
      "const $TM_FILENAME_BASE: FC<${TM_FILENAME_BASE}Props> = ({$2}) => {",
      "  return <div>$TM_FILENAME_BASE</div>",
      "}",
      "",
      "export default $TM_FILENAME_BASE"
    ],
    "description": "Typescript React Function Component"
  },
  ```

and that's all you need to get started!


## Acknowledgements

- [Upstash Redis](https://upstash.com/?utm_source=Josh2) for making this possible
- [Code with Antonio](https://www.youtube.com/@codewithantonio) for thumbnail design inspiration
- Shadcn's [Taxonomy respository](https://github.com/shadcn/taxonomy) for showcasing the post editor

## License

[MIT](https://choosealicense.com/licenses/mit/)



## 阿里云部署
- 将 docker-compose.yml 文件部署到服务器上并使用 Podman Compose 运行
- 运行 Podman Compose：在项目目录中，运行以下命令以使用 Podman Compose 启动你的服务：
- podman-compose up
停止服务：podman-compose down
查看运行的容器：podman ps

Redis 容器启动时的内存超额分配警告指的是 Linux 系统中 vm.overcommit_memory 设置的问题。这个设置控制着 Linux 内核如何管理内存分配，尤其是对于需要创建大内存快照（如 Redis 的持久化操作）的场景。当 vm.overcommit_memory 设置为 0（默认值），操作系统允许超额分配内存，但在内存不足时可能导致OOM（内存不足）杀手终止进程。设置为 1 时，内核允许超额承诺所有物理内存和交换空间，这对于 Redis 来说是推荐的设置，因为它可以减少因内存超分配而导致的失败。你可以通过执行 sysctl vm.overcommit_memory=1 来调整这个设置。

- 测试mysql连接，测试redis连接
redis-cli -h 60.205.108.91 -p 6379 -a your_redis_password


- 保存 schema.prisma 文件之后，运行以下命令重新生成 Prisma Client：
npx prisma generate

为了将你的项目中的数据表部署到数据库中，首先确保你的环境变量 DATABASE_URL 正确配置了数据库连接信息。然后，在项目目录中运行 
npx prisma db push 命令。
这个命令会根据你的 schema.prisma 文件中定义的模型，创建或更新数据库中的表结构，使其与你的 Prisma 模型匹配。这是一个快速同步 Prisma 模型到数据库的方法，非常适用于开发环境。在执行之前，确保数据库服务已经运行，并且可以从你的服务器访问。


# 构建Docker镜像
docker build -t your-app-name .

# 运行Docker容器
docker run -p 3000:3000 your-app-name


<!-- 
在部署的时候，遇到的问题
1、yarn install 时，会遇到prisma 的问题，可以通过设置国内镜像解决 
export PRISMA_ENGINES_MIRROR="https://registry.npmmirror.com/-/binary/prisma"
2、 然后就可以执行 npx prisma generate   npx prisma db push
3、重新执行 yarn install 可以成功
4、继续 yarn run build 会遇到谷歌字体的问题，先注释掉
5、重新 yarn run build
6、执行 yarn run start 就可以了
-->