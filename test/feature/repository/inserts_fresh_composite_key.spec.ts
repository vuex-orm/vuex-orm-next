import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/repository/inserts_fresh_composite_key', () => {
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['idA', 'idB']

    @Attr() idA!: any
    @Attr() idB!: any
    @Str('') name!: string
  }

  it('inserts records with the composite key', async () => {
    const store = createStore()

    await store.$repo(User).fresh([
      { idA: 1, idB: 2, name: 'John Doe' },
      { idA: 2, idB: 1, name: 'Jane Doe' }
    ])

    assertState(store, {
      users: {
        '[1,2]': { idA: 1, idB: 2, name: 'John Doe' },
        '[2,1]': { idA: 2, idB: 1, name: 'Jane Doe' }
      }
    })
  })

  it('throws if the one of the composite key is missing', async () => {
    expect.assertions(1)

    const store = createStore()

    try {
      await store.$repo(User).insert({ idA: 1, name: 'John Doe' })
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
})
