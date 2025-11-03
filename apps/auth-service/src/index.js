require('dotenv').config(); 
const express = require('express');
const UserRouter = require('./routes/user');
const GroupRouter = require('./routes/group');
const UserPermissionsRouter = require('./routes/userPermissions');
const { errorHandler, sanitizeRequests, authMiddleware } = require('@repo/utils');
const cors = require('cors');
const { startupScript } = require('./scripts');
const cookieParser = require('cookie-parser');
const { cacheAllRoleData } = require('./scripts/initRoles');
const { getCachedRolesData } = require('./cache/index');
const { ROLES } = require('./constants');

const app = express();

const groupMiddleware = authMiddleware([ROLES.TEACHER,ROLES.ADMIN]);
const userPermissionsMiddleware = authMiddleware([ROLES.ADMIN]);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequests);

app.use('/user', UserRouter);
app.use('/group', groupMiddleware, GroupRouter);
app.use('/user-permissions', userPermissionsMiddleware, UserPermissionsRouter);
app.get('/test', (req, res) => {
    res.send("Hiiii");
});

app.use(errorHandler);

async function startServer() {
    try {
        startupScript();
        await cacheAllRoleData();
        app.listen(process.env.AUTH_SERVICE_PORT, () => {
            console.log(`Auth Service Successfully Started At ${process.env.AUTH_SERVICE_PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
