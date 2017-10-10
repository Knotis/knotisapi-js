'use strict';

import {
    Client as RestApi,
    Resource
} from 'librestapi';

import extend from 'node.extend';

class Knotis extends RestApi {
    constructor(options) {
        super(options);

        this.User = new Resource(
            this, {
                path: 'auth/user',
                name: 'user'
            }
        );

        this.Image = new Resource(
            this, {
                path: 'media/image',
                name: 'image'
            }
        );

        this.OneUseToken = new Resource(
            this, {
                path: 'auth/onetimeusetoken',
                name: 'one_use_token',
                auth_required: false
            }
        );

        this.User.ImageHistory = this.Image;
        this.User.OneUseToken = this.OneUseToken;

        this.NewUser = new Resource(
            this, {
                path: 'auth/new',
                name: 'new user',
                auth_required: false
            }
        );

        this.ResetPassword = new Resource(
            this, {
                path: 'auth/resetpassword',
                name: 'reset_password',
                auth_required: false
            }
        );

        this.IdentitySwitcher = new Resource(
            this, {
                path: 'identity/switcher',
                name: 'identity_switcher'
            }
        );

        this.Identity = new Resource(
            this, {
                path: 'identity',
                name: 'identity'
            }
        );

        // This one only gets available offers.
        this.Offers = new Resource(
            this, {
                path: 'offers',
                name: 'offers',
                auth_required: false
            }
        );

        // This one is full access to offers.
        this.Offer = new Resource(
            this, {
                path: 'offer',
                name: 'offer',
                auth_required: false
            }
        );

        this.Individual = new Resource(
            this, {
                path: 'identity/individual',
                name: 'individual'
            }
        );

        this.Establishment = new Resource(
            this, {
                path: 'identity/establishment',
                name: 'establishment',
                auth_required: false
            }
        );

        this.Business = new Resource(
            this, {
                path: 'identity/business',
                name: 'business'
            }
        );

        this.Purchase = new Resource(
            this, {
                path: 'transaction/purchase',
                name: 'purchase',
                api_version: 'v2'
            }
        );

        this.Redemption = new Resource(
            this, {
                path: 'transaction/redemption',
                name: 'redemption',
                api_version: 'v2'
            }
        );

        this.ImageUpload = new Resource(
            this, {
                path: 'media/imageinstance',
                name: 'image_upload'
            }
        );

        this.Search = new Resource(
            this, {
                path: 'search',
                name: 'search',
                auth_required: false
            }
        );

        this.PromoCode = new Resource(
            this, {
                path: 'promocode/redeem',
                name: 'promocode_redeem'
            }
        );

        this.MessengerThread = new Resource(
            this, {
                path: 'messenger/thread',
                name: 'messenger_thread'
            }
        );

        this.MessengerMessage = new Resource(
            this, {
                path: 'messenger/message',
                name: 'messenger_message'
            }
        );

        this.MessengerMessageRead = new Resource(
            this, {
                path: 'messenger/message/read',
                name: 'messenger_message_read'
            }
        );

        this.MessengerMessageUnread = new Resource(
            this, {
                path: 'messenger/message/unread',
                name: 'messenger_message_unread'
            }
        );

        this.MessengerMessage.Read = this.MessengerMessageRead;
        this.MessengerMessage.Unread = this.MessengerMessageUnread;

        this.MessengerParticipant = new Resource(
            this, {
                path: 'messenger/participant',
                name: 'messenger_participant'
            }
        );

        this.MessengerAttachment = new Resource(
            this, {
                path: 'messenger/attachment',
                name: 'messenger_attachment'
            }
        );

        this.MessengerView = new Resource(
            this, {
                path: 'messenger/view',
                name: 'messenger_view'
            }
        );

        this.Messenger = {
            Thread: this.MessengerThread,
            Message: this.MessengerMessage,
            Participant: this.MessengerParticipant,
            Attachment: this.MessengerAttachment,
            View: this.MessengerView
        };

        this.TagsTag = new Resource(
            this, {
                path: 'tags/tag',
                name: 'tags_tag'
            }
        );

        this.TagsToken = new Resource(
            this, {
                path: 'tags/token',
                name: 'tags_token'
            }
        );

        this.Tags = {
            Tag: this.TagsTag,
            Token: this.TagsToken
        }

        this.Quests = {
            Quest: new Resource(
                this, {
                    path: 'quests/quest',
                    name: 'quests_quest'
                }
            ),
            Active: new Resource(
                this, {
                    path: 'quests/active',
                    name: 'quests_active'
                }
            ),
            Completed: new Resource(
                this, {
                    path: 'quests/completed',
                    name: 'quests_completed'
                }
            ),
            Tutorial: new Resource(
                this, {
                    path: 'quests/tutorial',
                    name: 'quests_tutorial'
                }
            )
        };

        this.Endpoint = new Resource(
            this, {
                path: 'endpoint',
                name: 'endpoint',
                api_version: 'v1'
            }
        );

        this.Rewards = new Resource(
            this, {
                path: 'rewards',
                name: 'rewards'
            }
        );
    };

    getLocation() {
        return this._location;
    }

    setLocation(reading) {
        this._location = reading.coords;
    }

    request(
        method,
        uri,
        data,
        headers
    ) {
        var gps = this.getLocation();
        if (gps){
            if (!data) {
                data = {};
            }

            data.lat = gps.latitude;
            data.lon = gps.longitude;
        }

        if (
            'undefined' !== typeof data &&
            'undefined' !== typeof data.loc_bypass &&
            data.loc_bypass &&
            data.loc_bypass.lat &&
            data.loc_bypass.lon
        ) {
            data.lat = data.loc_bypass.lat;
            data.lon = data.loc_bypass.lon;
        }

        if(!data){
            data = null;
        }

        return super.request(
            method,
            uri,
            data,
            headers
        );
    };

    authenticate(credentials) {
        let method = 'POST';
        let uri = this.options.auth_uri;

        // Force application/x-www-form-urlencoded because
        // our OAUTH2 endpoint doens't support JSON.
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        return this.request(
            method,
            uri,
            credentials,
            headers
        ).then((response) => {
            if (200 !== response.status_code) {
                //Error Case
                reject(response);
                return;
            }

            this.setCredentials(response.data);

            let responseData = response.data;

            this.User.retrieve(
                null
            ).then((response) => {
                if (200 !== response.status_code) {
                    // error case
                    reject(response);
                    return;
                }

                this.setCredentials({
                    current_identity: response.data.default_identity,
                    current_identity_type: response.data.default_identity_type,
                });

                response.data = extend(responseData, response.data);

                resolve(response);
                return;

            });
        });
    };

    refreshToken(
	refreshToken
    ) {
        return new Promise((resolve, reject) => {
            var credentials = {
                grant_type: 'refresh_token',
                client_id: this.options.api_key,
		client_secret: this.options.api_secret,
		refresh_token: refreshToken
            };

            return this.authenticate(
                credentials
            );
        });
    }
    

    passwordGrant(
        username,
        password
    ) {
        return new Promise((resolve, reject) => {
            var credentials = {
                grant_type: 'password',
                client_id: this.options.api_key,
                username: username,
                password: password
            };

            this.authenticate(
                credentials
            );
        });
    }
}

export default Knotis;
