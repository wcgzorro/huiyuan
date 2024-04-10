'use client'

import { signIn } from 'next-auth/react';
import { FC,useEffect } from 'react'

const page : FC = () => {
 
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // 在这里处理微信回调的逻辑
    // 解析查询参数，执行身份验证等
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    const state = queryParams.get('state');

    // 示例：输出获取到的 code 和 state 参数
    console.log('code:', code);
    console.log('state:', state);
   

    if (!code) {
      console.error('code is missing in environment variables.');
      return;
    }

    // 调用你的自定义 API
    fetch(`/api/weixinauth?code=${code}&state=${state}`)
      .then(response => response.json())
      .then(data => {
        // 假设返回的数据中包含了必要的用户信息
        console.log(JSON.stringify(data));

         // 检查 data 是否包含必要字段
        if (data && data.openid && data.nickname) {
          // 使用 signIn 完成登录
          signIn('weixin', {
            redirect: true,
            ...data
          });
        } else {
          console.error('Required data is missing');
        }
        
      })
      .catch(error => {
        console.error('Error while signing in:', error);
      });

    
    

  }, []);
 

  return (
    <div className='grid justify-items-center items-center py-6'>
      <p className='text-center'>绘画是心灵的事务，不是手的事务</p>
      <br></br>
      <p className='text-zinc-500 text-center'>登录中，请稍后...</p>
    </div>
  );
};

export default page;