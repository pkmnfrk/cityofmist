#!/bin/bash

# update packages
npm ci

# compile
npm run gulp

# restart daemon
forever restart cityofmist