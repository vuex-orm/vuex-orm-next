import { createStore, assertState } from 'test/Helpers'
import { User } from 'test/feature/fixtures/relations/morph_one'

/*
  Potential Improvements
   - DRY test cases
*/
describe('feature/relations/morph_one_save', () => {
  it('inserts a record to the store with "morph one" relation', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageable_id: 1,
        imageable_type: 'users'
      }
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageable_id: 1,
          imageable_type: 'users'
        }
      }
    })
  })

  it('generates missing foreign key', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageable_type: 'users'
      }
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageable_id: 1,
          imageable_type: 'users'
        }
      }
    })
  })

  it('can insert a record with missing relational key', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe'
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      images: {}
    })
  })

  it('can insert a record with relational key set to `null`', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      image: null
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      images: {}
    })
  })
})
