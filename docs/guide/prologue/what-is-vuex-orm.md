# What is Vuex ORM?

Vuex ORM is a plugin for Vuex to enable a consistent and easy API to handle Object Relational Mapping with a Vuex Store. But why do we need a client-side ORM?

Many applications deal with data that is nested or relational in nature. For example, a blog editor could have many posts, each post may have many comments, and both posts and comments could be written by any number of users. Deeply nested data structures creates many challenges for JavaScript applications, especially when using a single tree state management system such as [Vuex](https://vuex.vuejs.org/) or [Redux](http://redux.js.org/).

 To handle such data nicely, one approach splits the nested data into separate modules and decouples them from each other. Simply put, it treats a portion of your store like a normalized database with a flattened data structure.

[This excellent article](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape/) describes the difficulty of nested data. It also explains how to design a normalized state, and Vuex ORM is heavily inspired by it.

Note that in this documentation, we borrow many examples and texts from the article. We would like to credit [Redux](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape) and the author of the section [Mark Erikson](https://github.com/markerikson) for the beautiful article.

## Issues with Nested Relational Data

Let's look at a typical example of fetching post data from a backend server. The response usually looks something like this:

```js
[
  {
    id: 1,
    body: '.....',
    author: { id: 1, name: 'User 1' },
    comments: [
      {
        id: 1,
        comment: '.....',
        author: { id: 2, name: 'User 2' }
      },
      {
        id: 2,
        comment: '.....',
        author: { id: 2, name: 'User 2' }
      }
    ]
  },
  {
    id: 2,
    author: { id: 2, name: 'User 2' },
    body: '.....',
    comments: [
      {
        id: 3,
        comment: '.....',
        author: { id: 3, name: 'User 3' }
      },
      {
        id: 4,
        comment: '.....',
        author: { id: 1, name: 'User 1' }
      },
      {
        id: 5,
        comment: '.....',
        author: { id: 3, name: 'User 3' }
      }
    ]
  }
  // And so on...
]
```

Notice that the structure is a bit complex, and contains duplicate author data for "User 3." If you save this data to the store, there are several concerns: 

- Data is duplicated in several places, and it is harder to ensure an update reaches every location.
- Nested data means that the corresponding logic to process this data is more complex. Trying to handle deeply nested fields becomes very ugly, very fast.

To deal with these challenges, a recommended approach is to treat a portion of your store as if it were a database, and keep that data in a *normalized* form.

## How Vuex ORM Handles Data

Vuex ORM manages both creating (normalizing) and retrieving data through a fluent, intuitive API.

Let's use our example above and store a blog post. You first create *models* for your Post, Comment, and User:

```js
class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      userId: this.attr(null),
      body: this.string(''),
      comments: this.hasMany(Comment, 'postId')
    }
  }
}

class Comment extends Model {
  static entity = 'comments'

  static fields () {
    return {
      id: this.attr(null),
      userId: this.attr(null),
      postId: this.attr(null),
      comment: this.string(''),
      author: this.belongsTo(User, 'userId')
    }
  }
}

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string('')
    }
  }
}
```

Using these models, we retrieve a repository to interact with the data. We call the insert method on the repository to insert a new item inside the store.

```js
store.$repo(Post).insert(posts)
```

Vuex ORM automatically normalizes and saves the posts inside the store with the following structure.

```
{
  entities: {
    posts: {
      data: {
        1: { id: 1, userId: 1, body: '.....' },
        2: { id: 2, userId: 2, body: '.....' }
      }
    },

    comments: {
      data: {        
        1: { id: 1, userId: 2, postId: 1, comment: '.....' },
        2: { id: 2, userId: 2, postId: 1, comment: '.....' },
        3: { id: 3, userId: 3, postId: 2, comment: '.....' },
        4: { id: 4, userId: 1, postId: 2, comment: '.....' },
        5: { id: 5, userId: 3, postId: 2, comment: '.....' }
      }
    },

    users: {
      data: {
        1: { id: 1, name: 'User 1' },
        2: { id: 2, name: 'User 2' },
        3: { id: 3, name: 'User 3' }
      }
    }
  }
}
```

Notice that Vuex ORM even generates any missing foreign keys (in this case, `userId`) during the normalization process.

Now, you can fetch these posts using a fluent query builder similar to many ORM libraries.

```js
// Fetch all posts.
const posts = store.$repo(Post).all()

/*
  [
    { id: 1, body: '.....' },
    { id: 2, body: '.....' }
  ]
*/


// Fetch all posts with its relation.
const posts = store.$repo(Post).with('author').get()

/*
  [
    {
      id: 1,
      body: '.....',
      author: {
        id: 1,
        name: 'User 1'
      }
    },
    {
      id: 2,
      body: '.....',
      author: {
        id: 2,
        name: 'User 2'
      }
    }
  ]
*/


// Fetch data matching specific condition.
const posts = store.$repo(Post).with('author').where('id', 1).get()

/*
  [
    {
      id: 1,
      body: '.....',
      author: {
        id: 1,
        username: 'user1',
        name: 'User 1'
      }
    }
  ]
*/
```

## Benefits of Normalizing Data

Some basic concepts of normalizing data:

- Each type of data gets its own *table* in the state.
- Each *table* stores an individual item in an object, with the ID of the item as its key and the item as the value
- Any references to related items is made through foreign keys.

As you may notice, it's pretty much the same as how traditional relational database systems manage relations. With Vuex ORM do the same for our store.

The benefits of this approach are:

- Without duplication, updates only take place once.
- Our data's logic doesn't struggle with deep nesting, and is much easier to write.
- All we need to retrieve or modify our data is the id and model, using a simple query syntax.

### Normalized Data in Components

Normalized state structure usually implies that each component is responsible for looking up its own data, as opposed to a parent component gathering large amounts of data to be passed down to other components. As it turns out, connected parent components passing ids of items to connected children components is a good pattern for optimizing UI performance. 

However, organizing such normalized data is still a challenging task. You'll need logic to handle "normalizing" input data, querying and retrieving data, and handling any relationships your data structure requires. This is where Vuex ORM comes in.
