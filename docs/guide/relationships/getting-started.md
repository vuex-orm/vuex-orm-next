# Relationships: Getting Started

Relationship management is the key strength of Vuex ORM. By defining relationships, Vuex ORM uses the relationships you define to construct data when storing, modifying, and fetching from Vuex Store.

## Defining Relationships

Relationships are defined as a field in your model classes. They use relationship attributes such as `hasOne` and `hasMany`. Vuex ORM supports many types of relationships you'd expect from an ORM. In our example below we define a "One to Many" relationship between the `User` model and the `Post` model:

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string(''),
      posts: this.hasMany(Post, 'userId')
    }
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      userId: this.attr(null),
      title: this.string('')
    }
  }
}
```

Vuex ORM provides a variety of relationship attributes. Please see corresponding documentation to learn how to define the relationships you would like to construct.

- [One to One](./one-to-one.md)
- [One to Many](./one-to-many.md)

## Loading Relationships

Relationships must be "eagerly loaded" by adding the `with(...)` method to your repository's query chain. For example, let's say your `User` model has the following relationship to the `Post` model:

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string(''),
      posts: this.hasMany(Post, 'userId')
    }
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      body: this.string(''),
      userId: this.attr(null),
    }
  }
}
```

To retrieve the `User` model with any related `Post`, you chain the `with('posts')` method to your query. The argument `posts` is the key name where the relationship is defined.

```js
const user = store.$repo(User).with('posts').first()

/*
  {
    id: 1,
    name: 'John Doe',
    posts: [
      { id: 1, userId: 1, title: '...' },
      { id: 2, userId: 1, title: '...' }
    ]
  }
*/
```

Of course, you may chain more than one `with(...)` method to retrieve multiple relationships.

```js
const user = store.$repo(User).with('posts').with('phone').first()
```

### Loading Nested Relationships

To load nested relationships, you may pass constraints to the 2nd argument. For example, let's load all of the book's authors and all of the author's personal contacts:

```js
const books = store.$repo(Book).with('author', (query) => {
  query.with('contacts')
}).get()
```

Learn more about the constraining query in the next section.

### Constraining a Relationship Query

Sometimes you may wish to load a relationship, but also specify additional query conditions for the loading query. Here's an example:

```js
const users = store.$repo(User).with('posts', (query) => {
  query.where('published', true)
}).get()
```

In this example, it will only load posts where the post's `published` filed matches the `true` first. You may call other query builder methods to further customize the loading operation:

```js
const users = store.$repo(User).with('posts', (query) => {
  query.orderBy('createdAt', 'desc')
}).get()
```

### Lazy Relationship Loading

Sometimes you may need to load a relationship after the model has already been retrieved. For example, this may be useful if you need to dynamically decide whether to load related models. You may use `load` method on a repository to load relationships on the fly in such a case.

```js
const userRepo = store.$repo(User)

// Retrieve models without relationships.
const users = userRepo.all()

// Load relationships on the fly.
userRepo.with('posts').load(users)
```

You may set any additional query constraints as usual to the `with` method.

```js
userRepo.with('posts', (query) => {
  query.orderBy('createdAt', 'desc')
}).load(users)
```

Note that the `load` method will mutate the given models. It would be safer to use the method within a single `computed` method.

```js
import { mapRepos } from '@vuex-orm/core'
import User from '@/models/User'

export default {
  data () {
    return {
      condition: false
    }
  },

  computed: {
    ...mapRepos({
      userRepo: User
    }),

    users () {
      const users = this.userRepo.all()

      if (this.condition) {
        this.userRepo.with('posts').load(users)
      }

      return users
    }
  }
}
```

## Inserting Relationships

You may use `save` method to save a record with its nested relationships to the store. When saving new records into the store via `save` method, Vuex ORM automatically normalizes and stores data that contains any nested relationships in it's data structure. For example, let's say you have the `User` model that has a relationship to the `Post` model:

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string(''),
      posts: this.hasMany(Post, 'userId')
    }
  }
}
```

When you save a user record containing post records under the posts key, Vuex ORM decouples the user and post records before saving them to the store.

```js
// The user reocrd.
const user = {
  id: 1,
  name: 'John Doe',
  posts: [
    { id: 1, userId: 1, title: '...' },
    { id: 2, userId: 1, title: '...' }
  ]
}

// Save the user record.
store.$repo(User).save(user)

// The result inside the store.
{
  entities: {
    users: {
      1: { id: 1, name: 'John Doe' }
    },
    posts: {
      1: { id: 1, userId: 1, title: '...' },
      2: { id: 2, userId: 1, title: '...' }
    }
  }
}
```

Note that Vuex ORM automatically generates any missing foreign keys during the normalization process. In this example, the `Post` model has a foreign key of `userId` that corresponds to the `id` key of the `User` model. If you save post records without `userId`, it will still get populated:

```js
// The user record.
const user = {
  id: 1,
  name: 'John Doe',
  posts: [
    { id: 1, title: '...' }, // <- No foregin key.
    { id: 2, title: '...' }  // <- No foregin key.
  ]
}

// Save the user record.
store.$repo(User).save(user)

// The result inside the store.
{
  entities: {
    users: {
      1: { id: 1, name: 'John Doe' }
    },
    posts: {
      1: { id: 1, userId: 1, title: '...' }, // Foreign key generated.
      2: { id: 2, userId: 1, title: '...' }  // Foreign key generated.
    }
  }
}
```

Depending on the relationship types, there may be a slight difference in behavior when inserting data. Please refer to the specific relationship type docs for more details.

## Updating Relationships

The `save` method also updates models that already exist in the store, including any nested relationships within the given records. Let's reuse our `User` and `Post` example:

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string(''),
      posts: this.hasMany(Post, 'userId')
    }
  }
}
```

When you save the user record, relationships will be saved in a normalized form inside the store.

```js
// Existing data in the store.
{
  entities: {
    users: {
      1: { id: 1, name: 'John Doe' }
    },
    posts: {
      1: { id: 1, userId: 1, title: 'Title A' },
      2: { id: 2, userId: 1, title: 'Title B' }
    }
  }
}

// The user reocrd.
const user = {
  id: 1,
  name: 'Jane Doe',
  posts: [
    { id: 1, userId: 1, title: 'Title C' },
    { id: 2, userId: 2, title: 'Title D' }
  ]
}

// Insert the user record.
store.$repo(User).save(user)

// The result inside the store.
{
  entities: {
    users: {
      1: { id: 1, name: 'Jane Doe' } // <- Updated.
    },
    posts: {
      1: { id: 1, userId: 1, title: 'Title C' }, // <- Updated.
      2: { id: 2, userId: 1, title: 'Title D' }  // <- Updated.
    }
  }
}
```
