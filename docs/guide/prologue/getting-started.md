# Getting Started

This is a quick starting guide to begin using Vuex ORM. It assumes you have a basic understanding of Vuex. If you are not familiar with Vuex, please visit the [Vuex Documentation](https://vuex.vuejs.org) to learn more.

::: tip NOTE
We use ES2015 syntax in our code examples for the rest of the docs. We also use class field declarations (e.g. `static` properties) in our classes which requires compiler plugins such as [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties).
:::

## Setup

To setup Vuex ORM, you must:

- Define Models.
- Install Vuex ORM to Vuex.

Don't worry. It's much easier than you think.

### Defining Models

Models represent a schema of data that will be stored in Vuex. The schema often follows a servers API response, but it could also be whatever you like it to be.

Models may have relationships with other models. For example, a post could *belong to* a user, or a post *has many* comments.

The following examples will demonstrate what these models may look like:

```js
// User Model

import { Model } from '@vuex-orm/core'

export default class User extends Model {
  // entity is a required property for all models.
  static entity = 'users'

  // List of all fields (schema) of the post model. `this.attr()` declares
  // a generic field type with a default value as the first argument.
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      email: this.attr('')
    }
  }
}
```

```js
// Post Model

import { Model } from '@vuex-orm/core'
import User from './User'

export default class Post extends Model {
  static entity = 'posts'

  // `this.belongsTo(...)` declares this post belongs to a user. The first
  // argument is the `User` model class. The second is the field name for
  // the foreign key `userId`.
  static fields () {
    return {
      id: this.attr(null),
      userId: this.attr(null),
      title: this.attr(''),
      body: this.attr(''),
      published: this.attr(false),
      author: this.belongsTo(User, 'userId')
    }
  }
}
```

All models are declared by extending the Vuex ORM base `Model` class.

These examples create a `User` model and a `Post` model. The `Post` model has a `belongsTo` relationship to `User` defined by the `author` key. It's now possible to create posts that are associated with users.

You can learn more about models at [Model: Getting Started](../model/getting-started).

### Installing Vuex ORM with Vuex

Now it's time to register Vuex ORM with Vuex simply by adding `VuexORM.install()` as a Vuex plugin.

The following is an example of what a Vuex Store creation file might look like:

```js
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [VuexORM.install()]
})

export default store
```

Now you are ready to go. Vuex ORM creates a namespaced module called `entities` and registers all models within by their `entity` name.

## Creating Data

Vuex ORM adopts the [Data Mapper](https://en.wikipedia.org/wiki/Data_mapper_pattern) pattern and uses _repositories_ to interact with the store. In order to create new data, you must first obtain a repository instance corresponding to the model.

You may do so by using the `mapRepos` helper function.

```js
import { mapRepos } from '@vuex-orm/core'
import Post from '@/models/Post'

export default {
  computed: mapRepos({
    postRepo: Post
  })
}
```

You can learn more about repositories at [Repository: Getting Started](../repository/getting-started).

Now, you may use `save` on the repository to create new records. In the following example, we're passing in an array with a single post:

```js
import { mapRepos } from '@vuex-orm/core'
import Post from '@/models/Post'

export default {
  computed: mapRepos({
    postRepo: Post
  }),
  
  mounted () {
    // Assuming this data is the response from the API backend.
    const posts = [
      {
        id: 1,
        title: 'Hello, world!',
        body: 'Some awesome body...',
        author: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
    ]

    // Save posts.
    this.postRepo.save(posts)
  }
}
```

This creates the following schema in the store:

```js
// Inside `store.state.entities`.
{
  posts: {
    data: {
      1: {
        id: 1,
        userId: 1,
        title: 'Hello, world!',
        body: 'Some awesome body...'
      }
    }
  },
  users: {
    data: {
      1: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
  }
}
```

Notice how `posts` and `users` are decoupled from each other by using relationships. This is what is meant by _normalizing_ data.

## Retrieving Data

Vuex ORM provides a fluent query builder for retrieving data. You may think of it as using Vuex Getters, with additional features added to quickly specify the data you want. 

```html
<template>
  <div>
    <article :key="post.id" v-for="post in posts">
      <h1>{{ post.title }}</h1>
      <p>{{ post.body }}</p>
    </article>
  </div>
</template>

<script>
import { mapRepos } from '@vuex-orm/core'
import Post from '@/models/Post'

export default {
  computed: {
    ...mapRepos({
      postRepo: Post
    }),

    posts () {
      // Fetch all post records.
      return this.postRepo.all()
    }
  }
}
</script>
```

Similar to Vuex Getters, place your queries in computed properties. Note in the example above, we do not retrieve any users with our posts! We load relationships by adding `with` to our query chain:

```html
<template>
  <div>
    <article :key="post.id" v-for="post in posts">
      <h1>{{ post.title }}</h1>
      <p>{{ post.body }}</p>
      <p>Author: {{ post.author.name }}</p>
    </article>
  </div>
</template>

<script>
import { mapRepos } from '@vuex-orm/core'
import Post from '@/models/Post'

export default {
  computed: {
    ...mapRepos({
      postRepo: Post
    }),

    posts () {
      // Fetch all post records with author.
      return this.postRepo.with('author').get()
    }
  }
}
</script>
```

## What's Next?

Vuex ORM offers many more features that help you deal with common tasks. Please continue to read through the documentation to find out more.
