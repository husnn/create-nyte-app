const config: {
	extends: string;
	compilerOptions: {
		rootDir: string;
		outDir: string;
		composite: boolean;
	};
	references: Array<{
		path: string;
	}>;
	include: string[];
	exclude: string[];
} = {
	extends: '../../tsconfig.base.json',
	compilerOptions: {
		rootDir: 'src',
		outDir: 'dist',
		composite: false
	},
	references: [],
	include: ['src/**/*'],
	exclude: ['node_modules']
};

export default config;
