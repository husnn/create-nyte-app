import { Inquirer } from 'inquirer';
import { Registry } from '../ops/registry';

export const askAddPackage = async (
	inquirer: Inquirer,
	registry: Registry
): Promise<any> => {
	return inquirer.prompt({
		type: 'checkbox',
		choices: registry.data.packages.map((pkg) => {
			return {
				name: pkg.name
			};
		})
	});
};
