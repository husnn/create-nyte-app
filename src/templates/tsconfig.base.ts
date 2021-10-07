const config = {
	/* Language and Environment */
	compilerOptions: {
		target: 'es5',
		module: 'commonjs',
		moduleResolution: 'node',
		resolveJsonModule: true,

		rootDir: './src',
		outDir: './dist',

		/* JavaScript Support */
		allowJs: true,
		checkJs: true,

		/* Emit */
		declaration: true,
		declarationMap: true,

		/* Interop Constraints */
		esModuleInterop: true,
		forceConsistentCasingInFileNames: true,

		/* Type Checking */
		strict: true,
		skipLibCheck: true
	}
};

export default config;
