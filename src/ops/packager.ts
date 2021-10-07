import { getDependencyName, getDependencyVersion } from './';

import { readJsonFile } from './files';

export const createPackageJson = (
	projectInfo: PackageJson,
	deps: Dependency[] = [],
	devDeps: Dependency[] = []
): PackageJson => {
	let json: PackageJson = projectInfo;

	json = addDevDependencies(json, devDeps);
	json = addDependencies(json, deps);

	return json;
};

export const addDependencies = (
	json: PackageJson,
	deps: Dependency[],
	pkg?: Package,
	isDev = false
): PackageJson => {
	const d: {
		[name: string]: string;
	} = {};

	deps.forEach((dep) => {
		d[getDependencyName(dep)] = getDependencyVersion(dep);
	});

	const key = !isDev ? 'dependencies' : 'devDependencies';

	return {
		...json,
		[key]: {
			...json[key],
			...d
		}
	};
};

export const addDevDependencies = (
	json: PackageJson,
	dep: Dependency[],
	pkg?: Package
): PackageJson => addDependencies(json, dep, pkg, true);

export const packageFromPackage = (path: string): PackageJson | null => {
	return readJsonFile(`${path}/package.json`);
};
