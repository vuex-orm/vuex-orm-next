import { Model } from '@/model/Model'

describe('unit/model/Model', () => {
  class User extends Model {
    static entity = 'users'
  }

  it('throws when accessing the store but it is not injected', () => {
    expect(() => new User().$database()).toThrow()
  })
})
