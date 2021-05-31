# [1.0.0-draft.14](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.13...v1.0.0-draft.14) (2021-05-31)

### Bug Fixes

* **decorator:** export `HasManyBy` decorator ([#71](https://github.com/vuex-orm/vuex-orm-next/issues/71)) ([08c1b4f](https://github.com/vuex-orm/vuex-orm-next/commit/08c1b4fd4b25cac3f9ff475d64104202713b92ea))

### Features

* add `save` and `revive` method ([#62](https://github.com/vuex-orm/vuex-orm-next/issues/62)) ([d45825e](https://github.com/vuex-orm/vuex-orm-next/commit/d45825ea378e325c483b0167ff8260bc0de38541))
* re-shape the persistent methods ([#70](https://github.com/vuex-orm/vuex-orm-next/issues/70)) ([fe25477](https://github.com/vuex-orm/vuex-orm-next/commit/fe25477f5a4980a01c49211089c7c2de74df0462))

### Breaking Changes

- All persistent methods are now synchronous. Not `async` anymore.
- All persistent methods returns either `Model` or `Model[]`.
- The `save` method is the only method that normalizes the given data. `insert`, `fresh`, `update` will not normalize data anymore.
- Removing `add`, `revise`, `replace` method. Use `insert`, `update`, `fresh` instead.
- the `update` method now only works with query constraints. `userRepo.where('name', 'John').update({ name: 'Jane' })`.

# [1.0.0-draft.13](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.12...v1.0.0-draft.13) (2021-05-10)

### Features

* add the `new` method to create and persist entry with default values ([#57](https://github.com/vuex-orm/vuex-orm-next/issues/57)) ([#68](https://github.com/vuex-orm/vuex-orm-next/issues/68)) ([41d4c8c](https://github.com/vuex-orm/vuex-orm-next/commit/41d4c8c52091b1c31100f95621a89529dfbcd7a8))

# [1.0.0-draft.12](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.11...v1.0.0-draft.12) (2021-05-07)

### Bug Fixes

* database type in repository is not correct due to wrong import path ([7403ae7](https://github.com/vuex-orm/vuex-orm-next/commit/7403ae70504f8fa1cf3b66317b0e8527b991dbac))
* store is passed to the repository instead of database ([4c8a573](https://github.com/vuex-orm/vuex-orm-next/commit/4c8a5738f7a35367a8d3c3b022bb5da657e39181))

# [1.0.0-draft.11](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.10...v1.0.0-draft.11) (2021-05-06)

### Bug Fixes

* normalization error on nested relationship ([#61](https://github.com/vuex-orm/vuex-orm-next/issues/61)) ([239db67](https://github.com/vuex-orm/vuex-orm-next/commit/239db67c4c750aec447562a55f8eb9ebec34a5cd))

### Features

* add support for multiple databases ([#53](https://github.com/vuex-orm/vuex-orm-next/issues/53)) ([c319b3a](https://github.com/vuex-orm/vuex-orm-next/commit/c319b3a9a84c88c01eb8af426014b70aefe1bc35))

# [1.0.0-draft.10](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.9...v1.0.0-draft.10) (2021-04-17)

### Bug Fixes

* **repository:** implement missing `add` & `replace` methods ([#58](https://github.com/vuex-orm/vuex-orm-next/issues/58)) ([09496aa](https://github.com/vuex-orm/vuex-orm-next/commit/09496aa89c28506fd5d964da44bf607203bc9420))

# [1.0.0-draft.9](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.8...v1.0.0-draft.9) (2021-02-24)

### Bug Fixes

* nested relations not getting normalized correctly ([#50](https://github.com/vuex-orm/vuex-orm-next/issues/50)) ([ea6203b](https://github.com/vuex-orm/vuex-orm-next/commit/ea6203ba0ec907b4e0a1c00fea1b961315d02de2))

# [1.0.0-draft.8](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.7...v1.0.0-draft.8) (2021-01-28)

### Features

* fill relation on "make" ([9c47d46](https://github.com/vuex-orm/vuex-orm-next/commit/9c47d46d0b07d3a04a4f3d42523f026eb5d0cd66))

# [1.0.0-draft.7](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.6...v1.0.0-draft.7) (2021-01-05)

### Features

* add has many by relation ([#35](https://github.com/vuex-orm/vuex-orm-next/issues/35)) ([#37](https://github.com/vuex-orm/vuex-orm-next/issues/37)) ([6c8cce5](https://github.com/vuex-orm/vuex-orm-next/commit/6c8cce5047d626f84bbcb1c4222d00740fd7b214))
* add lazy relationship loading feature ([#44](https://github.com/vuex-orm/vuex-orm-next/issues/44)) ([6bfe237](https://github.com/vuex-orm/vuex-orm-next/commit/6bfe237a56581279c5119dcbfa2a2e576d104240))
* add model `$delete` method ([2fce6ad](https://github.com/vuex-orm/vuex-orm-next/commit/2fce6adee74d1ff4f8fe5ea471c4124c05a9b0e7))

# [1.0.0-draft.6](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.5...v1.0.0-draft.6) (2020-11-16)


### Features

* add `merge` method to the repository ([3fcbf6a](https://github.com/vuex-orm/vuex-orm-next/commit/3fcbf6a40f95fd20182c9ab45ed33545a81ac0b8))
* add eager load constraints feature ([ec7f274](https://github.com/vuex-orm/vuex-orm-next/commit/ec7f2744ab9bea551740bec1a09dd562bca47b90))



# [1.0.0-draft.5](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.4...v1.0.0-draft.5) (2020-11-16)


### Bug Fixes

* **model:** prevent `_store` from becoming a cyclic object value. ([#11](https://github.com/vuex-orm/vuex-orm-next/issues/11)) ([cc98785](https://github.com/vuex-orm/vuex-orm-next/commit/cc9878590903f359b14f7b73bbee753827608623))


### Features

* `orderBy` supports passing a handler as a field param ([#9](https://github.com/vuex-orm/vuex-orm-next/issues/9)) ([0696d40](https://github.com/vuex-orm/vuex-orm-next/commit/0696d40eb6810f5c92cd2441c80907858bf001bf))
* add "fresh" feature ([#13](https://github.com/vuex-orm/vuex-orm-next/issues/13)) ([fa9d30e](https://github.com/vuex-orm/vuex-orm-next/commit/fa9d30e5afc95d792ebb8fef86aebc599fcb3fa4))
* add limit and offset method to the repository ([ac00263](https://github.com/vuex-orm/vuex-orm-next/commit/ac002638a7547ed218c6c7be1f57d4b19508735c))
* add uid attribute ([#16](https://github.com/vuex-orm/vuex-orm-next/issues/16)) ([e676dd1](https://github.com/vuex-orm/vuex-orm-next/commit/e676dd1b18eb8fcd7f6367a862057307489abfe6))
* Events API ([#8](https://github.com/vuex-orm/vuex-orm-next/issues/8)) ([465c5d5](https://github.com/vuex-orm/vuex-orm-next/commit/465c5d5ba306c6bbb526822adb169dfbe97a5829))
* support composite key ([#23](https://github.com/vuex-orm/vuex-orm-next/issues/23)) ([e6208e9](https://github.com/vuex-orm/vuex-orm-next/commit/e6208e90cd968040c495bb186310fa8d7309cfae))


### Reverts

* findin connection method ([c78a13c](https://github.com/vuex-orm/vuex-orm-next/commit/c78a13cb596d0abe4fd0d5459a4c7de74ae646c5))



# [1.0.0-draft.4](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.3...v1.0.0-draft.4) (2020-05-03)


### Features

* add `mapRepos` helper ([#5](https://github.com/vuex-orm/vuex-orm-next/issues/5)) ([4587db7](https://github.com/vuex-orm/vuex-orm-next/commit/4587db7599210d25f077cd2818b038c4982ed892))
* add automatic database registration support ([07c9915](https://github.com/vuex-orm/vuex-orm-next/commit/07c991523d6bf15cf060832ef2bf5297f80a5e68))



# [1.0.0-draft.3](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.2...v1.0.0-draft.3) (2020-05-03)


### Bug Fixes

* export missing `use` function ([656618a](https://github.com/vuex-orm/vuex-orm-next/commit/656618a5e0402141ce85c46d765c3828d45f96a4))



# [1.0.0-draft.2](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.1...v1.0.0-draft.2) (2020-05-03)


### Features

* add `make` method to create a new model instance ([538598a](https://github.com/vuex-orm/vuex-orm-next/commit/538598ad711fd16e71028bad43dd91137963c516))
* add custom repository support ([#4](https://github.com/vuex-orm/vuex-orm-next/issues/4)) ([6b768d9](https://github.com/vuex-orm/vuex-orm-next/commit/6b768d939a19c811ebc40543dc60ce02412b70eb))
* add plugin feature ([#3](https://github.com/vuex-orm/vuex-orm-next/issues/3)) ([4d4d5af](https://github.com/vuex-orm/vuex-orm-next/commit/4d4d5af0e400fa014bebb7f6e6e257d54fa917e1))
* throw error when accessing `model.$store` without store being injected ([#2](https://github.com/vuex-orm/vuex-orm-next/issues/2)) ([2e0f341](https://github.com/vuex-orm/vuex-orm-next/commit/2e0f3417c6d99eac3e8476b5ff417525fb0e96f8))
* **model:** add `static fields` method to define the model schema ([9030c37](https://github.com/vuex-orm/vuex-orm-next/commit/9030c37d0531f46a8fce2a02aecd45dacb20a84e))



# [1.0.0-draft.1](https://github.com/vuex-orm/vuex-orm-next/compare/v1.0.0-draft.0...v1.0.0-draft.1) (2020-04-13)


### Features

* **query:** add primary closure support for the where clause ([d41435a](https://github.com/vuex-orm/vuex-orm-next/commit/d41435a889b7b72d38884f16645702584931056e))
* **query:** add secondary closure support for the where clause ([a2e4c6c](https://github.com/vuex-orm/vuex-orm-next/commit/a2e4c6ca9c2351f37d645ace6bd2352f1f898d16))
* add `order by` feature ([6fba9bc](https://github.com/vuex-orm/vuex-orm-next/commit/6fba9bc6a8d420dd306418a056c5b15380770ed1))



# 1.0.0-draft.0 (2020-04-10)

The fresh start.
