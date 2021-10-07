import { Inquirer } from 'inquirer';

export const askTypescript = async (
	inquirer: Inquirer
): Promise<{ useTypescript: boolean }> => {
	// return inquirer.prompt<{ useTypescript: boolean }>([
	// 	{
	// 		type: 'confirm',
	// 		name: 'useTypescript',
	// 		message: 'Use Typescript'
	// 	}
	// ]);

	return { useTypescript: true };
};
