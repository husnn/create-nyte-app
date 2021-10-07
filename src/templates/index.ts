import { createDir, createFile, writePackageJson } from '../ops/files';
import { enableVSCodeTSSupport, installYarnLatest } from '../ops/yarn';

import { ProjectTemplate } from '../types/enums';
import { Registry } from '../ops/registry';
import { addGitIgnore } from '../ops/git';
import { createNextProject } from '../ops/next';
import { createPackage } from '../ops/package';
import { createPackageJson } from '../ops/packager';
import { createTsConfig } from '../ops/typescript';

export const createProjectFromTemplate = (
	projectInfo: ProjectInfo,
	template?: ProjectTemplate
) => {
	switch (template) {
		case ProjectTemplate.CLEAN_NEXT_EXPRESS_TS:
			const packageDir = 'packages';
			const serviceDir = 'services';

			createDir(projectInfo.name);
			process.chdir(projectInfo.name);

			const registry = new Registry(projectInfo.name, projectInfo.version);

			const packageScripts = {
				build: 'tsc --build tsconfig.json'
			};

			const serviceScripts = {
				...packageScripts,
				start: 'node dist/index.js',
				serve: 'yarn build && yarn start'
			};

			const { projectName } = registry.data;

			const sharedPackage = createPackage(
				projectName,
				'shared',
				packageDir,
				[],
				['typescript', '@types/node'],
				packageScripts
			);

			createFile(`${sharedPackage.path}/${sharedPackage.name}/src/index.ts`);

			registry.addPackage(sharedPackage);

			const corePackage = createPackage(
				projectName,
				'core',
				packageDir,
				[sharedPackage],
				['typescript', '@types/node'],
				packageScripts
			);

			createFile(`${corePackage.path}/${corePackage.name}/src/index.ts`);

			registry.addPackage(corePackage);

			const apiPackage = createPackage(
				projectName,
				'api',
				serviceDir,
				[sharedPackage, corePackage],
				['typescript', '@types/node'],
				serviceScripts
			);

			createFile(`${apiPackage.path}/${apiPackage.name}/src/index.ts`);

			registry.addPackage(apiPackage);

			const rootPackageJson = createPackageJson(
				{
					...projectInfo,
					workspaces: [`${packageDir}/*`, `${serviceDir}/*`],
					scripts: {
						'eslint:check': 'eslint --ext .js,.jsx,.ts,.tsx .',
						'eslint:fix': 'eslint --fix --ext .js,.jsx,.ts,.tsx .',
						build: 'tsc --build tsconfig.build.json',
						watch: 'yarn build --watch'
					}
				},
				[],
				['typescript', '@types/node']
			);

			writePackageJson(rootPackageJson);

			installYarnLatest();

			createFile(`yarn.lock`);

			const webPackage = createNextProject(
				projectName,
				'web',
				serviceDir,
				true,
				[sharedPackage],
				[]
			);

			if (!webPackage) return;

			registry.addPackage(webPackage);

			createTsConfig(projectName, [
				{ ...sharedPackage, hasDependants: true },
				{ ...corePackage, hasDependants: true },
				{ ...apiPackage, hasDependants: false },
				{ ...webPackage, hasDependants: false }
			]);

			[apiPackage, webPackage].forEach((pkg) => {
				rootPackageJson.scripts[
					pkg.name
				] = `yarn workspace @${projectName}/${pkg.name}`;
			});

			writePackageJson(rootPackageJson);

			enableVSCodeTSSupport();

			addGitIgnore(['yarn-pnp']);

			break;
	}
};
