import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const sites = JSON.parse(readFileSync(resolve(root, 'static-sites.json'), 'utf8'));

for (const site of sites) {
	const directory = resolve(root, site.directory);
	if (!directory.startsWith(`${root}/`) || !existsSync(directory)) {
		throw new Error(`Static site directory is missing or outside the repo: ${site.directory}`);
	}

	console.log(`\nBuilding static site: ${site.name}`);
	for (const command of [site.install, site.build]) {
		if (!Array.isArray(command) || command.length === 0) {
			throw new Error(`Invalid command configuration for ${site.name}`);
		}
		const [executable, ...args] = command;
		const result = spawnSync(executable, args, { cwd: directory, stdio: 'inherit' });
		if (result.error) throw result.error;
		if (result.status !== 0) {
			throw new Error(`${executable} failed for ${site.name} with status ${result.status}`);
		}
	}
}
