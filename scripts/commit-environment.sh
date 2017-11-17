#!/bin/bash

(
    # Exit on errors.
    set -e

    # Default to dev environment
    KN_ENVIRONMENT=${KN_ENVIRONMENT:='dev'}

    # Make sure the current working directory is the same one this file is in.
    RUN_ROOT=$(readlink -f ${0%/*})
    cd $RUN_ROOT/..
    
    
    if [ 'dev' != ${KN_ENVIRONMENT} ]; then
	aws s3 sync  --exclude "*.*~" --exact-timestamps --cache-control none ./config s3://knotis-configuration/knotisapi-js/${KN_ENVIRONMENT}

    fi

)
