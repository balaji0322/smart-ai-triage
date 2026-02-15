const { spawn, exec } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', 'Starting AI Smart Patient Triage System...\n');

let backendProcess, frontendProcess;

// Start Backend
console.log('\x1b[33m%s\x1b[0m', '[1/3] Starting Backend Server...');
backendProcess = spawn('python', ['start.py'], {
    cwd: path.join(__dirname, 'backend'),
    shell: true,
    stdio: 'inherit'
});

// Wait and start Frontend
setTimeout(() => {
    console.log('\x1b[33m%s\x1b[0m', '[2/3] Starting Frontend Server...');
    frontendProcess = spawn('npm', ['run', 'dev'], {
        shell: true,
        stdio: 'inherit'
    });

    // Open browser after frontend starts
    setTimeout(() => {
        console.log('\x1b[33m%s\x1b[0m', '[3/3] Opening Browser...');
        const openCommand = process.platform === 'win32' ? 'start' : 
                           process.platform === 'darwin' ? 'open' : 'xdg-open';
        exec(`${openCommand} http://localhost:3000`);

        console.log('\n\x1b[32m%s\x1b[0m', '========================================');
        console.log('\x1b[32m%s\x1b[0m', '  AI Smart Patient Triage System');
        console.log('\x1b[32m%s\x1b[0m', '========================================');
        console.log('  Frontend: http://localhost:3000');
        console.log('  Backend:  http://localhost:8000');
        console.log('  API Docs: http://localhost:8000/api/docs');
        console.log('\x1b[32m%s\x1b[0m', '========================================\n');
        console.log('\x1b[33m%s\x1b[0m', 'Press Ctrl+C to stop all servers...\n');
    }, 5000);
}, 5000);

// Cleanup on exit
const cleanup = () => {
    console.log('\n\x1b[33m%s\x1b[0m', 'Stopping servers...');
    if (backendProcess) backendProcess.kill();
    if (frontendProcess) frontendProcess.kill();
    console.log('\x1b[32m%s\x1b[0m', 'Servers stopped.');
    process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
