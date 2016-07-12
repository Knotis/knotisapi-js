.. _basics:

Getting Started
===============

Initializing the Library
------------------------

Initializing the library is easy. It only requires passing in a simple configuration object similar to the following:

.. code-block:: js
    :linenos:

    let options = {
        api_key: '<your api key>',  //DO NOT SAVE IN YOUR REPOSITORY
        api_secret: '<your api secret>',  //DO NOT SAVE IN YOUR REPOSITORY
        api_root: 'https://knotis.com/api',
        auth_uri: 'https://knotis.com/oauth2/token'
    }

Once you have your configuration object generated initilizing the api is as simple as:

.. code-block:: js
    :linenos:

    import Knotis from 'knotisapi';
    let KnotisApi = new Knotis(options);


Working with Resources
----------------------

The Knotis API is a RESTful API and like a good REST API it's interface is divided into Resources.

Standard Methods
++++++++++++++++

Each resource comes with standard definitions for making requests.

create
******

The create method submits a HTTP **POST** request to the endpoint defined by the resource. As the name implies it's intended to create the data required to generate a new resource instance.

The create method takes one parameter: *data*, which is a Javascript object containing the fields to submit with the POST.

.. code-block:: js
    :linenos:

    KnotisApi.SomeResource.create({
        field1: 'some data',
        fiedl2: 'some more data'
    }).then(response => {
        // 200 response.

    }).catch(response => {
        // Request failed.

    });

update
******

The update method submits a HTTP **PUT** request to the endpoint defined by the resource. The call signature is similar to the create method but it requires an additional *id* paramter that identifies the resource to be updated.

.. code-block:: js
    :linenos:

    KnotisApi.SomeResource.update(
        '<id of your resource (probs a GUID)>', {
        field1: 'some data',
        fiedl2: 'some more data'
    }).then(response => {
        // 200 response.

    }).catch(response => {
        // Request failed.

    });

retrieve
********

The retrieve method submits a HTTP **GET** request to the endpoint defined by the resource.

There are two optional parameters that can be passed into retrieve:

* *id*: this is the identifier (usually a GUID) of the specific resource you want to retrieve. if no id is passed then a paginated list of available resource instances will be returned in the response.
* *data*: this is a Javascript object containing parameters that will be added to the query string.

.. code-block:: js
    :linenos:

    KnotisApi.SomeResource.retrieve(null, {
        param1: 'param1data',
        param2: 'param2data' // These will be passed along in the query string of the URI.
    }).then(response => {
        // 200 response contains a paginated list of results

    }).catch(response => {
        // Request failed.

    });


destroy
*******
Finally the destoy method submits a HTTP **DELETE** request to the endpoint defined by the resource.

There is one required parameter:

* *id*: this is the identifier (usually a GUID) of the specific resource you want to destroy. 

.. code-block:: js
    :linenos:

    KnotisApi.SomeResource.destroy('<id to destroy>').then(response => {
        // 200 OK if resource was destroyed successfully.

    }).catch(response => {
        // Request failed.

    });

Custom Methods
--------------

There are a couple places where the standard REST url layout doesn't fit with the operations we want to perform through the api. In these rare cases there are custom methods on the Resource to facilitate operating on this data. Please see the individual documentation for each resource for more information on wether there are custom methods you should be aware of.

Location Awareness
------------------

Several resources on Knotis have location awareness built in and results will be sorted from closest to furthest from a point provided by passing a lattitude and longitude along with the request to the location aware resource. This can be handled automatically by this library by calling the setLocation method on the KnotisApi object.

.. code-block:: js
    :linenos:

    KnotisApi.setLocation({ coords: {
        latitude: 47.6062,
        longitude: 122.3321
    }});  // These will be passed along in the query string of the URI for every request.

Authentication
==============

Grant Types
-----------

There is API support for more grant types but currently the only one exposed in this library is:

password_grant
++++++++++++++

**password_grant** is an elevated privilage only allowed on trusted partner clients. Password grant allows you to pass along a user's username and password directly through your client in exchange for access credentials.

Trigger a password_grant request by calling the passwordGrant method on the KnotisApi object:

.. code-block:: js
    :linenos:

    KnotisApi.passwordGrant('<username>', '<password>').then(response => {
        // Authentication succedded process response here.

    }).catch(response => {
        // Something bad happened.

    });

The response object on a sucessful credentials request will contain an access_token that needs to be submited as a header to all endpoint requiring user authentication

            ``-H "Authorization: Bearer <access_token>"``

This is all handled internally by the library and will be added to all requests automatically after authenticating a user.

If there is no matching user/password combination the current behavior is to create an authentication object for that username/password and proceed with authentication.


User Information
----------------

After a user is authenticated it is helpful to know some additional information about the user. You can retrieve some basic information by calling the retrieve method User resource.

.. code-block:: js
    :linenos:

    KnotisApi.User.retrieve().then(response => {
        // Response contains User information object.

    }).catch(response => {
        // Something bad happened.

    });


A successful response will look something like the following:

.. code-block:: json
    :linenos:

    HTTP 200 OK
    Content-Type: application/json
    Vary: Accept
    Allow: GET

    {
        "id": "2235514c-fc64-48d8-8462-9a776542c669",
        "default_identity_type": 0,
        "username": "seth@knotis.com",
        "pk_token": "token(2235514c-fc64-48d8-8462-9a776542c669)",
        "mobile_app_installed": false,
        "_denormalized_auth_User_username_pk": "6135e5b4-3f5f-418e-9f5f-662a3c0e05ab",
        "user": "6135e5b4-3f5f-418e-9f5f-662a3c0e05ab",
        "default_identity": "3c7fa04b-0297-4657-839b-fc68fc543cfe"
    }

The most useful fields are probably username, default_identity and default_identity_type. Learn more about identities in the next section.

A call to the User resource happens automatically upon sucessful authentication to get the users default_identity and default_identity_type and set it as the current_identity and current_identity_type respectively. The API will make all requests as this identity. If you want to change the current identity you can do so by making a call to KnotisApi.setCredentials().

.. code-block:: js
    :linenos:

    KnotisApi.setCredentials({
       current_identity: '<id guid of the identity the API should be acting as>'.
       current_idenitty_type: '<(int) the type of the identity (used for quick failing permissions)>'
    });
              

Available Identities
--------------------

Users on the Knotis platform have an additional layer of authentication known as identities. All new users come with an Individual identity by default but there are other cases where a user may have multiple identities that they can act as (this includes business owners and super users).

The default_identity field from the User resource in the previous section tells us the identity that the user was last acting as.

To view all of a users available identity's use the IdentitySwitcher resource as follows:

.. code-block:: js
    :linenos:

    KnotisApi.IdentitySwitcher.retrieve().then(response => {
        // Response contains list of available identities.

    }).catch(response => {
        // Something bad happened.

    });


A successful response will look something like the following:

.. code-block:: json
    :linenos:

    HTTP 200 OK
    Content-Type: application/json
    Vary: Accept
    Allow: GET, HEAD, OPTIONS

    [
        {
            "id": "3c7fa04b-0297-4657-839b-fc68fc543cfe",
            "badge_image": null,
            "name": "My Profile",
            "identity_type": 0
        },
        ... additional identities
    ]

It is always a good idea to check the users current identity against their available identities in case their identity's have been changes on another platform.

Reset Password
--------------

Reseting a password is pretty simple. Create a password reset request as so:

.. code-block:: js
    :linenos:

    KnotisApi.ResetPassword.create({
        email: '<email of user you want to reset>'
    }).then(response => {
        // Request sent or email not found.

    }).catch(response => {
        // Something bad happened.

    });

Creating Users
--------------

Creating new users is handled by calling create on the NewUser resource:

.. code-block:: js
    :linenos:

    KnotisApi.NewUser.create({
        email: '<email of user you want to reset>',
        password: '<user's requested password>'
    }).then(response => {
        // Response contains user and identity information

    }).catch(response => {
        // Something bad happened.

    });


Identities
==========

Any identity that an authenticated user has permissions to view on the Knotis platform can be retrieved if they have access to the GUID representing the identity by calling:

.. code-block:: js
    :linenos:

    KnotisApi.Identity.retrieve('<id=guid>').then(response => {
        // response object contains Identity information

    });

The id parameter is required on this resource as paginated listing of the identities on Knotis is not allowed.


Individual
----------
All new users are given an Individual identity to represent them on Knotis. This is the only identity that will come back from IdentitySwitcher on a freshly created user.

Individual identities are a subset of Identity and can also be retrieved via the Identity resource. This endpoint is here mostly for convienience and to support future Individual resource behavior and functionality.

Establishment
-------------

Establishment data is the data that can be seen on the knotis home page ( https://knotis.com/ ). This is an accounting of all storefronts that are indexed by Knotis. This endpoint is location aware and results will be sorted from closest to farthest from a point set by calling KnotisApi.setLocation().

To get a paginated list of Establishments call retrieve():

.. code-block:: js
    :linenos:

    KnotisApi.Establishment.retrieve().then(response => {
        // response object contains paginated list of establishments.

    });

.. code-block:: json
    :linenos:

    HTTP 200 OK
    Content-Type: application/json
    Vary: Accept
    Allow: GET, OPTIONS
    
    {
        "count": 2181862,
        "next": "https://stage-aws-cloud.knotis.net/api/v0/identity/establishment/?page=2",
        "previous": null,
        "results": [
            {
                "id": "c4187615-d927-4597-9f61-479d53b66e9f",
                "identity_type": 2,
                "name": "Oceanaire Seafood Room",
                "badge_image": null,
                "banner_image": {
                    "url": "https://stage-aws-cloud.knotis.net/static/images/tile-background-default.png"
                },
                "tile_image_large": "https://stage-aws-cloud.knotis.net/static/images/tile-background-default.png",
                "tile_image_small": "https://stage-aws-cloud.knotis.net/static/images/tile-background-default.png",
                "location": {
                    "latitude": 47.614063,
                    "longitude": -122.33545,
                    "address": "1700 7th Ave Seattle WA 98101"
                }
            },
            ... additional establishments
        ]
    }
        
Business
--------

Businesses are collections of establishments. A business may have one or more establishments that are managed by managers of the business.

Rewards
=======

Knotis provides several ways to interact with rewards and promotions and reward them to identies.

Daily Reward
------------

The Daily Reward feature gives identities a chance to select 1 offer from a random set of offers per day as a way to incentivize the user to take pictures and redeem offers at participating establishments.

To view all rewards available to be earned call the list() method on the DailyReward resource object.

.. code-block:: js
    :linenos:

    KnotisApi.DailyReward.list().then(response => {
        // response object contains list of rewards that can be earned
        
    });

An example response looks like this:

.. code-block:: json
    :linenos:

    {
        "count": 5,
        "next": null,
        "previous": null,
        "results": [
            {
                "id": "f56ecc84-b335-42b5-a9ee-05aec720808a",
                "offer_type": 2,
                "title": "$5 credit toward any purchase",
                "description": null,
                "restrictions": "$25.00 Minimum Minimum",
                "start_time": "2016-06-07T12:28:34",
                "end_time": null,
                "stock": null,
                "unlimited": true,
                "purchased": 40,
                "redeemed": 0,
                "published": false,
                "active": false,
                "completed": false,
                "last_purchase": "2016-07-07T23:21:15",
                "banner_image": {
                    "url": null,
                    "id": null
                },
                "badge_image": {
                    "url": null,
                    "id": null
                },
                "tile_image_large": null,
                "tile_image_small": null,
                "location": {
                    "latitude": 47.603871,
                    "longitude": -122.32942
                }
            },
	    ... additional results sorted by distance
	]
    }


Draw
++++

Drawing a list of offers can be done by calling retrieve on the KnotisApi.DailyReward.Draw resource.

.. code-block:: js
    :linenos:

    KnotisApi.DailyReward.Draw.retrieve().then(response => {
        // response object contains list of offers to draw from.

    });


.. code-block:: json
    :linenos:

    {
        "rewards":[
            {
                "id":"8e52e8ca-6ccc-40b0-9317-f3eff3f9c4ae",
                "owner":{
                    "id":"6ed25ef6-a364-496d-a7ce-4b2a13d92aa1",
                    "identity_type":2,
                    "name":"Apple Store University Village",
                    "backend_name":"apple-store-university-village",
                    "description":"",
                    "available":true,
                    "badge_image":null,
                    "banner_image":{
                        "url":"https://stage-aws-cloud.knotis.net/media/cache/f6/67/f6673775e6dcec3c7c4f7e5eb487063d.jpg",
                        "pub_date":"2016-06-07T11:59:24.876000",
                        "id":"343a1209-395a-40ff-9022-c13930cba000"
                    },
                    "tile_image_large":"https://stage-aws-cloud.knotis.net/media/cache/20/af/20af7094868b9ef1c8caae50974466e3.jpg",
                    "tile_image_small":"https://stage-aws-cloud.knotis.net/media/cache/be/1c/be1cedd13fd6324011011ac4784d8e60.jpg",
                    "location":{
                        "latitude":47.664168,
                        "longitude":-122.305423,
                        "address":"4702 NE University Village Pl Seattle WA 98105"
                    },
                    "carousel_images":[{
                        "url":"https://stage-aws-cloud.knotis.net/media/cache/f6/67/f6673775e6dcec3c7c4f7e5eb487063d.jpg",
                        "pub_date":"2016-06-07T11:59:24.876000",
                        "id":"343a1209-395a-40ff-9022-c13930cba000"
                    }]
                },
                "offer_type":2,
                "title":"$5 credit toward any purchase",
                "description":null,
                "restrictions":"$25.00 Minimum Minimum",
                "start_time":"2016-06-07T12:28:35.128000",
                "end_time":null,
                "stock":null,
                "unlimited":true,
                "purchased":26,
                "redeemed":0,
                "published":false,
                "active":false,
                "completed":false,
                "last_purchase":"2016-06-16T22:08:43.167000",
                "price":5.0,
                "price_retail":5.0,
                "banner_image":{
                    "url":"https://stage-aws-cloud.knotis.net/media/cache/35/a2/35a24ea1bef8b69c335c6ec8c0abd6e8.jpg",
                    "pub_date":"2016-06-07T13:11:42.666000",
                    "id":"57557bfb-e297-4224-8284-c514400cac6d"
                },
                "badge_image":null,
                "tile_image_large":"https://stage-aws-cloud.knotis.nethttps://stage-aws-cloud.knotis.net/media/cache/09/83/0983357dc3317738894464243c92ca7e.jpg",
                "tile_image_small":"https://stage-aws-cloud.knotis.nethttps://stage-aws-cloud.knotis.net/media/cache/25/76/257669b52487275c665c413ef7cfff7e.jpg",
                "location":null
            },
            ... additional offers.
        ],
        "actions_remaining":3,
        "last_action_time":"0001-01-01T00:00:00"
    }

Skip
++++

If an identity is not interested in a reward they can skip it to have a chance to view another one. Skip a reward by calling KnotisApi.DailyReward.Skip.create().

.. code-block:: js
    :linenos:

    KnotisApi.DailyReward.Skip.create({
        offer: '<reward_id=guid>'
    }).then(response => {
        // response contains info about the skip
    
    });

The response data contains information about the skip.
               
Claim
+++++

If the identity is interested in claiming a daily reward they call KnotisApi.DailyReward.Claim.create().

.. code-block:: js
    :linenos:

    KnotisApi.DailyReward.Claim.create({
        offer: '<reward_id=guid>'
    }).then(response => {
        // response contains info about the claim.
    
    });

The response data contains information about the claimed offer.

Purchase
--------

Purchases represent rewards that have been acquired by an identity either by purchasing offers, claiming daily rewards, or recieving random rewards from uploading pictures.

To get a paginated list of a users purchases call KnotisApi.Purchase.retreive().

.. code-block:: js
    :linenos:

    KnotisApi.Purchase.retrieve().then(response => {
        //response Contains paginated list of earned rewards.
    });

The response looks as follows:

.. code-block:: json
    :linenos:

    {
        "count": 1,
        "next": null,
        "previous": null,
        "results": [
            {
                "id": "c1af70cf-d483-4baa-927a-1a835e4bb16e",
                "owner": "3c7fa04b-0297-4657-839b-fc68fc543cfe",
                "offer_owner_id": "03e22a4a-607d-485d-8f45-488db0f878e6",
                "offer_owner_name": "Victrola Coffee",
                "redemption_code": "RB9A3O9XKA",
                "transaction_type": "purchase",
                "offer_id": "7b09961d-d73d-4ae6-970f-919435c08c85",
                "transaction_context": "3c7fa04b-0297-4657-839b-fc68fc543cfe|4227ab7ae27f7158230fc329000b32e42ab97838|RB9A3O9XKA|free",
                "reverted": false,
                "offer_badge_image": null,
                "offer_banner_image": {
                    "url": "https:\/\/stage-aws-cloud.knotis.net\/media\/cache\/d2\/77\/d277d7b956733e205f14d212b72ea8bf.jpg",
                    "pub_date": "2016-06-07T13:11:42.430000",
                    "id": "aa53a1cf-1d8e-4fdd-b29b-ea747e3add80"
                },
                "offer_title": "$5 credit toward any purchase",
                "offer_location": null,
                "restrictions": "$25.00 Minimum Minimum",
                "pub_date": "2016-06-20T15:52:47.258000"
            }
        ]
    }

The Purchase endpoint is location aware and Purchases will be sorted closest to farthest from a point specified by calling KnotisApi.setLocation().
    
Redemption
----------

Redemption of a purchase is the final stage in the contract allowing the identity to confirm that goods and services have been satisfactorly rendered by the establishment where the identity had a earned reward available.

Create a redemption by calling KnotisApi.Redemption.create().

.. code-block:: js
    :linenos:

    KnotisApi.Redemption.create({
        transaction: '<purchase_id=id guid of the purchase to redeem>'
    }).then(response => {
        // response contains metadata about the redemption.

    });


After redeeming a purchase it will no longer be returned in the results that come from calling KnotisApi.Purchase.retrieve().

Uploading Images
================

Image upload features allow identities to upload images related to other resources on Knotis.


ImageUpload
-----------

Uploading an image requires a call to KnotisApi.ImageUpload.create().

.. code-block:: js
    :linenos:

    KnotisApi.ImageUpload.create({
        image: '<base64encoded image data>',
        related_id: '<id guid of the object this is an image of>',
        name: '<title or caption of the image>',
        context: '<additional contextual information>'
    }).then(response => {
        // The image has been uploaded sucessfully
    });

After uploading an image the server pushes the image to the Knotis CDN and saves the metadata in our database. The static URI of the uploaded asset can be found in the response data.

ImageReview
-----------

Even if you do not allow uploading images in your app it is always a good idea to implement a way for identities using your app to flag an image as inapropriate or abusive.

To flag an image for review call KnotisApi.ImageReview.create().

.. code-block:: js
    :linenos:

    KnotisApi.ImageReview.create({
       'image_id': '<id guid of the image to flag>'
    }).then(response => {
        // The image has been flagged for review.
    });

After flagging an image for review it is a good idea to remove the image from the UI of your app and remember the ID so you can avoid rendering it until the image has been removed from Knotis by an administrator.


Tags
====

The **Tags** system allows attaching keywords to arbitrary data objects. There are two resources that make up Tags.

Token
-----
A Token is a keyword (maybe I should have named this keyword but oh well) that can be attached to an object. To get a paginated list of all tokens call the retrieve method on the Token resource.

.. code-block:: js
    :linenos:

    KnotisApi.Tags.Token.retrieve().then(response => {
        //200 response contains a paginated list of token keyword instances.

    });

If you want to create a new Token keyword without attaching it to an object you can call the create method.

.. code-block:: js
    :linenos:

     KnotisApi.Tags.Token.create({
         token: 'somekeyword'
     }).then(response => {
         // 200 response contains the created token data
     });
 
Tag
---

The Tag resource represents the relationship between a token keyword and another object in the database. A Token can be attached to any object with a primary key or id; even another Tag or Token.

to create a tag call the create() method on the Tag resource.

.. code-block:: js
    :linenos:

    KnotisApi.Tags.Tag.create({
        token: 'somekeyword',
	related: '<id/primary_key of the object to be tagged>'
    }).then(response => {
        // 200 response contains created tag fields.

    });

There is no need to first create a token as this operation will automatically create the internal Token object if one doesn't already exists for this keyword.

Retreiving tags and tagged instances can be achieved by calling retrieve() on the Tag resource.

.. code-block:: js
    :linenos:

    KnotisApi.Tags.Tag.retrieve(null, {
        token: 'somekeyword'
    }).then(response => {
        // 200 response contains paginated list of objects tagged with "somekeyword".

    });

The inverse of this operation is getting all of the tags that have been attached to an object.

.. code-block:: js
    :linenos:

    KnotisApi.Tags.Tag.retrieve(null, {
        related: '27d92c4a-149f-4096-8fbb-ea9e8c899275'
    }).then(response => {
        // 200 response contains paginated list of tags related to the object id.

    });

Note: Setting both token and related will always return 1 result as this combination is unique for each tag.


Promotional Codes
=================

Search
======

QR Codes
========

RedemptionScan
--------------

Stripe
======

StripeCustomer
--------------

StripeCustomerCard
------------------

Messenger
=========

Thread
---------------

Message
----------------

Read
++++

Unread
++++++

Participant
--------------------

Attachment
----------

View
----

Offer/Offers
------------

Offer is a low level financial contract for exchanging goods and currency. These API endpoints are being deprecated in favor of higher level abstractions like Purchases and Rewards.

Offer
+++++

The offer resource exposes all offers on Knotis wether they are available for purchase or not. This is useful for showing an identity their expired offers or allowing an identity to view a purchased offer that is no longer available for puchase but can still be redeemed. There is no listing allowed on this resource so only retrieve with an id is supported.

.. code-block:: js
    :linenos:

    KnotisApi.Offer.retrieve().then(response => {
        // response contains list of offers that are available for purchase.
    
    });

    KnotisApi.Offer.retrieve('<offer_id=guid>').then(response => {
        // response contains a single offer matching offer_id
    
    });


Offers
++++++

**Deprecated**.

The Offers resource exposes all valid and available offers on Knotis. If the offer is valid for purchase it will be listed here by calling retrieve:

.. code-block:: js
    :linenos:

    KnotisApi.Offers.retrieve().then(response => {
        // response contains list of offers that are available for purchase.
    
    });

    KnotisApi.Offers.retrieve('<offer_id=guid>').then(response => {
        // response contains a single offer matching offer_id
    
    });


OfferCollection
---------------

**Deprecated**.

OfferCollection are custom indexes of offers that serve specific use cases. An example of an OfferCollection might be "All Offers In Seattle" or "All Resturaunts".

Passports
=========

**Deprecated**.

