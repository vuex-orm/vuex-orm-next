# Repository: Inserting Data

You may insert new data or update existing data through various repository methods. All data created through Vuex ORM gets persisted in Vuex Store.

In this section, it assumes you're familiar with the usage of repository. If not, please read through the [Repository: Getting Started](./getting-started) page first.

## Inserting Data

You may use `save` method on a repository to insert data. The save method accepts an object of field and value pairs.

```js
store.$repo(User).save({ id: 1, name: 'John Doe' })
```

You may also pass an array of objects to update multiple records at once.

```js
store.$repo(User).save([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
])
```

The `save` method will "normalize" the given data. That means if you pass an object that contains any nested relationships, those relationships are also inserted. Please see [Relationships: Getting Started](../relationships/getting-started.md#inserting-relationships) for more details about data normalization.

The `save` method returns new model instances.

```js
const user = store.$repo(User).save({ id: 1, name: 'John Doe' })

/*
  User { id: 1, name: 'John Doe' }
*/
```

When passing in an array of data, it returns an array of new model instances.

```js
const users = store.$repo(User).save([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
])

/*
  [
    User { id: 1, name: 'John Doe' },
    User { id: 2, name: 'Jane Doe' }
  ]
*/
```

If you insert data containing relationships, all of them would be instantiated as a new model istances and gets returned. Here is an example where a user "has many" posts.

```js
const user = store.$repo(User).save({
  id: 1,
  name: 'John Doe',
  posts: [
    { id: 1, userId: 1, title: 'Title A' },
    { id: 2, userId: 2, title: 'Title B' }
  ]
})

/*
  User {
    id: 1,
    name: 'John Doe',
    posts: [
      Post { id: 1, userId: 1, title: 'Title A' },
      Post { id: 2, userId: 2, title: 'Title B' }
    ]
  }
*/
```

## Inserting Data Without Normalization

If you don't need the data to be normalized, you may use `insert` method to insert data. The insert method will ignore any relationships, and returns a new model instance.

```js
const user = store.$repo(User).insert({ id: 1, name: 'John Doe' })

// User { id: 1, name: 'John Doe' }
```

You may also pass an array of records to the `insert` method. In that case, the returned value will be an array of models.

```js
const users = store.$repo(User).insert([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
])

/*
  [
    User { id: 1, name: 'John Doe' },
    User { id: 2, name: 'Jane Doe' }
  ]
*/
```

## Inserting Data With Default Values

When you pass an empty object or array to the `save` or `insert` method, it will do nothing. If you want to insert fresh data with all fields being default values, you may use `new` method. The `new` method will create a record with all fields filled with default values defined in the model.

```js
const user = store.$repo(User).new()

// User { id: '$uid1', name: '' }
```

::: warning
Note that to be able to use `new` method, you must define the model's primary key field as `UID` type attribute, or else it will throw an error.
:::

## Replacing Whole Data

When inserting data, you may use `fresh` method to replace whole existing records with the newly passed in data. It's pretty much equivalent to first delete all records, then inserting new data. The `fresh` method will ignore any relationships.

```js
// Existing data.
{
  1: { id: 1, name: 'John Doe' },
  2: { id: 2, name: 'Jane Doe' }
}

// Replace whole data with the new data.
store.$repo(User).fresh({ id: 3, name: 'Johnny Doe' })

// The result.
{
  3: { id: 3, name: 'Johnny Doe' }
}
```

And of course, you may pass an array of records as well.

```js
store.$repo(User).fresh([
  { id: 3, name: 'Johnny Doe' },
  { id: 4, name: 'Janie Doe' }
])
```

## Creating a model instance

Sometimes, you may want to create a new model instance without actually storing the model to the store. In such a case, you may use `make` method to create a fresh model instance.

```js
const user = store.$repo(User).make()
```

You may also pass default values as an object.

```tsx
const user = store.$repo(User).make({
  name: 'John Doe',
  age: 30
})
```
