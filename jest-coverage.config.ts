import jestConfig from './jest.config';
import jeste2eConfig from './jest-e2e.config';

export default {
  ...jestConfig,
  testRegex: [jestConfig.testRegex, jeste2eConfig.testRegex],
};
