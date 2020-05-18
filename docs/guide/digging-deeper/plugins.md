# Plugins

You may add additional features to the Vuex ORM through plugins. Plugins usually add global-level functionality to Vuex ORM. Vuex ORM plugin works very similarly to Vue Plugin.

## Writing A Plugin

A Vuex ORM plugin should be an object that exposes an install method. The method will be called with the Vuex Store instance as the first augument, then Vuex ORM components such as `Model`, `Repository`, `Query` and such, as the third argument, along with possible options as force argument.

```js
const plugin = {
  install (store, components, options) {
    // Add global (static) method or property.
    components.Model.globalMethod = function () {
      // Logic...
    }

    // Add an instance method or property.
    components.Query.prototype.instanceMethod = function () {
      // Logic...
    }
  }
}
```

The plugin `install` method will be invoked right before Vuex ORM does the initial setup.

### Extendable Components

The following components are included within the `components` argument.

- Database
- Model
- Attribute
- Type
- Attr
- String
- Number
- Boolean
- Uid
- Relation
- HasOne
- HasMany
- Repository
- Interpreter
- Query
- Connection
- mutations

## Using a Plugin

Use plugins by calling the `VuexORM.use()` method.

```js
import VuexORM from '@vuex-orm/core'
import plugin from 'vuex-orm-plugin'

VuexORM.use(plugin)
```

You can optionally pass in some options too.

```js
VuexORM.use(plugin, { someOption: true })
```
