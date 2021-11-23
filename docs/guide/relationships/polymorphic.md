# Relationships: Polymorphic

A polymorphic relationship is where a model can belong to more than one type of model on a single association.

## One To One

A one-to-one polymorphic relation is similar to a simple one-to-one relation; however, the target model can belong to
more than one type of model on a single association. For example, an `Image` might be associated with a `User` or `Post`
model.

### Defining A One To One Polymorphic Relationship

To define this relationship, for example, a `User` or `Post` model might be associated with one `Image`, we define a
`morphOne` field to the `User` and `Post` models.

```js
class Image extends Model {
  static entity = 'images'

  static fields () {
    return {
      id: this.number(0),
      url: this.string(''),
      imageableId: this.number(0),
      imageableType: this.string(''),
    }
  }
}

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(0),
      name: this.string(''),
      image: this.morphOne(Image, 'imageableId', 'imageableType')
    }
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.number(0),
      title: this.string(''),
      image: this.morphOne(Image, 'imageableId', 'imageableType')
    }
  }
}
```

The first argument passed to the `morphOne` method is the name of the model, the second argument is the name of the
field which will contain the `id` of the model, and the third argument is the name of the field which will contain the
`entity` of the parent model. The third argument is used to determine the "type" of the related parent model.

Additionally, Vuex ORM assumes that the foreign key should have a value matching the `id`
(or the custom `static primaryKey`) field of the parent. In other words, Vuex ORM will look for the value of the user's
`id` field in the `imageableId` field of the `Image` record. If you would like the relationship to use a value other
than `id`, you may pass a fourth argument to the `morphOne` method specifying your custom key:

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(0),
      userId: this.string(''),
      name: this.string(''),
      image: this.morphOne(Image, 'imageableId', 'imageableType', 'userId')
    }
  }
}
```

### Defining The Inverse Of The Relationship

So, we can access the `Image` model from our `User` or `Post`. Now, let's define a relationship on the `Image` model
that will let us access the model which owns the image. We can define the inverse of a `morphOne` relationship using the
`morphTo` attribute:

```js
class Image extends Model {
  static entity = 'images'
  static fields () {
    return {
      id: this.number(0),
      url: this.string(''),
      imageableId: this.number(0),
      imageableType: this.string(''),
      imageable: this.morphTo([User, Post], 'imageableId', 'imageableType'),
    }
  }
}
```

The first argument passed to the `morphTo` method is an array of models which are related, the second argument is the
name of the field which will contain the `id` of the model, and the third argument is the name of the field which will
contain the `entity` of the related model. The third argument is used to determine the "type" of the related
model. You may also pass a fourth argument to the `morphTo` method specifying your custom key on the related model.

```js
class Image extends Model {
  static entity = 'images'
  static fields () {
    return {
      id: this.number(0),
      url: this.string(''),
      imageableId: this.number(0),
      imageableType: this.string(''),
      imageable: this.morphTo([User, Post], 'imageableId', 'imageableType', 'morphableId'),
    }
  }
}
```
