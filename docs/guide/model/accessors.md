# Model: Accessors

Model accessors are computed properties which have access to the model instance and all it's properties and methods. You can define accessors on models to create virtual properties using methods and ES6 getters. Accessors are exempt from persistence and are hidden from model serialization.

The following example defines an accessor on a User model as `fullName`, using ES6 getters, which combines the `firstName` and `lastName` attributes from the model schema, and also a prefix method to allow customizing the `firstName`.

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

const user = store.$repo(User).make({
  firstName: 'John',
  lastName: 'Doe'
})

console.log(user.fullName) // 'John Doe'
console.log(user.prefix('Sir.')) // 'Sir. John Doe'
```
