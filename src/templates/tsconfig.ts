const config: {
	compilerOptions: {
		baseUrl: string;
		paths: { [alias: string]: string[] };
	};
} = {
	compilerOptions: {
		baseUrl: './',
		paths: {
			// '@create-nyte-app/core': ['./packages/core/src']
		}
	}
};

export default config;
