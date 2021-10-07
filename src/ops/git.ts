import { nodeIgnore, yarnIgnore } from '../templates/gitignore';

import { addToFile } from './files';
import execa from 'execa';
import { join } from 'path';

type AvailableIgnoreConfigs = 'yarn-pnp';

const templatesPath = join(__dirname, '../templates/gitignore');

export const addGitIgnore = (
	ignores: AvailableIgnoreConfigs[] = [],
	path = '.'
) => {
	const filepath = `${path}/.gitignore`;
	addToFile(filepath, nodeIgnore);

	console.log(templatesPath);

	for (const ignore of ignores) {
		if (ignore === 'yarn-pnp') {
			addToFile(filepath, yarnIgnore);
		}
	}

	execa('git', ['init']);
};
