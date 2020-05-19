# Relationhips: One To Many

A one-to-many relationship is used to define relationships where a single model owns any amount of other models. For example, a blog post may have an infinite number of comments. Vuex ORM provides the relationship attribute to define such a relationship.

## Defining The One To Many Relationship

Like all other Vuex ORM relationships, one-to-many relationships are defined by placing a relationship attribute as a model field. As for one-to-many relationship, you may define the field using the `hasMany` attribute. You may define the `Post` model that has many `Comment` models as shown below:

```js
class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      title: this.string(''),
      comments: this.hasMany(Comment, 'postId')
    }
  }
}

class Comment extends Model {
  static entity = 'comments'

  static fields () {
    return {
      id: this.attr(null),
      postId: this.attr(null),
      body: this.string('')
    }
  }
}
```

The first argument passed to the `hasMany` method is the related model, and the second argument is the foreign key.

Remember that Vuex ORM assumes that the foreign key should have a value matching the `id` (or the custom `static primaryKey`) field of the parent. Vuex ORM will look for the value of the user's `id` field in the `userId` field of the Comment record. If you would like the relationship to use a value other than `id`, you may pass a third argument to the `hasMany` method specifying your custom key:

```js
class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      localId: this.attr(null),
      title: this.string(''),
      comments: this.hasMany(Comment, 'postId')
    }
  }
}
```

## One To Many (Inverse)

Now that we can access all of a post's comments let's define a relationship to allow a comment to access its parent post. To define the inverse of a `hasMany` relationship, define a relationship on the child model, which calls the `belongsTo` method just like with the `hasOne` relation:

```js
class Comment extends Model {
  static entity = 'comments'

  static fields () {
    return {
      id: this.attr(null),
      postId: this.attr(null),
      body: this.string(''),
      post: this.belongsTo(Post, 'userId')
    }
  }
}
```

In the example above, Vuex ORM will try to match the `postId` from the `Comment` model to an `id` on the `Post` model.

If your parent model does not use `id` as its primary key, or you wish to join the child model to a different field, you may pass a third argument to the `belongsTo` method specifying your parent model's custom key:

```js
class Comment extends Model {
  static entity = 'comments'

  static fields () {
    return {
      id: this.attr(null),
      postId: this.attr(null),
      body: this.string(''),
      post: this.belongsTo(Post, 'userId', 'otherKey')
    }
  }
}
```
