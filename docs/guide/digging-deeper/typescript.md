# TypeScript

Vuex ORM comes with the perfect TypeScript support. In fact, all of the Vuex ORM codes are written in TypeScript. While you can write your models and interact with repositories just like you would in plain JS, Vuex ORM provides some helpers to make your typings easier.

In this section, we'll go through all of the TypeScript features you may use during the development.

## Model Field Decorators

When defining models, you may use decorators to define the model fields.

```ts
import { Model, Attr, Str, HasMany } from '@vuex-orm/core'
import Post from '@/models/Post'

class User extends Model {
  static entity = 'users'

  @Attr(null) id!: number | null
  @Str('') name!: string

  @HasMany(() => Post, 'userId')
  posts!: Post[]
}
```

Vuex ORM provides all field attribute decorators that will be used in `static fields()` definition. Please read through this section to see all available decorators and their usage.

Note that if you don't want use decorator, you could still use `static fields()` to define model fields. But in this case, you must explicitly define model class properties that corresponds to the field definition to get correct typings.

```ts
import { Model } from '@vuex-orm/core'
import Post from '@/models/Post'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(),
      name: this.string('')
      posts: this.hasMany(Post, 'userId')
    }
  }

  id!: number | null
  name!: string
  posts!: Post[]
}
```

### Generic Field Decorators

You may use `Attr`, `Str`, `Num`, and `Bool` decorator to define fields that corresponds to `this.attr(...)`, `this.string(...)`, `this.number(...)`, and `this.boolean(...)`. All decorators will take the default value as the 1st argument.

```ts
import { Model, Attr, Str, Num, Bool } from '@vuex-orm/core'

class User extends Model {
  static entity = 'users'

  @Attr(null) id!: number | null
  @Str('') name: string
  @Num('') age: number
  @Bool('') active: boolean
}

```

If you want to make `Str`, `Num`, or `Bool` field to be nullable, you may pass the `nullable` option as the 2nd argument.

```ts
import { Model, Str, Num, Bool } from '@vuex-orm/core'

class User extends Model {
  static entity = 'users'

  @Str(null, { nullable: true }) name: string
  @Num(null, { nullable: true }) age: number
  @Bool(null, { nullable: true }) active: boolean
}
```

### Uid Decorator

You may use `Uid` to define the field corresponds to the `this.uid()`.

```ts
import { Model, Uid } from '@vuex-orm/core'

class User extends Model {
  static entity = 'users'

  @Uid() id!: string
}
```

### Relationship Decorators

You may use the following decorators to define relationship fields.

- `HasOne`
- `BelongsTo`
- `HasMany`

All of the above decorators corresponds to the relationship types that such as `this.hasOne(...)` and `this.belongsTo(...)`. It will take the same argument as well, though note that you must define the related model as the closure.

```ts
import { Model, HasOne, HasMany } from '@vuex-orm/core'
import Phone from '@/models/Phone'
import Post from '@/models/Post'

class User extends Model {
  static entity = 'users'

  @HasOne(() => Phone, 'userId')
  phone: Phone | null

  @HasMany(() => Post, 'userId')
  posts: Post[]
}
```

The closure is required to avoid any circular referencing dependencies.
