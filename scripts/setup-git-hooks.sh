#!/bin/sh

# See revert-git-hooks.sh to revert actions in this script

if [ ! $CI ] # don't run in CI environment
then
  echo "Setting git-hooks/ as the project git hooksPath..."
  git config core.hooksPath git-hooks
  echo "DONE"
fi
