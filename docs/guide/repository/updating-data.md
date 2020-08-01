# Repository: Updating Data

You may update existing data through various repository methods.

In this section, it assumes you're familiar with the usage of repository. If not, please read through the [Repository: Getting Started](./getting-started) page first.

## Updating Data

You may update existing records using the `update` method. The `update` method, similar to the `insert` method, accepts an object of field and value pairs containing the fields to be updated.

The `update` method will first attempt to locate a matching record using its primary key in the field and value pairs. If the record exists, it will be updated with the values in the other pairs.

```js
// Existing records.
[
  { id: 1, name: 'John Doe', age: 40 },
  { id: 2, name: 'Jane Doe', age: 30 },
  { id: 3, name: 'Johnny Doe', age: 20 }
]

// Update the "age" of the record with id of 2.
store.$repo(User).update({ id: 2, age: 50 })

// The result.
[
  { id: 1, name: 'John Doe', age: 40 },
  { id: 2, name: 'Jane Doe', age: 50 }, // <- Updated.
  { id: 3, name: 'Johnny Doe', age: 20 }
]
```

Similarly as the `insert` method, you may pass an array of objects to update multiple records at once.

```js
store.$repo(User).update([
  { id: 2, age: 50 },
  { id: 3, age: 80 }
])
```

The `update` method will also "normalize" the given data. That means if you pass an object that contains any nested relationships, those relationships are also updated. Please see <normalization doc link?> for more details about data normalization.

Because the `update` method might update records of multiple models, it will always return a collection of entities that have been updated.

```js
const entities = await store.$repo(User).update({ id: 1, age: 50 })

/*
  {
    users: [
      { id:1, name: 'Jane Doe', age: 50 }
    ]
  }
*/
```

## Updating Data Without Normalization

If you don't need the data to be normalized, you may use `merge` method to update data as well. The difference between `update` method is that `merge` method will always return the corresponding model instances rather than returning the whole entities object.

```js
const user = store.$repo(User).merge({ id: 2, age: 50 })

// { id: 2, name: 'Jane Doe', age: 50 }
```

You may also pass an array of records to the `merge` method. In that case, the returned value will be an array of models.

```js
const user = await store.$repo(User).merge([
  { id: 1, age: 50 },
  { id: 2, name: 'Jane Doe', age: 30 }
])

/*
  [
    { id:1, name: 'John Doe', age: 50 },
    { id:2, name: 'Jane Doe', age: 30 }
  ]
*/
```

## Constraints By Query

In addition to updating records by passing in the object that contains the primary key, you may constrain the query to control what records are to be updated by the `revise` method and using a `where` clause.

```js
store.$repo(User).where('id', 1).revise({ age: 50 })
```

When constraining the query by the `where` clause, all updates will be performed against any number of records that match a given query.

In the following example, all flights that are `active` and have a destination of `Tokyo` will be marked as delayed:

```js
store.$repo(Flight)
  .where('active', true)
  .where('destination', 'Tokyo')
  .revise({ delayed: true })
```

As opposed to updating records by `update` method, it only accepts an object as the argument (not an array). Also, it will not normalize the data, and any nested relationships will be ignored.

Because it will only update the records of the caller model, it will always return a collection of models that have been updated.

```js
const flights = await store.$repo(Flight)
  .where('active', true)
  .where('destination', 'Tokyo')
  .update({ delayed: true })

/*
  [
    { id: 12, active: true, destination: 'Tokyo', delayed: true },
    { id: 24, active: true, destination: 'Tokyo', delayed: true }
  ]
*/
```
