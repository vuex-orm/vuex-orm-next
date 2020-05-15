# Model: Accessors

The accessors allow you to format attribute values of the data when retrieving them on a model instance. For example, you might want to modify some value to display nicely on the browser, but you still want to keep actual data as is inside Vuex Store.

## Defining Accessors

To define an accessor, just create a getter or a method in the model. In this example, we'll define `fullName` getter and `prefix` method to the User model.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      firstName: this.attr(''),
      lastName: this.attr('')
    }
  }

  // Get full name of the user.
  get fullName () {
    return `${this.firstName} ${this.lastName}`
  }

  // Add the given prefix to the user's full name.
  prefix (prefix) {
    return `${prefix} ${this.fullName}`
  }
}
```

As you can see, these are just ordinary JavaScript class definitions. You are free to define anything inside a class to modify data. You may access the value by simply calling those getters or methods.

```js
// Let's say you have following user inside Vuex Store.
{ id: 1, firstName: 'John', lastName: 'Doe' }

const user = store.$repo(User).find(1)

user.fullName // <- 'John Doe'

user.prefix('Sir.') // <- 'Sir. John Doe'
```
