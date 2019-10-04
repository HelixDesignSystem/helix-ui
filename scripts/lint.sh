#!/bin/sh

echo "[LINT] Checking JavaScript"
eslint -c .eslintrc.prod.json src

echo "[LINT] Checking Stylesheets"
stylelint "src/**/*.{scss,css}"

#echo "Linting Markup"
# TBD?

