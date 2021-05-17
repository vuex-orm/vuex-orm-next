import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/repository/deletes_destroy', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('deletes record by the id', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    store.$repo(User).destroy(2)

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })
  })

  it('deletes multiple records by an array of ids', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    store.$repo(User).destroy([2, 3])

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })
  })

  it('returns the index id of the deleted item', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    const id = store.$repo(User).destroy(2)

    expect(id).toBe('2')
  })

  it('returns `null` when no record was deleted', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })

    const user = store.$repo(User).destroy(2)

    expect(user).toBe(null)

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })
  })

  it('returns index ids of deleted items', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    const ids = store.$repo(User).destroy([1, 3])

    expect(ids).toEqual(['1', '3'])
  })

  it('returns empty array if no record was deleted', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    const ids = store.$repo(User).destroy([4])

    expect(ids).toEqual([])
  })
})
