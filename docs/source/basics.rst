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

One Time Use Tokens
-------------------

One time use tokens are temporary passwords that can be generated for users. In order to create a one-time use token make a create call on the OneUseToken resource.

.. code-block:: js
    :linenos:

    KnotisApi.OneUseToken.create({
        email: 'someone@example.com'
    }).then(response => {
       // response will indicate success or failure.
    });

Once the temporary password is created it will be sent to the email address passed into the create method. The password will never be returned through the api. Only a person who controls the specified email address should be able to access the temporary password.

The temoporary password can be used to authenticate the user using the password_grant authentication grant type.

User Information
----------------

After a user is authenticated it is helpful to know some additional information about the user. You can list some basic information by calling the retrieve method User resource.

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
        username: '<username of the new user (could be an email or guid)>',
        password: '<user's requested password or an unusable one>'
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
        
Rewards
=======

Knotis provides several ways to interact with rewards and promotions and reward them to identies.

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

Media
=====

Images
------

Image upload features allow identities to upload images related to other resources on Knotis.


Uploading Images
++++++++++++++++

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

Listing User Images
++++++++++++++++++++++

Listing images that belong to the current identity is achieved by making a retrieve call on the Image resource.

.. code-block:: js
    :linenos:

    KnotisApi.Image.retrieve().then(response => {
       // response contains a list of images.
    });

This request only lists images where the current identity is the owner. It returns an empty list if no images are avaialable.

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

Quests
======

Quests allow conditions to be defined as key/value pairs and verification that these conditions have been met and executing business logic upon completion. Quest work similarly to how quests work in a video role-playing game or missions in a first-person shooter.

Quest
-----

Quests that are available for a user to activate/accept are retrieved by making a retreive request to the Quests.Quest resource.


.. code-block:: js
    :linenos:

    KnotisApi.Quests.Quest.retrieve().then(response => {
        // 200 response contains paginated list of available quests.

    });
    
Active
------

Active quests are quests that the user can currently work towards completing checks.

retrieving a users currently active quests is similar to retrieving available quests only using the Active resource.

.. code-block:: js
    :linenos:

    KnotisApi.Quests.Active.retrieve().then(response => {
        // 200 response contains paginated list of the current identity's active quests.

    });


To activate a quest for an identity you call the create method on the Active resource.

.. code-block:: js
    :linenos:

    KnotisApi.Quests.Active.create({
        quest: '<The ID for the Quest to accept (GUID)>'
    }).then(response => {
        // 200 response contains a JSON object representing the newly accepted quest.

    });

Some quests require additional information to be collected for the Quest Checks to pass. This information is stored on the Active quest model. Update it by calling the update method on the active resource.

.. code-block:: js
    :linenos:

    KnotisApi.Quests.Active.update('<The ID for the Active quest to update (GUID)>', {
        param1: 'Arbitrary value 1',
	param2: 'Arbitrary value 2'
    }).then(response => {
        // 200 response contains the updated JSON object representing the accepted quest.

    });

    
Completed
---------

Completed quests are quests the user has already completed.

retrieving a users Completed quests is similar to retrieving active quests only using the Completed resource.

.. code-block:: js
    :linenos:

    KnotisApi.Quests.Completed.retrieve().then(response => {
        // 200 response contains paginated list of the current identity's completed quests.

    });

To attempt to complete a quest for an identity you call the create method on the Completed resource. Attempting to create a completed quest object is not guaranteed to succed. If all the conditions of the quest are not meet a 5XX response will be returned indicating that the checks did not pass.

**NOTE**: You must pass in the ID for the quest; not the id for the active quest object.

.. code-block:: js
    :linenos:

    KnotisApi.Quests.Completed.create({
        quest: '<The ID for the Quest to complete (GUID)>'
    }).then(response => {
        // 200 response contains a JSON object representing the newly accepted quest.
        // 500 response means quest completion checks failed.

    });

Search
======

A search query can be executed against all establishments based on the name of the business. The parameter "q" is used to pass the query content.

.. code-block:: js
    :linenos:

    KnotisApi.Search.retrieve(null, {
        q: 'search query'
    }).then(response => {
       // response contains a list of establishments that match 'search query'
    });

Promotional Codes
=================

Knotis supports string based promotional codes to be redemed through the api.

.. code-block:: js
    :linenos:

    KnotisApi.PromoCode.create({
        promo_code: '12345abc'
    }).then(response => {
       // Response contains confirmation that the promocode was executed sucessfully.
       
    });

Due to the arbitrary nature of promo codes the responses can vary. However they should return id's to any resources created as a side effect of executing this promo code.

Messenger
=========

Messenger is the system that handles internal communications such as notifications and chat. Messenger functionality is divided into seven (7) resources. 

Thread
------

The core of messenging is the Thread. Threads can be thought of like IRC #channels or even an email thread.

To create a thread you make a call to Messenger.Thread.create()

.. code-block:: js
    :linenos:

    KnotisApi.Messenger.Thread.create({
        participants: [<Identity ID GUID 0>,<Identity ID GUID 1>, ...]
    }).then(response => {
        // 200 response contains a JSON object representing the newly created thread.
        // 500 response means something bad happened.

    });

Message
-------

To send a message you must first have an "id" for a Thread that has been created. Pass the "id" of the thread to the Messenger.Message.create() method.

.. code-block:: js
    :linenos:

    KnotisApi.Messenger.Message.create({
        thread: '<id of the thread to send this message to>',
	content: 'The text of the message.',
	sender: '<id of the sending Identity>,
	attachments: ['<File URI to attach0>', '<File URI to attach1>', ...]
    }).then(response => {
        // 200 response contains a JSON object representing the newly created message.

    });

NOTE: The **attachments** field is optional.

You can list all of an identity/participant's  messages sorted by creation time by calling Messenger.Message.retrieve(). You can also filter messages by Thread id.

.. code-block:: js
    :linenos:

    KnotisApi.Messenger.Message.retrieve(
        null, {
            thread: '<id of the thread to send this message to>'
	}
    ).then(response => {
        // 200 response contains a JSON object representing the newly created thread.
        // 500 response means quest completion checks failed.

    });

Read
++++

If you only want to see read messages use the Messenger.Message.Read.retrieve() method.

.. code-block:: js
    :linenos:

    KnotisApi.Messenger.Message.Read.retrieve(
        null, {
            thread: '<id of the thread to send this message to>'
	}
    ).then(response => {
        // 200 response contains a JSON object representing the newly created thread.
        // 500 response means quest completion checks failed.

    });

Unread
++++++

If you only want to see unread messages use the Messenger.Message.Unread.retrieve() method.

.. code-block:: js
    :linenos:

    KnotisApi.Messenger.Message.Unread.retrieve(
        null, {
            thread: '<id of the thread to send this message to>'
        }
    ).then(response => {
        // 200 response contains a JSON object representing the newly created thread.
        // 500 response means quest completion checks failed.

    });

Participant
--------------------

Sometimes you might want to render the other participants that are active in a thread. To do this you can call Messenger.Participant.retrieve()

.. code-block:: js
    :linenos:

    KnotisApi.Messenger.Participant.retrieve(
        null, {
            thread: '<id of the thread to retrieve participants for.>'
        }
    ).then(response => {
        // 200 response contains a JSON array of the participants.

    });

If you already created a thread you can add an additional participant to it by calling Messenger.Participant.create().

.. code-block:: js
    :linenos:

    KnotisApi.Messenger.Participant.create({
        thread: '<id of the thread to add the participant to.>',
	identity: '<id of the Identity to be added to the thread.>'
    }).then(response => {
        // 200 response contains a JSON object of the created participant.

    });

To remove a participant from a Thread call Messenger.Participant.delete().

.. code-block:: js
    :linenos:

    KnotisApi.Messenger.Participant.delete('<ID GUID of the Identity to remove from the thread>').then(response => {
        // 200 response contains an OK.

    });

View
----

The View resource provides tracking for whether a message has been viewed and how many times. It is up to the client to determine what qualifies as a View.

To create a view call Messenger.View.create()

.. code-block:: js
    :linenos:

    KnotisApi.Messenger.View.create({
        viewer: '<id of the Identity that has viewd the message.>',
	message: '<id of the Message that was viewed.>'
    }).then(response => {
        // 200 response contains a JSON object of the view metadata.

    });

Attachment
----------

Attachments are simply URI strings that represent an external resource. This can be a dropbox uri or the uri of an image that was uploaded to Knotis. Currently only rendering images is supported.

To create an attachment call Messenger.Attachment.create().

.. code-block:: js
    :linenos:

    KnotisApi.Messenger.View.create({
        message: '<id of the Message to attach the file.>',
	file_uri: '<URI of the file to attach>'
    }).then(response => {
        // 200 response contains a JSON object of the attachment metadata.

    });
