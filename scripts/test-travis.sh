#!/bin/sh

echo "CI: $CI"

if [ ! $CI ] # don't run on CI server
then
  echo "CI missing/falsey"
else
  echo "CI present/truthy"
fi
