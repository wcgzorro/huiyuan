"use client";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
// import { signIn } from "next-auth/react";
import * as React from "react";
import { FC, useEffect } from "react";
// import { Icons } from "./Icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

interface WeiXinConfig {
  appid: string | undefined;
  redirectUri: string | undefined;
  responseType?: string | undefined;
  scope: string | undefined;
  state?: string | undefined;
}

declare global {
  interface Window {
    WxLogin: any;
  }
}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  //微信登录
  const WXConf:WeiXinConfig = {
    appid: process.env.NEXT_PUBLIC_WEIXIN_APP_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/weixin-callback`,
    responseType: 'code',
    scope: 'snsapi_userinfo',
    state: ''
  }

  //微信开放平台
  const WXOpenConf:WeiXinConfig = {
    appid: process.env.NEXT_PUBLIC_WX_OPEN_APP_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/weixin-callback`,
    responseType: 'code',
    scope: 'snsapi_userinfo',
    state: 'open'
  }

  const loginWithWeiXin = ({ appid, redirectUri, responseType = 'code', scope, state = '' }: WeiXinConfig) => {
    console.log(redirectUri);
    setIsLoading(true);
    try {
      const encodedRedirectUri = encodeURIComponent(redirectUri as string);
      const weixinUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodedRedirectUri}&response_type=${responseType}&scope=${scope}&state=${state}#wechat_redirect`;
  
      window.location.href = weixinUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging in with WeiXin",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const loginWithWXOpen = ({ appid, redirectUri, responseType = 'code', scope, state = '' }: WeiXinConfig) => {
    console.log(redirectUri);
    setIsLoading(true);
    new window.WxLogin({
      self_redirect: false,
      id: "wx_login_container",
      appid: appid,
      scope: "snsapi_login",
      redirect_uri: redirectUri,
      state: state,
      style: "",
      href: ""
    });
  };

   // 检测是否在微信浏览器中
   useEffect(() => {
    const isWeixinBrowser = /micromessenger/i.test(navigator.userAgent);
    if (isWeixinBrowser) {
      loginWithWeiXin(WXConf);
    }else{
      const script = document.createElement('script');
      script.src = "http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js";
      script.async = true;
      script.onload = () => loginWithWXOpen(WXOpenConf); // 在脚本加载完毕后调用 loginWithWXOpen
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      {/* 微信二维码容器 */}
      <div id="wx_login_container">微信登录中</div>
      {/* <Button
        isLoading={isLoading}
        type="button"
        size="sm"
        className="w-full"
        onClick={()=>loginWithWXOpen(WXOpenConf)}
        disabled={isLoading}
      >
        
        微信
      </Button> */}
    </div>
  );
};

export default UserAuthForm;