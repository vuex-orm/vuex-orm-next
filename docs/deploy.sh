#!/usr/bin/env sh

set -e

npm run docs:build:guide

cp docs/CNAME docs/.vuepress/dist/CNAME

cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:vuex-orm/vuex-orm-next.git master:gh-pages

cd -
