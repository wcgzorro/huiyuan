// src/app/weixinauth/route.ts

import { signIn } from "next-auth/react";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) return new Response('Code is required', { status: 400 });

    let APP_ID,APP_SECRET;
    if(state === "open"){
        APP_ID = process.env.NEXT_PUBLIC_WX_OPEN_APP_ID; // 从环境变量中获取
        APP_SECRET = process.env.WX_OPEN_APP_SECRET; // 从环境变量中获取
    }else{
        APP_ID = process.env.NEXT_PUBLIC_WEIXIN_APP_ID; // 从环境变量中获取
        APP_SECRET = process.env.WEIXIN_APP_SECRET; // 从环境变量中获取
    }
    console.log("code =",code);
    console.log(APP_ID);
    console.log(APP_SECRET);
    if (!APP_ID || !APP_SECRET) {
        return new Response('Missing WEIXIN_APP_ID or WEIXIN_APP_SECRET in environment variables', { status: 500 });
    }

    const accessTokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APP_ID}&secret=${APP_SECRET}&code=${code}&grant_type=authorization_code`;
    console.log(accessTokenUrl);
    try {
        const accessTokenResponse = await fetch(accessTokenUrl);
        const accessTokenData = await accessTokenResponse.json();
        console.log("accessTokenData");
        console.log(accessTokenData);
        if (accessTokenData.errcode) {
            return new Response(JSON.stringify(accessTokenData), { status: 500 });
        }

        // 获取用户信息
        const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessTokenData.access_token}&openid=${accessTokenData.openid}&lang=zh_CN`;

        const userInfoResponse = await fetch(userInfoUrl);
        const userInfo = await userInfoResponse.json();

        if (userInfo.errcode) {
            return new Response(JSON.stringify(userInfo), { status: 500 });
        }

        // 在userInfo对象中添加access_token和refresh_token
        userInfo.access_token = accessTokenData.access_token;
        userInfo.refresh_token = accessTokenData.refresh_token;

        console.log("获得微信用户信息和令牌");
        console.log(userInfo);
        return new Response(JSON.stringify(userInfo));
        
    } catch (error) {
        console.error('Weixin Authentication Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
