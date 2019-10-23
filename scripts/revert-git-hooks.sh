#!/bin/sh

# Revert actions performed in setup-git-hooks.sh

if [ ! $CI ] # don't run in CI environment
then
  echo "Reverting project git hooksPath..."
  git config --unset core.hooksPath
  echo "DONE"
fi
