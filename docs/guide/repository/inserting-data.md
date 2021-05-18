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

### Return Value From The `save` method

The `save` method returns the original data which was passed in, with primary key fields getting populated. You may think of this object as a "schema" of the saved data. Let's go through examples to see how it works.

When passing in data with a correct primary key, it returns the exact same object you passed.

```js
const schema = store.$repo(User).save({ id: 1, name: 'John Doe' })

/*
  { id: 1, name: 'John Doe' }
*/

// If you pass an array, it returns an array.
const schema = store.$repo(User).save([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
])

/*
  [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' }
  ]
*/
```









The repository provides an `insert` method for inserting records into the store. The `insert` method accepts an object of field and value pairs.

```js
store.$repo(User).insert({ id: 1, name: 'John Doe' })
```

You may also pass an array of objects to update multiple records at once.

```js
store.$repo(User).insert([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
])
```

The `insert` method will "normalize" the given data. That means if you pass an object that contains any nested relationships, those relationships are also updated. Please see [Relationships: Getting Started](../relationships/getting-started.md#inserting-relationships) for more details about data normalization.

Because the `insert` method might insert records of multiple models, it will always return a collection of entities that have been updated.

```js
const entities = await store.$repo(User).insert({ id: 1, name: 'John Doe' })

/*
  {
    users: [
      { id:1, name: 'Jane Doe' }
    ]
  }
*/
```

## Inserting Data Without Normalization

If you don't need the data to be normalized, you may use `add` method to insert data as well. The Biggest difference between `insert` method is that `add` method will always return the corresponding model instances rather than returning the whole `entities` object.

```js
const user = store.$repo(User).add({ id: 1, name: 'John Doe' })

// { id: 1, name: 'John Doe' }
```

You may also pass an array of records to the `add` method. In that case, the returned value will be an array of models.

```js
const users = store.$repo(User).add([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
])

/*
  [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' }
  ]
*/
```

## Inserting Data With Default Values

When you pass an empty object or array to the `insert` or `add` method, it will do nothing. If you want to insert fresh data with all fields being default values, you may use `new` method. The `new` method will create a record with all fields filled with default values defined in the model.

```js
const user = store.$repo(User).new()

// { id: '$uid1', name: '' }
```

::: warning
Note that to be able to use `new` method, you must define the model's primary key field as `UID` type attribute, or else it will throw an error.
:::

## Replacing Whole Data

When inserting data, you may use `fresh` method to replace whole existing records with the newly passed in data. It's pretty much equivalent to first delete all records, then inserting new data.

```js
// Existing records.
[
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
]

// Replace whole records with the new data.
store.$repo(User).fresh({ id: 3, name: 'Johnny Doe' })

// The result.
[
  { id: 3, name: 'Johnny Doe' }
]
```

And of course, you may pass an array of records as well.

```js
store.$repo(User).fresh([
  { id: 3, name: 'Johnny Doe' },
  { id: 4, name: 'Janie Doe' }
])
```

Note that the `fresh` method will also normalize the given data. That means the returned value will always be an object on entities.

```js
const entities = await store.$repo(User).fresh({ id: 1, name: 'John Doe' })

/*
  {
    users: [
      { id:1, name: 'Jane Doe' }
    ]
  }
*/
```

If you don't want the data to be normalized, you may use `replace` method, like `add` method for `insert` method.

```js
const user = store.$repo(User).replace({ id: 1, name: 'John Doe' })

// { id: 1, name: 'John Doe' }
```

The `replace` method will also accept an array of records.

```js
const users = store.$repo(User).replace([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
])

/*
  [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' }
  ]
*/
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
