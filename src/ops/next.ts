import { addDependencies, packageFromPackage } from './packager';

import execa from 'execa';
import { writePackageJson } from './files';

export const createNextProject = (
	projectName: string,
	name: string,
	dir: string,
	useTypescript = false,
	deps: Dependency[] = [],
	devDeps: Dependency[] = [],
	scripts = {},
	version = '0.1.0'
): Package | undefined => {
	const path = `${dir}/${name}`;

	console.log('Creating Next app...');

	execa.commandSync(
		`yarn create next-app ${path} ${useTypescript ? '--typescript' : ''}`
	);

	let packageJson = packageFromPackage(path);
	if (!packageJson) return;

	const pkg: Package = {
		name,
		moduleName: `@${projectName}/${name}`,
		path: dir,
		deps
	};

	packageJson.name = pkg.moduleName;
	packageJson.version = version;
	packageJson.scripts = {
		...packageJson.scripts,
		...scripts
	};

	if (useTypescript) devDeps.push('@types/node');

	packageJson = addDependencies(packageJson, deps);
	packageJson = addDependencies(packageJson, devDeps);

	writePackageJson(packageJson, path);

	console.log(`Created package ${pkg.moduleName}`);

	return pkg;
};
