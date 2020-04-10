<p align="center">
  <img width="192" src="https://github.com/vuex-orm/vuex-orm/raw/master/logo-vuex-orm.png" alt="Vuex ORM">
</p>

<h1 align="center">Vuex ORM Next</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@vuex-orm/core">
    <img alt="npm" src="https://img.shields.io/npm/v/@vuex-orm/core?color=blue" alt="NPM">
  </a>
  <a href="https://travis-ci.org/vuex-orm/vuex-orm">
    <img src="https://travis-ci.org/vuex-orm/vuex-orm-next.svg?branch=master" alt="Travis CI">
  </a>
  <a href="https://codecov.io/gh/vuex-orm/vuex-orm">
    <img src="https://codecov.io/gh/vuex-orm/vuex-orm-next/branch/master/graph/badge.svg" alt="codecov">
  </a>
  <a href="https://github.com/vuex-orm/vuex-orm-next/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/@vuex-orm/core.svg" alt="License">
  </a>
</p>

---

:fire: **This is the next iteration of Vuex ORM. It's in active development state, though we are hoping this is going to be the foundation of the version 1.0.0 release. Any feedbacks are welcome!**

---

Vuex ORM is a plugin for [Vuex](https://github.com/vuejs/vuex) to enable Object-Relational Mapping access to the Vuex Store. Vuex ORM lets you create "normalized" data schema within Vuex Store with relationships such as "Has One" and "Belongs To Many" like any other usual ORM library. It also provides fluent API to get, search and update Store state.

Vuex ORM is heavily inspired by Redux recipe of ["Normalizing State Shape"](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape) and ["Updating Normalized Data"](https://redux.js.org/recipes/structuring-reducers/updating-normalized-data). Learn more about the concept and motivation of Vuex ORM at [What is Vuex ORM?](https://vuex-orm.github.io/vuex-orm/guide/prologue/what-is-vuex-orm.html).

<h2 align="center">Sponsors</h2>

<p align="center">Vuex ORM is sponsored by awesome folks. Big love to all of them from whole Vuex ORM community :two_hearts:</p>

<h4 align="center">Super Love Sponsors</h4>

<p align="center">
  <a href="https://github.com/petertoth">
    <img src="https://avatars2.githubusercontent.com/u/3661783?s=460&v=4" alt="Peter Tóth" width="88">
  </a>
  <a href="https://github.com/phaust">
    <img src="https://avatars1.githubusercontent.com/u/2367770?s=460&v=4" alt="Mario Kolli" width="88">
  </a>
  <a href="https://github.com/cannikan">
    <img src="https://avatars2.githubusercontent.com/u/21893904?s=460&v=4" alt="Cannikan" width="88">
  </a>
  <a href="https://github.com/somazx">
    <img src="https://avatars0.githubusercontent.com/u/7306?s=460&v=4" alt="Andy Koch" width="88">
  </a>
  <a href="https://github.com/dylancopeland">
    <img src="https://avatars1.githubusercontent.com/u/99355?s=460&v=4" alt="Dylan Copeland" width="88">
  </a>
</p>

<h4 align="center">Big Love Sponsors</h4>

<p align="center">
  <a href="https://github.com/geraldbiggs">
    <img src="https://avatars1.githubusercontent.com/u/3213608?s=460&v=4" alt="geraldbiggs" width="64">
  </a>
  <a href="https://github.com/cuebit">
    <img src="https://avatars0.githubusercontent.com/u/1493221?s=460&v=4" alt="Cue" width="64">
  </a>
</p>

<h4 align="center">A Love Sponsors</h4>

<p align="center">
  <a href="https://github.com/georgechaduneli">
    <img src="https://avatars1.githubusercontent.com/u/9340753?s=460&v=4" alt="George Chaduneli" width="48">
  </a>
  <a href="https://github.com/bpuig">
    <img src="https://avatars3.githubusercontent.com/u/22938625?s=460&v=4" alt="bpuig" width="48">
  </a>
  <a href="https://github.com/robokozo">
    <img src="https://avatars2.githubusercontent.com/u/1719221?s=400&u=b5739798ee9a3d713f5ca3bd3d6a086c13d229a3&v=4" alt="John" width="48">
  </a>
</p>

## Documentation

You can check out the full documentation for Vuex ORM Next at https://next.vuex-orm.org.

## Questions & Discussions

Join us on our [Slack Channel](https://join.slack.com/t/vuex-orm/shared_invite/enQtNDQ0NjE3NTgyOTY2LTc1YTI2N2FjMGRlNGNmMzBkMGZlMmYxOTgzYzkzZDM2OTQ3OGExZDRkN2FmMGQ1MGJlOWM1NjU0MmRiN2VhYzQ) for any questions and discussions.

Although there is the Slack Channel, do not hesitate to open an [issue](https://github.com/vuex-orm/vuex-orm/issues) for any question you might have. We're always more than happy to hear any feedback, and we don't care what kind of form they are.

## Examples

Coming soon...

## Plugins

Coming soon...

## Contribution

We are excited that you are interested in contributing to Vuex ORM! Anything from raising an issue, submitting an idea of a new feature, or making a pull request is welcome!

### Scripts

There are several scripts to help with development.

```bash
$ yarn build
```

Compile files and generate bundles in `dist` directory.

```bash
$ yarn lint
```

Lint files using [Prettier](https://prettier.io/).

```bash
$ yarn test
```

Run the test using [Jest](https://jestjs.io/).

```bash
$ yarn test:watch
```

Run the test in watch mode.

```bash
$ yarn test:perf
```

Run the performance test.

```bash
$ yarn coverage
```

Generate test coverage in `coverage` directory.

```bash
$ yarn docs
```

Build and boot documentation server with [VuePress](https://vuepress.vuejs.org/).

## License

The Vuex ORM is open-sourced software licensed under the [MIT License](./LICENSE).
