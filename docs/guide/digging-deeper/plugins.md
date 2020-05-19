# Plugins

You can add additional features to Vuex ORM by creating your own plugins. Plugins can add global-level functionality to Vuex ORM and work very similarly to Vue Plugin.

## Writing A Plugin

A Vuex ORM plugin should be an object that exposes an install method. The method will be called with the Vuex Store instance as the first argument, Vuex ORM components (see [Extendable Components](#extendable-components) for a comprehensive list) as the second argument, and possible user-defined options for your plugin as the third argument.

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

export default plugin
```

The plugin `install` method will be invoked immediately before Vuex ORM begins it's initial setup.

### Extendable Components

The following components are included by the `components` argument.

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

## Using A Plugin

You can install a plugin by passing the imported plugin module to `VuexORM.use()`.

```js
import VuexORM from '@vuex-orm/core'
import myPlugin from 'my-plugin'

VuexORM.use(myPlugin)
```

If your plugin offers user-defined options, these can be passed as the second argument.

```js
VuexORM.use(myPlugin, { someOption: true })
```

Plugins should be installed prior to the Vuex ORM installation with Vuex.
