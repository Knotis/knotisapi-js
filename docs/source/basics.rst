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
        auth_uri: 'https://knotis.com/oauth2/token',
        request_timeout: 5000 //optional client side timeout
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

example
^^^^^^^
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

example
^^^^^^^
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

example
^^^^^^^
.. code-block:: js
    :linenos:

    KnotisApi.SomeResource.retrieve(null, {
        lat: 47.6062,
        lng: 122.3321  // These will be passed along in the query string of the URI.
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

example
^^^^^^^
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

    KnotisApi.setLocation(
        47.6062,
        122.3321
    );  // These will be passed along in the query string of the URI for every request.

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

Individual identities are a subset of Identity and can also be retrieved via the Identity resource. This endpoint is here mostly for convienience and to support future Individual resource behavior and functionality.

Establishment
-------------

Establishment data is the data that can be seen on the knotis home page ( https://knotis.com/ ). This is an accounting of all storefronts that are indexed by Knotis. This endpoint is location aware and results will be sorted from closest to farthest from a point indicated by passing a lattitude and longitude along with the request.
    
Business
--------

Rewards
=======

Daily Draw
----------

Offer/Offers
------------

OfferCollection
---------------

Purchase
--------

Redemption
----------

Uploading Images
================

ImageUpload
-----------

ImageReview
-----------

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

Passports
=========

Deprecated.

