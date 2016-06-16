.. _resources:

Resource Reference
==================

The following is a full accounting of the resources exposed by this Javascript API.

User
----

This is the user information endpoint. Returns information for the currently authenticated user.

example
+++++++

.. code-block:: js
    :linenos:

    //Get user information for the currently authenticated user
    let response = Knotis.User.retrieve()

response
++++++++

.. code-block:: json
    :linenos:

    {
        "id":"00000000-0000-0000-0000-000000000000",
        "default_identity_type":2,
        "username":"example@example.com",
        "mobile_app_installed":false,
        "user":"00000000-0000-0000-0000-000000000000",
        "default_identity":"00000000-0000-0000-0000-000000000000"
    }

NewUser
-------

ResetPassword
-------------

IdentitySwitcher
----------------

Identity
--------

Individual
----------

Establishment
-------------

Business
--------

RedemptionScan
--------------

Purchase
--------

Redemption
----------

ImageUpload
-----------

Offers
------

Offer
-----

OfferCollection
---------------

StripeCustomer
--------------

Search
------

PromoCode
---------

Passport
--------

Custom Methods
++++++++++++++

redeem
******

connect
*******

DailyRewardDraw
---------------

DailyRewardSkip
---------------

DailyRewardClaim
----------------

MessengerThread
---------------

MessengerMessage
----------------

MessengerMessageRead
--------------------

MessengerMessageUnread
----------------------

MessengerParticipant
--------------------

MessengerAttachment
-------------------

MessengerView
-------------
