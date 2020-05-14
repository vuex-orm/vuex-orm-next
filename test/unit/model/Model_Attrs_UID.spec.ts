import { mockUid } from 'test/Helpers'
import { Uid } from '@/model/decorators/attributes/types/Uid'
import { Model } from '@/model/Model'

describe('unit/model/Model_Attrs_UID', () => {
  it('returns `null` when the model is instantiated', () => {
    class User extends Model {
      static entity = 'users'

      @Uid()
      id!: string
    }

    mockUid(['uid1'])

    expect(new User().id).toBe('uid1')
  })
})
