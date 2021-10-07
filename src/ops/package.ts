import { createPackageJson } from './packager';
import { writePackageJson } from './files';

export const createPackage = (
	projectName: string,
	name: string,
	path: string,
	deps: Dependency[] = [],
	devDeps: Dependency[] = [],
	scripts = {},
	version = '0.1.0'
): Package => {
	const pkg: Package = {
		name,
		moduleName: `@${projectName}/${name}`,
		path,
		deps
	};

	const pkgJson = createPackageJson(
		{
			name: `@${projectName}/${name}`,
			version,
			scripts
		},
		deps,
		devDeps
	);

	writePackageJson(pkgJson, `${path}/${name}`);

	console.log(`Created package ${pkg.moduleName}`);

	return pkg;
};
