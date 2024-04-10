const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
//ts-node --esm prisma/addUser.ts
async function createUser() {
    try {
        // 使用 bcrypt 哈希密码
        const hashedPassword = await bcrypt.hash('123456', 10);

        // 使用 Prisma 创建用户
        const user = await prisma.user.create({
            data: {
                username: 'test',
                password: hashedPassword,
                // 如果有其他必填字段，请在这里添加
                // 例如: email: 'your-email@example.com'
            },
        });

        console.log('User created:', user);
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

createUser();