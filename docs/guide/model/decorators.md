# Model: Decorators

Vuex ORM provides property decorators to Typescript users for better type support when defining the schema for an entity. Simply put, decorators replace the need to define the `fields` method.

The following example defines a User model using decorators on properties that form the schema for the users entity:

```ts
import { Model, Attr, Str, HasMany } from '@vuex-orm/core'
import Post from '@/models/Post'

class User extends Model {
  static entity = 'users'

  @Attr(null)
  id!: number | null

  @Str('')
  name!: string

  @HasMany(() => Post, 'userId')
  posts!: Post[]
}
```

Of course, you can choose not to use decorators and continue to define the entity schema using the `fields` method. In such a case, you must explicitly define model class properties that correspond to the field definitions to get correct typings:

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

## Available Decorators

### `@Attr`

Marks a property on the model as a [generic attribute](getting-started.md#generic-type) type. For example:

```ts
import { Model, Attr } from '@vuex-orm/core'

export class User extends Model {
  static entity = 'users'

  @Attr(null)
  id!: number | null

  @Attr('John Doe')
  name!: string

  @Attr(false)
  active!: boolean
}
```

### `@Str`

Marks a property on the model as a [string attribute](getting-started.md#string-type) type. For example:

```ts
import { Model, Attr, Str } from '@vuex-orm/core'

export class User extends Model {
  static entity = 'users'

  @Str('')
  name!: string

  @Str(null, { nullable: true })
  address!: string | null
}
```

### `@Num`

Marks a property on the model as a [number attribute](getting-started.md#string-type) type. For example:

```ts
import { Model, Num } from '@vuex-orm/core'

export class User extends Model {
  static entity = 'users'

  @Num(0)
  count!: number

  @Num(null, { nullable: true })
  roleId!: number | null
}
```

### `@Bool`

Marks a property on the model as a [boolean attribute](getting-started.md#boolean-type) type. For example:

```ts
import { Model, Bool } from '@vuex-orm/core'

export class User extends Model {
  static entity = 'users'

  @Bool(false)
  active!: boolean

  @Bool(null, { nullable: true })
  visible!: boolean | null
}
```

### `@Uid`

Marks a property on the model as a [Uid attribute](getting-started.md#uid-type) type. For example:

```ts
import { Model, Uid } from '@vuex-orm/core'

class User extends Model {
  static entity = 'users'

  @Uid()
  id!: string
}
```

## Relationships

Decorators on relation properties accept the same argument signature as their corresponding field attribute type with the exception that model references should be defined as a closure that return the model constructor (to avoid circular dependencies).

### `@HasOne`

Marks a property on the model as a [hasOne attribute](../relationships/getting-started.md) type. For example:

```ts
import { Model, HasOne } from '@vuex-orm/core'
import Phone from '@/models/Phone'

class User extends Model {
  static entity = 'users'

  @HasOne(() => Phone, 'userId')
  phone: Phone | null
}
```

### `@BelongsTo`

Marks a property on the model as a [belongsTo attribute](../relationships/getting-started.md) type. For example:

```ts
import { Model, BelongsTo } from '@vuex-orm/core'
import User from '@/models/User'

class Post extends Model {
  static entity = 'posts'

  @Attr(null)
  userId!: number | null

  @BelongsTo(() => User, 'userId')
  user: User | null
}
```

### `@HasMany`

Marks a property on the model as a [hasMany attribute](../relationships/getting-started.md) type. For example:

```ts
import { Model, HasMany } from '@vuex-orm/core'
import Post from '@/models/Post'

class User extends Model {
  static entity = 'users'

  @HasMany(() => Post, 'userId')
  posts: Post[]
}
```
