export const isLocalDependency = (dep: Dependency): boolean =>
	typeof dep === 'object' && !!dep.name;

export const getDependencyVersion = (dep: Dependency): string =>
	isLocalDependency(dep) ? getDependencyPath(dep as Package) : '*';

const getDependencyPath = (dep: Package): string =>
	`workspace:${dep.path}/${dep.name}`;

export const getDependencyName = (dep: Dependency): string =>
	isLocalDependency(dep) ? (dep as Package).moduleName : (dep as string);
