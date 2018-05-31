#!/usr/bin/env bash
set -e

for i in "$@"
do
case $i in
    -b=*|--browsers=*)
    BROWSERS=" --browsers=${i#*=}"
    shift # past argument=value
    ;;
    -c=*|--components=*)
    COMPONENTS=" --components=${i#*=}"
    shift # past argument=value
    ;;
    -u)
    UPDATE=" -u"
    shift # past argument=value
    ;;
esac
done

# clean up old stuff
yarn clean:regression

# generate new stuff
./regression/regressionTestHandler.js${BROWSERS}${COMPONENTS}

npm run build

# fire off ava
ava node built/dom-snapshots/**/*.js --verbose${UPDATE}
