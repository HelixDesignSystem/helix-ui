#! /usr/bin/env bash

find built/$1 -mindepth 1 \( ! -path "built/$1/*.js.snap" ! -path "built/$1/*.js.md" \) -delete
