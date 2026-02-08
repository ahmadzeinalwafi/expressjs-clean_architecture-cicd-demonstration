const crypto = require('crypto');

const webhookUrl = process.env.KOMODO_WEBHOOK_URL;
const webhookSecret = process.env.KOMODO_WEBHOOK_SECRET;

if (!webhookUrl || !webhookSecret) {
    console.error('Error: KOMODO_WEBHOOK_URL and KOMODO_WEBHOOK_SECRET must be set.');
    process.exit(1);
}

const payload = JSON.stringify({
    ref: 'refs/heads/master',
    repository: {
        full_name: 'ahmadzeinalwafi/expressjs-clean_architecture-cicd-demonstration',
        name: 'expressjs-clean_architecture-cicd-demonstration',
    },
    pusher: {
        name: 'github-actions[bot]',
        email: 'github-actions[bot]@users.noreply.github.com'
    }
});

const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

console.log(`Triggering Komo.do deployment at ${webhookUrl}... [For Learning & Debugging, not for production security]`);

fetch(webhookUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-GitHub-Event': 'push',
        'X-Hub-Signature-256': `sha256=${signature}`
    },
    body: payload
})
    .then(async (res) => {
        if (res.ok) {
            console.log('Deployment triggered successfully!');
        } else {
            const text = await res.text();
            console.error(`Failed to trigger deployment: ${res.status} ${res.statusText}`);
            console.error(text);
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error('Error triggering deployment:', err);
        process.exit(1);
    });
