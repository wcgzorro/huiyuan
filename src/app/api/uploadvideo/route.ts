import { getAuthSession } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  // 获取上传的文件
  const file = formData.get('file') as File;
  // 定义文件保存的目录和访问路径
  const currentYear = new Date().getFullYear();
  const uploadDir = `./public/uploadvideos/${currentYear}/videos/`;
  const accessPath = `/uploadvideos/${currentYear}/videos/`;

  if (!file) {
    return new NextResponse(JSON.stringify({ error: 'No file uploaded' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 检查文件大小（例如，设置为 100MB）
  const maxFileSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxFileSize) {
    return new NextResponse(JSON.stringify({ error: 'File is too large' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 使用 uuid 生成唯一文件名
  const fileExtension = file.name.split('.').pop(); // 获取文件扩展名
  const fileName = uuidv4() + '.' + fileExtension; // 生成唯一文件名
  const fileBuffer = await file.arrayBuffer();
  const filePath = uploadDir + fileName;
  const fileUrl = request.headers.get('origin') + accessPath + fileName;

  // 检查上传目录是否存在，如果不存在则创建
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  await writeFile(filePath, Buffer.from(fileBuffer));

  return new NextResponse(JSON.stringify({ url: fileUrl }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
