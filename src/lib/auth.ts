import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { nanoid } from "nanoid";
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
const bcrypt = require("bcryptjs");

// Define a type for the credentials
// type Credentials = {
//   username: string;
//   password: string;
// };

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await db.user.findUnique({
          where: { username: credentials?.username },
        });

        if (!user) {
          throw new Error("No user found with the given username");
        }

        // You should implement your own password checking logic here
        // For example, if you store hashed passwords in the database, you should verify the hash here
        const isMatch = await bcrypt.compare(
          credentials?.password,
          user.password
        );

        if (!isMatch) {
          throw new Error("Password is incorrect");
        }
        // console.log("Credentials");
        // console.log(user);
        // If the credentials are valid, return the user object
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
        };
      },
    }),
    CredentialsProvider({
      id: "weixin",
      name: "WeiXin",
      credentials: {
        openid: { label: "OpenID", type: "text" }, // 可以不显示给用户
        unionid: { label: "Unionid", type: "text" },
        nickname: { label: "Nickname", type: "text" }, // 可以不显示给用户
        headimgurl: { label: "HeadImgUrl", type: "text" }, // 可以不显示给用户
        access_token: { label: "AccessToken", type: "text" },
        refresh_token: { label: "RefreshToken", type: "text" },
      },
      async authorize(wxdata, req) {
        if (!wxdata || !wxdata.openid || !wxdata.unionid) {
          throw new Error("Weixin data not provided or openid is missing");
        }
        // console.log("wxdata",wxdata);

        const account = await db.account.findFirst({
          where: {
            provider: "weixin", // 指定提供者为"weixin"
            providerAccountId: wxdata.unionid, // 微信返回的unionid作为账户ID
          },
        });
        // console.log("account",account);
        let user;
        if (account) {
          // 如果找到了账户，获取对应的用户信息
          user = await db.user.findUnique({
            where: { id: account.userId },
          });
        }else{
          user = await db.user.create({
            data: {
              name: wxdata.nickname,
              username: nanoid(), // 生成一个唯一的username
              image: wxdata.headimgurl,
              accounts: {
                create: {
                  type: "oauth",
                  provider: "weixin",
                  providerAccountId: wxdata.unionid,
                  access_token:wxdata.access_token,
                  refresh_token:wxdata.refresh_token,
                },
              }
            }
          });
        }
        // console.log("wxuser",user);

        if (!user) {
          throw new Error("No user found with the given username");
        }
        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      httpOptions: {
        timeout: 40000,
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 40000,
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },

    async jwt({ token, user }) {
      // console.log("====jwt start======");
      // console.log(token);
      // console.log(user);
      
      const dbUser = await db.user.findFirst({
        where: {
          // email: token.email,
          // 使用 OR 查询条件以匹配 `sub` 或 `username`
          OR: [
            { id: token.sub }, // 如果 `sub` 存在，尝试根据 `id` 匹配
            { username: token.username }, // 否则，根据 `username` 匹配
          ].filter(condition => Object.values(condition)[0] !== undefined) // 过滤掉值为 undefined 的条件
        },
      });
      // console.log(dbUser);
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }
      // console.log("====jwt end======");

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);