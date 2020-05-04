# Installation

You can install Vuex ORM via NPM, Yarn, or download it directly. Remember, since Vuex ORM is a plugin of [Vuex](https://vuex.vuejs.org), you need to install Vuex alongside with Vuex ORM.

## Package Manager

You may install Vuex ORM through NPM or Yarn

```bash
$ npm install vue vuex @vuex-orm/core --save

$ yarn add vue vuex @vuex-orm/core
```

If you aren't using typescript, you may also need to install the following babel compiler.

```bash
$ npm install --save-dev @babel/plugin-proposal-class-properties

$ yarn add --dev @babel/plugin-proposal-class-properties
```

## Direct Download / CDN

Coming soon...

## Dev Build

You have to clone directly from GitHub and build vuex ORM yourself if you want to use the latest dev build.

```console
$ git clone https://github.com/vuex-orm/vuex-orm-next.git node_modules/@vuex-orm/core
$ cd node_modules/@vuex-orm/core
$ yarn install
$ yarn build
```
