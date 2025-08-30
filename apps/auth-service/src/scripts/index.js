const { cacheDefaultRoleId } = require('./initRoles');
const startupScript = () => {
    cacheDefaultRoleId();
}

module.exports = {
    startupScript,
}