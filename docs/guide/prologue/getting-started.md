# Getting Started

This page is a quick start guide to begin using Vuex ORM. It assumes you have a basic understanding of [Vuex](https://github.com/vuejs/vuex/). If you are not familiar with [Vuex](https://github.com/vuejs/vuex/), please visit [Vuex Documentation](https://vuex.vuejs.org) to learn about Vuex.

::: tip NOTE
We use ES2015 syntax in our code examples for the rest of the docs. Also, we use "Class Property" to define some properties in the class. This syntax requires compilers such as [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties).
:::

## Setup

To setup Vuex ORM, you must:

- Define Models.
- Install Vuex ORM to Vuex.

Don't worry. It's much easier than you think.

### Defining Models

Models represent a schema of data that will be stored in Vuex. The schema often follows server's API response, but it also could be whatever you like.

Models may have relationships with other models. For example, a post could *belong to* a user, or a post *has many* comments. We'll demonstrate what these models look like below.

```js
// User Model

import { Model } from '@vuex-orm/core'

export default class User extends Model {
  // entity is required in all models to declare the module name in Vuex.
  static entity = 'users'

  // List of all fields (schema) of the post model. `this.attr()` declares
  // a generic field type with a default value being the 1st argument.
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

  // `this.belongsTo(...)` declares this post `belongs to` a user The first
  // argument is the Model class 'User'. The second is the field name for
  // the foreign key 'userId'.
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

These examples create a `User` model and a `Post` model. Our `Post` model has `belongsTo` relationship to `User` at the `author` key. We can now create posts that are associated with our users.

You can learn more about models at [Model: Getting Started](../model/getting-started).

### Installing Vuex ORM to Vuex

Now it's time for you to register Vuex ORM to the Vuex. To do so, just add `VuexORM.install` as the Vuex plugin.

An example Vuex Store creation file might look like this.

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

Now you are ready to go. Vuex ORM creates a namespaced module called `entities` in Vuex. All models are registered under its `Model.entity` name when it gets used.

## Create a Repository

Vuex ORM follows the "Data Mapper" ORM pattern, which uses "repositories" to interact with the store. A repository is created from the `store.$repo` method, and passing in a model as the argument.

```js
const postRepo = store.$repo(Post)

postRepo.insert(posts)
```

When creating repository in Vue Component, you could do the same by referencing the `this.$store`.

```js
import Post from '@/models/Post'

export default {
  computed: {
    postRepo () {
      return this.$store.$repo(Post)
    }
  }
}
```

### Map Repositories

However, it might be a bit cumbersome to define repositories like this, especially when you have multiple repositories that you want to use. In such a case, you can use `mapRepos` helper to define repositories.

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

## Inserting Data

Vuex ORM provides an `insert` method to insert new records to a collection. In our example below, we're passing in an array with a single post to insert. 

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

    // Insert posts.
    this.postRepo.insert(posts)
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

Notice how `posts` and `users` are decoupled from each other by using relationships. This is what is meant by "normalizing" the data.

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

Similar to Vuex getters, place your queries as computed properties. Note in our example above, we do not retrieve any users with our posts! We load relationships by adding `with` to our query chain:

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

Vuex ORM offers many more features that help you deal with common tasks. Please read through the documentation to find out more.
