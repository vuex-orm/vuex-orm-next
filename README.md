# vuex-orm-next [![Unit Test](https://github.com/vuex-orm/vuex-orm-next/workflows/Unit%20Test/badge.svg)](https://github.com/vuex-orm/vuex-orm-next/actions) [![Build](https://github.com/vuex-orm/vuex-orm-next/workflows/Build/badge.svg)](https://github.com/vuex-orm/vuex-orm-next/actions) [![codecov](https://codecov.io/gh/vuex-orm/vuex-orm-next/branch/master/graph/badge.svg)](https://codecov.io/gh/vuex-orm/vuex-orm-next)

## Status: Draft

This repo is for the next iteration of Vuex ORM. It’s in an active development state and we are hoping it is going to be the foundation of the version 1.0.0 release. Any and all feedback is welcome!

In addition, new documentation is ongoing and can be found at https://next.vuex-orm.org.

Join us on our [Slack Channel](https://join.slack.com/t/vuex-orm/shared_invite/enQtNDQ0NjE3NTgyOTY2LTc1YTI2N2FjMGRlNGNmMzBkMGZlMmYxOTgzYzkzZDM2OTQ3OGExZDRkN2FmMGQ1MGJlOWM1NjU0MmRiN2VhYzQ) for any questions and discussions.

## Vite Integration

Make sure to disable `useDefineForClassFields` in `tsconfig.json` when using `vite >= 2.5.0`. See [this issue](https://github.com/vitejs/vite/issues/4636) for more details.

```json
...
"useDefineForClassFields": false,
...
```


## Contribution

Community contributions will be applicable as soon as this repo reaches **alpha** stage.

## License

Vuex ORM is open-sourced software licensed under the [MIT License](./LICENSE).
