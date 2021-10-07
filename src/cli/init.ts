import { Inquirer } from 'inquirer';
import { askProjectInfo } from './project';
import { askTemplate } from './template';
import { askTypescript } from './typescript';
import { createProjectFromTemplate } from '../templates';

export const init = async (inquirer: Inquirer) => {
	const projectInfo = await askProjectInfo(inquirer);
	const tsOptions = await askTypescript(inquirer);
	const template = await askTemplate(inquirer, tsOptions.useTypescript);

	createProjectFromTemplate(projectInfo, template);
};
