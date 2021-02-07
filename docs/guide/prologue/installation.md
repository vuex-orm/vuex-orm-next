# Installation

You can install Vuex ORM via NPM, Yarn, or direct download. Vuex ORM is a plugin for Vuex and therefore you should have [Vuex installed](https://vuex.vuejs.org/installation.html) as a prerequisite.

## Package Manager

NPM or Yarn are the recommended methods of installing Vuex ORM.

``` sh
# Install using NPM.
npm install @vuex-orm/core@next --save

# Install using Yarn.
yarn add @vuex-orm/core@next
```

For non-Typescript users, the following Babel plugins should be installed and configured:

``` json
{
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ]
}
```


## Direct Download / CDN

Coming soon...

## Dev Build

The built files in the `/dist` folder are only checked-in during release. To use the latest source code on GitHub, you will have to run a build yourself.

``` sh
git clone https://github.com/vuex-orm/vuex-orm-next.git node_modules/@vuex-orm/core
cd node_modules/@vuex-orm/core
yarn && yarn build
```
