import { readJsonFile, writeJsonFile } from './files';

import { isLocalDependency } from '.';

export class Registry {
	private filePath: string;

	public data: {
		projectName: string;
		version: string;
		packages: Array<Package & { deps: string[]; dependants: string[] }>;
	};

	constructor(projectName: string, version: string) {
		this.filePath = `nyte.json`;
		this.data = readJsonFile(this.filePath);

		if (!this.data) {
			this.data = {
				projectName,
				version,
				packages: []
			};

			this.saveConfigFile();
		}
	}

	addPackage(pkg: Package) {
		const exists = this.data.packages.find(
			(existing) => existing.name == pkg.name
		);

		if (exists) return;

		this.data.packages.push({
			...pkg,
			deps: pkg.deps.map(
				(dep) =>
					(isLocalDependency(dep) ? (dep as Package).name : dep) as string
			),
			dependants: []
		});

		const { deps } = pkg;

		deps.forEach((dep) => {
			if (!isLocalDependency(dep)) return;

			this.data.packages.forEach((rootDep, index) => {
				if (rootDep.name == (dep as Package).name) {
					rootDep.dependants.push(pkg.name);
					this.data.packages[index] = rootDep;
				}
			});
		});

		this.saveConfigFile();
	}

	saveConfigFile() {
		writeJsonFile(this.filePath, this.data);
	}
}
