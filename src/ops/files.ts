import fs from 'fs';
import path from 'path';

export const createDir = (name: string) => {
	if (!fs.existsSync(name)) {
		fs.mkdirSync(name, { recursive: true });
	}
};

export const createParentDirsIfNotExist = (filepath: string) => {
	createDir(path.dirname(filepath));
};

export const writeJsonFile = (path: string, json: object) => {
	createParentDirsIfNotExist(path);
	const data = JSON.stringify(json, null, 2);
	fs.writeFileSync(path, data);
};

export const writePackageJson = (json: object, basePath = '.') => {
	writeJsonFile(`${basePath}/package.json`, json);
};

export const createFile = (path: string, content = '') => {
	createParentDirsIfNotExist(path);
	fs.writeFileSync(path, content);
};

export const readJsonFile = (path: string) => {
	if (!fs.existsSync(path)) return null;
	const data = fs.readFileSync(path, 'utf-8');
	return JSON.parse(data);
};

const createFileIfNotExists = (path: string) => {
	if (!fs.existsSync(path)) createFile(path);
};

export const readFile = (path: string): Buffer => {
	if (!fs.existsSync(path)) return Buffer.from('');
	return fs.readFileSync(path);
};

export const addToFile = (path: string, content = '') => {
	createFileIfNotExists(path);
	fs.appendFileSync(path, content);
};
