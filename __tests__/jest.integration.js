const uuid4 = require('uuid/v4');


module.exports = {
    reporters: [
	"default",
	"./reporter"
    ],
    testRegex: "(/__tests__/integration/.*(\\.|/)(test|spec))\\.jsx?$",
    globals: {
	branch: process.env.GIT_BRANCH,
	testId: process.env.TEST_ID ? process.env.TEST_ID : uuid4(),
	targetEnvironment: process.env.TARGET_ENVIRONMENT
    }
};
