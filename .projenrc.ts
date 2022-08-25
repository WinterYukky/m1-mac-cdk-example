import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.38.1',
  defaultReleaseBranch: 'main',
  name: 'm1-mac',
  github: false,
  projenrcTs: true,
  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
    },
  },
  eslintOptions: {
    dirs: ['src'],
    prettier: true,
  },

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
