var fs = require('fs');
var os = require('os');
var path = require('path');

// Update to point to the ssh key you will use to SSH to the Edison
var sshKeyPath = path.join(os.homedir(), '.ssh/', 'id_edison');

module.exports = {
    host: '[hostname]',
    user: 'root',
    projectName: '~/iot-edison-quickstart/',
    privateKey: fs.readFileSync(sshKeyPath),
    startFile: 'app.js',
    sshPort: 22
}