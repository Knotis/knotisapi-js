'use strict';
const AWS = require('aws-sdk');
const uuid4 = require('uuid/v4');
const request = require('request');


class Reporter {
    constructor(globalConfig, options) {
	this._globalConfig = globalConfig;
	this._options = options;
    }


    onRunComplete(contexts, results) {
	const globals = contexts.values().next().value.config.globals;

	const testId = globals.testId;
	const branch = globals.branch;
	const targetEnvironment = globals.targetEnvironment;
	
	const s3 = new AWS.S3();


	// push to s3
	const params = {
	    Key: `${testId}.json`,
	    Body: JSON.stringify(results, null, 2),
	    Bucket: `build-metrics/knotisapi-js/results/integration/${branch}`
	}

	s3.putObject(params, function(err, data) {
	    if (err) console.log(err, err.stack);
	    else console.log(data);
	})


	// push to Slack
	const webhookUrl = process.env.slackWebhookUrl;
	const formattedResults = formatForSlack(results, testId, branch);

	request.post({
	    json: true,
	    body: formattedResults,
	    uri: webhookUrl
	}).on('error', (err) => {
	    console.log(err);
	});

    } 
}

const stripMessage = msg => {
    return msg.replace(/\u{001B}/gu, '')    // kills unicode code points
              .replace(/\[[\d]*[mn]/g, '')  // kills ANSI esc's for color
              .replace(/\n\s+at.*$/gm, ''); // trims stack traces
}

const formatForSlack = (r, testId, branch) => {
    /* META */
    const baseUrl = 'https://integration.knotis.net/log';
    const fullResults = `${baseUrl}/${branch}/${testId}`;
    const testSuites = `${r.numFailedTestSuites} failed, `+
                       `${r.numPassedTestSuites} passed, `+
                       `${r.numTotalTestSuites} total`;
    const tests = `${r.numFailedTests} failed, `+
                  `${r.numPassedTests} passed, `+
                  `${r.numTotalTests} total`;
    const now = new Date().getTime();
    const elapsed = now - r.startTime;
    const time = `${elapsed / 1000}s`;

    /* TESTS */
    const passed = [];
    const failed = [];
    const failedTestsAsSlackAttachments = [];

    // this is pretty verbose... is there a better pattern?
    r.testResults.forEach(testSuite => {
	let filePath = testSuite.testFilePath.replace(__dirname, '.');
	
	if (testSuite.numFailingTests === 0) {
	    passed.push(filePath);
	} else {
	    failed.push(filePath);

	    testSuite.testResults.forEach(test => {
		if (test.failureMessages.length === 0) return test;

		let strippedMessages = test.failureMessages.map(msg => {
		    return `${stripMessage(msg)}\n\n`;
		})

		let testWithoutMessages = Object.assign({}, test);
		delete testWithoutMessages.failureMessages;

		let text = `${strippedMessages.join('')}\n`;
		text += `\`\`\`${JSON.stringify(testWithoutMessages, null, 2)}\`\`\``;

		let testAsSlackAttachment = {
		    fallback: 'Failed test attachment plaintext fallback',
		    color: '#b6313e',
		    mrkdwn_in: [ 'pretext', 'text' ],
		    pretext: `\n\nin *${filePath}*:`,
		    title: `${test.fullName}`,
		    ts: now,
		    text
		}

		failedTestsAsSlackAttachments.push(testAsSlackAttachment);
	    })
	}
    })

    const resultsText = `
Integration tests have been run with code from the *${branch}* branch.

\`\`\`
  TEST SUITES: ${testSuites}
  TESTS:       ${tests}
  TIME:        ${time} 

  ${failed.length ? 'FAILED:' : 'ALL TESTS PASSED!'}
  ${failed.join(', ')}\`\`\`
  
  ---------------------------------------------------------------------
  ${failed.length ? '(╯°□°）╯︵ ┻━┻' : '(◕‿◕✿)'}  See the <${fullResults}|Full Results>
  ---------------------------------------------------------------------
`

    return {
	text: resultsText,
	attachments: failedTestsAsSlackAttachments,
	username: 'knotisapi-js'
    }
}


module.exports = Reporter;
