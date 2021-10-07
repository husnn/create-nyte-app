import { readJsonFile, writeJsonFile } from './files';

import baseConfig from '../templates/tsconfig.base';
import buildConfig from '../templates/tsconfig.build';
import { isLocalDependency } from '.';
import packageConfig from '../templates/tsconfig.package';
import pathConfig from '../templates/tsconfig';

export const createTsConfig = (
	projectName: string,
	packages?: Array<Package & { hasDependants: boolean }>
) => {
	createTsConfigBase(projectName);
	createTsConfigBuild(projectName, packages);
	packages?.forEach((pkg) => {
		createTsConfigPackage(pkg, pkg.hasDependants);
	});
	createTsConfigPaths(projectName, packages);
};

export const createTsConfigBase = (path: string) => {
	writeJsonFile(`tsconfig.base.json`, baseConfig);
};

export const createTsConfigBuild = (path: string, packages: Package[] = []) => {
	packages.forEach((pkg) => {
		buildConfig.references.push({
			path: `./${pkg.path}/${pkg.name}`
		});
	});
	writeJsonFile(`tsconfig.build.json`, buildConfig);
};

export const createTsConfigPaths = (
	projectName: string,
	packages: Package[] = []
) => {
	packages.forEach((pkg) => {
		pathConfig.compilerOptions.paths[`@${projectName}/${pkg.name}`] = [
			`./${pkg.path}/${pkg.name}/src`
		];
	});
	writeJsonFile(`tsconfig.json`, pathConfig);
};

export const createTsConfigPackage = (pkg: Package, hasDependants = false) => {
	const configPath = `${pkg.path}/${pkg.name}/tsconfig.json`;
	const existingConfig = readJsonFile(configPath);

	const config = JSON.parse(JSON.stringify(packageConfig));

	if (existingConfig) {
		for (const [key, value] of Object.entries(existingConfig)) {
			if (key in config) {
				config[key] = value;
			}
		}
	}

	pkg.deps.forEach((dep) => {
		if (!isLocalDependency(dep)) return;

		let baseDir = '..';

		if ((dep as Package).path !== pkg.path)
			baseDir = `../../${(dep as Package).path}`;

		config.references.push({
			path: `${baseDir}/${(dep as Package).name}`
		});
	});
	config.compilerOptions.composite = hasDependants;
	writeJsonFile(configPath, config);
};

export const addPath = () => {};
export const addReference = () => {};
