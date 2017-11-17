'use strict';

import Knotis from '../../src/index';
import getUUID from 'uuid/v4';

const self = this;

module.exports.connect = () => {
    const clientApiKey = process.env.clientApiKey;
    const targetUri = process.env.targetUri;

    let options = {
	api_key: clientApiKey,
	api_root: `${targetUri}/api`,
	auth_uri: `${targetUri}/oauth2/token/`
    }

    return new Knotis(options);

};

module.exports.connectWithNewUser = () => {
    const KnotisApi = self.connect(),
          username = getUUID(),
	  password = getUUID();
    
    return new Promise((resolve, reject) => {
	KnotisApi.NewUser.create({
	    username, 
	    password
	}).then(res => {
	    // check is necessary as endpoint returns status_code: OR status:
	    if (res.status_code && res.status_code === 200) {
		KnotisApi.passwordGrant(username, password).then(res => {
		    resolve({ KnotisApi, sessionInfo: res.data });

		});

	    } else {
		console.log('Problem with request: \n', res);
		reject(res);

	    }

	});

    });

};

module.exports.sum = (a, b) => a + b;
