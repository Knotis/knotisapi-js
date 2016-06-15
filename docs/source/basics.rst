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

Authentication
--------------

Grant Types
+++++++++++

There is API support for more grant types but currently the only one exposed in this library is:

password_grant
**************

*password_grant* is an elevated privilage only allowed on trusted partner clients. Password grant allows you to pass along a user's username and password directly through your client in exchange for access credentials.

Trigger a password_grant request by calling the passwordGrant method on the KnotisApi object:

.. code-block:: js
    :linenos:

    KnotisApi.passwordGrant('<username>', '<password>').then(response => {
        // Authentication succedded process response here.

    }).catch(response => {
        // Authentication failed.

    });

Working with Resources
======================

The Knotis API is a RESTful API and like a good REST API it's interface is divided into Resources.

For a full list of resources with some examples check out the :ref:`resources`.

Standard Methods
----------------

Each resource comes with standard definitions for making requests.

create
++++++

The create method submits a HTTP **POST** request to the endpoint defined by the resource. As the name implies it's intended to create the data required to generate a new resource instance.

The create method takes one parameter: *data*, which is a Javascript object containing the fields to submit with the POST.

example
*******
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
++++++

The update method submits a HTTP **PUT** request to the endpoint defined by the resource. The call signature is similar to the create method but it requires an additional *id* paramter that identifies the resource to be updated.

example
*******
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
++++++++

The retrieve method submits a HTTP **GET** request to the endpoint defined by the resource.

There are two optional parameters that can be passed into retrieve:

* *id*: this is the identifier (usually a GUID) of the specific resource you want to retrieve. if no id is passed then a paginated list of available resource instances will be returned in the response.
* *data*: this is a Javascript object containing parameters that will be added to the query string.

example
*******
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
+++++++
Finally the destoy method submits a HTTP **DELETE** request to the endpoint defined by the resource.

There is one required parameter:

* *id*: this is the identifier (usually a GUID) of the specific resource you want to destroy. 

example
*******
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

