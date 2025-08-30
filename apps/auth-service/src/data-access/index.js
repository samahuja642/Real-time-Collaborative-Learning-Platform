const { handlePrismaError, AppError } = require("@repo/utils");
const { PrismaClient,Prisma } = require("../generated/prisma");
const dayjs = require('dayjs');
const prisma = new PrismaClient();

const safeDbAccess = async (fn) => {
    try{
        return await fn();
    }catch(err){
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            throw handlePrismaError(err);
        }
        throw err;
    }
}

const dbGetRoleIDForStudent = async () => {
    async function fn(){
        const role = await prisma.role.findUnique({ where: { name: 'student' } });
        if(!role)throw new Error("Role Not Found",500);
        return role.id;
    }
    return safeDbAccess(fn);
}

const dbAddUser = async (user) => {
    async function fn(){
        const createdAt = new Date();
        return await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: user.email,
                    salt: user.salt,
                    name: user.name,
                    createdAt,
                    updatedAt: createdAt,
                },
            });
            await tx.userRole.create({
                data: {
                    userId: newUser.id,
                    roleId: user.role,
                }
            })
        });
    }
    return safeDbAccess(fn);
}

const dbFindUserByEmail = async (email,shouldThrowErr=true) => {
    async function fn() {
        return prisma.$transaction(async (tx)=>{
            const user = await tx.user.findUnique({
                where: { email:email }
            })
            if(!user && shouldThrowErr)throw new AppError("No User Found",404);
            return user;
        })
    }
    return safeDbAccess(fn);
}

const dbFindUserById = async (userId) => {
    async function fn() {
        return prisma.$transaction(async (tx)=>{
            const user = await tx.user.findUnique({
                where: { id:userId }
            })
            if(!user)throw new AppError("No User Found",404);
            return user;
        })
    }
    return safeDbAccess(fn);
}

const dbFindRolesByUser = async (user) => {
    async function fn() {
        return prisma.$transaction(async (tx)=>{
            const roles = await tx.userRole.findMany({
                where: { userId:user.id },
                include: { role: true },
            });
            const rolesNames = roles.map(r=>r.role.name);
            return rolesNames;
        })
    }
    return safeDbAccess(fn);
}

const dbSaveOtp = async (userId,otp) => {
    async function fn(){
        return prisma.$transaction(async (tx)=>{
            const currentTime = new Date();
            return tx.userOtp.upsert({
                where: { userId },
                update:{
                    otp,
                    updatedAt: currentTime,
                },
                create:{
                    userId,
                    otp,
                    createdAt: currentTime,
                },
            })
        })
    }
    return safeDbAccess(fn);
}

const dbFindNonExpiredOtpForUser = async (userId) => {
    async function fn(){
        return prisma.$transaction(async (tx)=>{
            const otpObject = await tx.userOtp.findFirst({
                where: { userId },
            });
            console.log('otpObject',otpObject);
            if(!otpObject){
                throw new AppError("Generate Otp Again",400);
            }
            if(otpObject.updatedAt){
                if(dayjs(otpObject.updatedAt).add(5,"minutes").isBefore(dayjs(new Date()))){
                    console.log('why',dayjs(otpObject.updatedAt).add(5,"minutes").toISOString(),dayjs(new Date()).toISOString());
                    throw new AppError("Generate Otp Again",400);
                }
            }
            else{
                console.log('why2',dayjs(otpObject.createdAt).add(5,"minutes").toISOString(),dayjs(new Date()).toISOString());
                if(dayjs(otpObject.createdAt).add(5,"minutes").isBefore(dayjs(new Date()))){
                    throw new AppError("Generate Otp Again",400);
                }
            }
            return otpObject.otp;
        })
    }
    return safeDbAccess(fn);
}

const dbVerifyOtpData = async (userId) => {
    async function fn(){
        return prisma.$transaction(async (tx)=>{
            const roleEntryForUser = await tx.userRole.findMany({
                where:{userId:userId},
                include:{role: true},
            })
            const roleNames = roleEntryForUser.map(r=>r.role.name);
            const otpObject = await tx.userOtp.findFirst({
                where:{userId:userId},
            });
            return {
                roles: roleNames,
                otp: otpObject.otp
            }
        })
    }
    return safeDbAccess(fn);
}

const dbDeleteOtpData = async (userId) => {
    async function fn(){
        return prisma.$transaction(async (tx) => {
            await tx.userOtp.delete({
                where:{
                    userId:userId,
                }
            });
        })
    }
    return safeDbAccess(fn);
}

module.exports = {
    dbGetRoleIDForStudent,
    dbAddUser,
    dbFindUserByEmail,
    dbFindUserById,
    dbFindRolesByUser,
    dbSaveOtp,
    dbFindNonExpiredOtpForUser,
    dbVerifyOtpData,
    dbDeleteOtpData
}