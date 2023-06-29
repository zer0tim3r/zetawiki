#!/bin/bash

npm run build;
rm -rf ../frontend/.next
cp -r ./.next ../frontend/.next
rm -rf ../frontend/public
cp -r ./public ../frontend/public
