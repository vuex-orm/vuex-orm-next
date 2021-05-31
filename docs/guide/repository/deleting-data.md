# Repository: Deleting Data

You may delete existing data through various repository methods.

In this section, it assumes you're familiar with the usage of repository. If not, please read through the [Repository: Getting Started](./getting-started) page first.

## Deleting Data

To delete a record, you may call `destroy` method and pass the primary key for the record.

```js
// Existing records.
[
  { id: 1, name: 'John Doe', age: 40 },
  { id: 2, name: 'Jane Doe', age: 30 },
  { id: 3, name: 'Johnny Doe', age: 20 }
]

// Delete the reocrd with id of 2.
store.$repo(User).destroy(2)

// The result.
[
  { id: 1, name: 'John Doe', age: 40 },
  { id: 3, name: 'Johnny Doe', age: 20 }
]
```

In addition to a single primary key as its argument, the `destroy` method will accept an array of primary keys to delete multiple records.

```js
store.$repo(User).destroy([1, 2])
```

The `destroy` method will return deleted models. When you pass a single primary key, it will return a single model, and if you pass multiple primary keys, it will return a collection of models.

```js
const user = await store.$repo(User).destroy(2)

// User { id: 2, name: 'Jane Doe', age: 30 }

const user = await store.$repo(User).destroy([1, 2])

/*
  [
    User { id: 1, name: 'John Doe', age: 40 },
    User { id: 2, name: 'Jane Doe', age: 30 }
  ]
*/
```

If you wish to delete the entire records, you may use the `flush` method.

```js
store.$repo(User).flush()
```

## Deleting Data By Query

You can also run a delete statement on a set of records. In this example, we will delete all flights that are marked as inactive.

```js
store.$repo(User).where('active', false).delete()
```

## Deleting data by model instance method

You may delete a specific record with the model `$delete` instance method.

```js
const user = store.$repo(User).find(1)

user.$delete()
```
