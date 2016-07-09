'use strict';

import {
    Client as RestApi,
    Resource
} from 'librestapi';

import Promise from 'promise';
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

        this.OfferCollection = new Resource(
            this, {
                path: 'offer/collection',
                name: 'offer_collection',
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

        this.RedemptionScan = new Resource(
            this, {
                path: 'qrcode/redeem',
                name: 'redemptionscan'
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

        this.ImageReview = new Resource(
            this, {
                path: 'media/review',
                name: 'image_review'
            }
        );

        this.StripeCustomer = new Resource(
            this, {
                path: 'stripe/customer',
                name: 'stripe_customer'
            }
        );

        this.StripeCustomerCard = new Resource(
            this, {
                path: 'stripe/customer/card',
                name: 'stripe_customer_card'
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

        this.Passport = new Resource(
            this, {
                path: 'passport',
                name: 'passport'
            }
        );

        this.Passport.redeem = function(id, page, callback, data) {
            var method = 'PUT';

            if (null === id) {
                throw 'Passport.redeem method requires id parameter.';

            }

            if (null === page) {
                throw 'Passport.redeem method requires page parameter.';

            }

            var uri = [
                this.api.options.api_root,
                this.options.api_version,
                this.options.path,
                id,
                page,
                'redeem',
                ''
            ].join('/');

            this.request(
                method,
                uri,
                callback,
                data
            );
        }

        this.Passport.connect = function(id, callback, data) {
            var method = 'PUT';

            if (null === id) {
                throw 'RestResource.connect method requires id parameter.';
            }

            var uri = [
                this.api.options.api_root,
                this.options.api_version,
                this.options.path,
                id,
                'connect',
                ''
            ].join('/');

            this.request(
                method,
                uri,
                callback,
                data
            );
        };

        this.DailyRewardDraw = new Resource(
            this, {
                path: 'rewards/daily',
                name: 'rewards_daily'
            }
        );

        this.DailyRewardSkip = new Resource(
            this, {
                path: 'rewards/daily/skip',
                name: 'rewards_daily_skip'
            }
        );

        this.DailyRewardClaim = new Resource(
            this, {
                path: 'rewards/daily/claim',
                name: 'rewards_daily_claim'
            }
        );

        this.DailyReward = new Resource(
            this, {
                path: 'rewards/daily',
                name: 'rewards_daily'
            }
        );

        this.DailyReward.Draw = this.DailyRewardDraw;
        this.DailyReward.Skip = this.DailyRewardSkip;
        this.DailyReward.Claim = this.DailyRewardClaim;

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
        });
    }
}

export default Knotis;
