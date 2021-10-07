import execa from 'execa';

export const installYarnLatest = () => {
	console.log('Installing latest Yarn version...');

	execa.commandSync(`yarn set version berry`);
	execa.commandSync(`yarn set version latest`);
};

export const enableVSCodeTSSupport = () => {
	console.log('Enabling Typescript support for VS Code...');

	execa.command(`yarn dlx @yarnpkg/sdks vscode`);
};
