const cp = require('child_process');

cp.spawn('npm', ['start'], { stdio: 'inherit', cwd: 'client', shell: true });
