const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const WATCH_DIR = __dirname;
const DEBOUNCE_DELAY = 1500; // ms to wait after last change before pushing
const IGNORED_PATHS = [
    '.git',
    'node_modules',
    'assets', // Ignored to avoid auto-committing raw assets repeatedly, change if needed
];

let timeoutId = null;
let changedFiles = new Set();

console.log('\x1b[36m%s\x1b[0m', '================================================');
console.log('\x1b[36m%s\x1b[0m', '   Vidhyashree Travels GitHub Auto-Sync Active   ');
console.log('\x1b[36m%s\x1b[0m', '================================================');
console.log(`Watching for changes in: ${WATCH_DIR}`);
console.log('Ignore lists: ' + IGNORED_PATHS.join(', '));
console.log('Waiting for code edits...\n');

// Initialize watch
fs.watch(WATCH_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    // Filter out ignored paths
    const isIgnored = IGNORED_PATHS.some(ignored => {
        const relative = path.relative(WATCH_DIR, path.join(WATCH_DIR, filename));
        return relative.startsWith(ignored) || relative.split(path.sep).includes(ignored);
    });

    if (isIgnored) return;

    // Add to change set
    changedFiles.add(filename);

    // Debounce git execution
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        syncToGitHub();
    }, DEBOUNCE_DELAY);
});

function syncToGitHub() {
    const files = Array.from(changedFiles);
    changedFiles.clear();

    if (files.length === 0) return;

    console.log('\x1b[33m%s\x1b[0m', `[Change Detected] Files updated: ${files.join(', ')}`);
    console.log('Initiating auto-push to GitHub...');

    // Run Git commands sequentially
    exec('git status --porcelain', (err, stdout) => {
        if (err) {
            console.error('\x1b[31m%s\x1b[0m', 'Error checking git status:', err.message);
            return;
        }

        if (!stdout.trim()) {
            console.log('\x1b[32m%s\x1b[0m', 'No actual code changes to commit.');
            return;
        }

        // Check if remote is configured
        exec('git remote -v', (remoteErr, remoteStdout) => {
            const hasRemote = remoteStdout && remoteStdout.includes('origin');

            const commitMessage = `Auto-sync: updated ${files.slice(0, 3).join(', ')}` + (files.length > 3 ? ` and ${files.length - 3} more` : '');
            
            const gitCommands = [
                'git add .',
                `git commit -m "${commitMessage}"`
            ];

            if (hasRemote) {
                // Determine current branch name
                exec('git branch --show-current', (branchErr, branchName) => {
                    const branch = branchName.trim() || 'main';
                    gitCommands.push(`git push origin ${branch}`);
                    runCommands(gitCommands);
                });
            } else {
                console.log('\x1b[35m%s\x1b[0m', 'Warning: No GitHub remote (origin) detected.');
                console.log('\x1b[35m%s\x1b[0m', 'Committing changes locally. Run setup-git.bat to link your GitHub repository.');
                runCommands(gitCommands);
            }
        });
    });
}

function runCommands(commands) {
    if (commands.length === 0) {
        console.log('\x1b[32m%s\x1b[0m', 'Sync completed successfully!\n');
        return;
    }

    const currentCmd = commands.shift();
    console.log(`Executing: ${currentCmd}`);

    exec(currentCmd, (err, stdout, stderr) => {
        if (err) {
            console.error('\x1b[31m%s\x1b[0m', `Failed to execute: ${currentCmd}`);
            console.error('\x1b[31m%s\x1b[0m', err.message);
            console.log('Aborting sync queue.\n');
            return;
        }

        if (stdout.trim()) console.log(stdout.trim());
        if (stderr.trim() && !currentCmd.includes('push') && !currentCmd.includes('add')) {
            console.log(stderr.trim());
        }

        // Run next command
        runCommands(commands);
    });
}
