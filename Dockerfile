# 使用官方 Node.js 为基础镜像
FROM node:latest

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package.json yarn.lock ./

# 设置淘宝镜像源
RUN yarn config set registry https://registry.npmmirror.com

# 设置 Prisma 引擎的国内镜像源
ENV PRISMA_ENGINES_MIRROR="https://registry.npmmirror.com/-/binary/prisma"

# 安装项目依赖
RUN yarn install

# 复制项目文件和文件夹到工作目录
COPY . .
COPY .env ./.env 

# 预安装 Prisma CLI
RUN npx prisma generate

# 构建 Next.js 项目
RUN yarn build

# 暴露 3001 端口
EXPOSE 3001

# 启动 Next.js 服务器
CMD ["yarn", "start"]