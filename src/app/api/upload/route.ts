import { getAuthSession } from '@/lib/auth'
// import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
// import { v4 as uuidv4 } from 'uuid'; // 引入uuid
// import { existsSync, mkdirSync } from 'fs';
import axios from 'axios'

export async function POST(request: Request) {

    const session = await getAuthSession()
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const formData = await request.formData();
    // 获取上传文件
    const file = formData.get("file") as File;

    if (!file) {
        return new NextResponse(JSON.stringify({ error: 'No file uploaded' }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    console.log("文件大小：",file.size / 1024 / 1024)
    // 检查文件大小
    const maxFileSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxFileSize) {
        return new NextResponse(JSON.stringify({ error: 'File is too large' }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    //上传到图片服务器 .env中配置http://localhost:8080/upload
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
 
    try {
      // 替换这里的URL为你的图片服务器上传接口地址
      if (!process.env.UPLOAD_SERVER) {
        throw new Error('UPLOAD_SERVER environment variable is not defined.');
      }
      const response = await axios.post(process.env.UPLOAD_SERVER, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-API-KEY': process.env.UPLOAD_SECRET, // 如果你的图片服务器需要API密钥
        },
      });
  
      // 处理响应
      const { data } = response;
      if (data && data.url) {
        // 如果图片服务器返回的有图片的URL
        return new Response(JSON.stringify({ url: data.url }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        throw new Error('Failed to upload image.');
      }
    } catch (error) {
      // console.error(error);
      return new Response(JSON.stringify({ error: 'Failed to upload image' }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}

