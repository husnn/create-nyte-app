type ProjectLicense = 'MIT' | 'ISC';

type ProjectInfo = {
	name: string;
	version: string;
	description?: string;
	license?: ProjectLicense;
};

type PackageScript = {
	[name: string]: string;
};

type PackageJson = {
	name: string;
	version: string;
	description?: string;
	license?: string;
	workspaces?: string[];
	scripts: PackageScript;
	devDependencies?: {
		[key: string]: string;
	};
	dependencies?: {
		[key: string]: string;
	};
};

type Dependency = string | Package;

interface Package {
	name: string;
	moduleName: string;
	path: string;
	deps: Dependency[];
}
