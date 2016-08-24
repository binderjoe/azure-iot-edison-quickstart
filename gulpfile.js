// Gulp tasks for setting up node on the Intel Edison, deploying apps to it, and starting/stoping the app remotely.
// These tasks are meant to be used when developing locally and deploying to a remote device that has ssh enabbled.
var gulp = require('gulp');
var config = require('./config');
var gulpSSH = require('gulp-ssh');
var rsync  = require('gulp-rsync');
var runSequence = require('run-sequence');


var ssh = new gulpSSH({
  ignoreErrors: false,
  sshConfig: config
});

gulp.task('install-node', function () {
  return ssh
    .exec([
            'echo "src/gz all http://repo.opkg.net/edison/repo/all" > /etc/opkg/base-feeds.conf; ' +
            'echo "src/gz edison http://repo.opkg.net/edison/repo/edison" >> /etc/opkg/base-feeds.conf; ' +
            'echo "src/gz src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32" >> /etc/opkg/base-feeds.conf; ' + 
            'echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf; ' +
            'opkg update; ' +
            'opkg install nodejs; ' + 
            'opkg install rsync; ' 
        ], {filePath: 'commands.log'})
    .pipe(gulp.dest('logs'))
});

gulp.task('restart-debug', function(cb) {
     runSequence('stop-debug',
                 'deploy',
                 'start-debug',
                 cb);
});

// Start the node process with the debug flag set.  Change to --debug-brk to debug the app's startup.
gulp.task('start-debug', function () {
    return ssh
            .exec(['cd ' + config.projectName + ' && nodemon --debug-brk ' + config.startFile + ' ' ], 
            {filePath: 'debug-start.log'})
        .pipe(gulp.dest('logs'))
});

// Clean up any node debug processes to avoid port conflicts
gulp.task('stop-debug', function(){
    var debugCommand = '--debug';
    return ssh
     .exec(['ps | grep \'[n]odemon ' + debugCommand + '\' | awk \'{print $1}\' | xargs kill -9 &> /dev/null'], {filePath: 'debug-start.log'})
     .pipe(gulp.dest('logs'))
});

// Deploy the project to the remote device
gulp.task('deploy', function() {
  
  // Dirs and Files to sync
  rsyncPaths = ['.' ];
  
  // Default options for rsync
  rsyncConf = {
    destination: config.projectName,
    hostname: config.host,
    username: config.user,
    progress: false,
    incremental: true,
    relative: true,
    emptyDirectories: true,
    recursive: true,
    clean: true,
    exclude: [],
  };
  
  return gulp.src(rsyncPaths)
    .pipe(rsync(rsyncConf));

});


gulp.task('restore-packages', function () {
  return ssh
    .exec(['cd ' + config.projectName + ' && npm install --only=production'], {filePath: 'restore-pkgs.log'})
    .pipe(gulp.dest('logs'))
});


 

