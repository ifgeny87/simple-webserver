import { createLogger } from 'bunyan';
import Express from 'express';
import Moment from 'moment';
import fs from 'fs';

if (!fs.existsSync('logs')) {
	fs.mkdirSync('logs');
}

const logger = createLogger({
	name: 'simple-webserver',
	streams: [
		{
			level: 'trace',
			stream: process.stdout,
		},
		{
			level: 'info',
			path: `logs/webserver_${Moment().format('YMD')}.log`,
		},
	],
});

const PORT = (() => {
	if (!process.env['PORT']) {
		logger.warn('Env PORT used by default: 3000');
		return 3000;
	}
	return Number(process.env['PORT']);
})();

const app = Express();
app.use(Express.json());
app.use(Express.text());
app.use(Express.raw({ limit: '10mb', type: '*/*' }));

app.use((req: Express.Request, res: Express.Response): void => {
	const clientIpAddress = req.socket.remoteAddress;
	const method = req.method;
	const url = req.url;
	const rawHeaders = req.rawHeaders;
	const body = req.body;
	logger
		.child({ action: 'Incoming request' })
		.info({ clientIpAddress, method, url, rawHeaders, body });
	res.writeHead(200).end();
});

const httpServer = app.listen(PORT, () => {
	logger.info(`Webserver listening on http://localhost:${PORT}`);
});

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

let shuttingDown = false;

async function shutdown() {
	if (shuttingDown) return;
	shuttingDown = true;
	logger.warn('Shutting down...');
	try {
		const timerId = setTimeout(() => {
			logger.error(new Error('Timeout trying to properly stop service'));
			process.exit(2);
		}, 5000);
		httpServer.closeAllConnections();
		await new Promise<void>((resolve, reject) => {
			httpServer.close((err?: Error): void => {
				if (err) reject(err);
				else resolve();
			});
		})
		clearTimeout(timerId);
		process.exitCode = 0;
		logger.warn('Shut down');
	} catch (error) {
		logger.error(error, 'Unable to properly stop service');
		process.exit(1);
	}
}
