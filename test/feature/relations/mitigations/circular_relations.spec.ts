import { createStore, assertState } from 'test/Helpers'
import User from './_fixtures/circular_relations_user'

describe('feature/relations/mitigations/circular_relations', () => {
  test('models can have circular relations', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      phone: {
        id: 2,
        userId: 1,
        user: {
          id: 1
        }
      }
    })

    assertState(store, {
      users: {
        1: { id: 1 }
      },
      phones: {
        2: { id: 2, userId: 1 }
      }
    })
  })
})
