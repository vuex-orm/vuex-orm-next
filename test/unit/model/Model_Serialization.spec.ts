import { Attr } from '@/model/decorators/attributes/types/Attr'
import { Model } from '@/model/Model'

describe('unit/model/Model_Serialization', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Attr() arr!: []
    @Attr() obj!: {}
  }

  it('can serialize the model', () => {
    const user = new User({
      id: 1,
      arr: [1, 2, 3],
      obj: { key: 'value' }
    })

    const expected = {
      id: 1,
      arr: [1, 2, 3],
      obj: { key: 'value' }
    }

    expect(user.$toJson()).toEqual(expected)
  })
})
