import { Attr } from '@/model/decorators/attributes/types/Attr'
import { Model } from '@/model/Model'

describe('unit/model/Model', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
  }

  it('throws when accessing the database but it is not injected', () => {
    expect(() => new User().$database()).toThrow()
  })

  it('ignores unkown field when filling the model', () => {
    const user = new User({ id: 1, name: 'John Doe' })

    expect(user.id).toBe(1)
    expect((user as any).name).toBe(undefined)
  })

  it('can fill fields with the given record by the `$fill` method', () => {
    const userA = new User().$fill({ id: 1 })
    expect(userA.id).toBe(1)

    const userB = new User({ id: 1 }).$fill({})
    expect(userB.id).toBe(1)
  })
})
