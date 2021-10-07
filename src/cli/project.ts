import { Inquirer } from 'inquirer';

export const askProjectInfo = async (
	inquirer: Inquirer
): Promise<ProjectInfo> => {
	return inquirer.prompt<ProjectInfo>([
		{
			type: 'input',
			name: 'name',
			message: 'Name of your project'
		},
		{
			type: 'input',
			name: 'description',
			message: 'Description for your project'
		}
	]);
};
