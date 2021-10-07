import { Inquirer } from 'inquirer';
import { ProjectTemplate } from '../types/enums';

const getTemplateChoice = (
	ts = true
): Array<{ value: ProjectTemplate; name: string }> => {
	const tsTemplates = [
		{
			value: ProjectTemplate.CLEAN_NEXT_EXPRESS_TS,
			name: 'Clean Next.js + Express'
		}
	];

	return tsTemplates;
};

export const askTemplate = async (
	inquirer: Inquirer,
	useTypescript = false
): Promise<ProjectTemplate | undefined> => {
	// let answer = await inquirer.prompt<{ useTemplate: boolean }>([
	// 	{
	// 		type: 'confirm',
	// 		name: 'useTemplate',
	// 		message: 'Use template'
	// 	}
	// ]);

	// if (!answer.useTemplate) return;

	let answer2 = await inquirer.prompt<{ template: ProjectTemplate }>([
		{
			type: 'list',
			name: 'template',
			choices: getTemplateChoice(useTypescript)
		}
	]);

	return answer2.template;
};
