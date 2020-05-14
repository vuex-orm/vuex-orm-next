import { NonEnumerable } from '@/model/decorators/NonEnumerable'

describe('unit/decorators/NonEnumerable', () => {
  class StdClass {
    visible: string

    @NonEnumerable
    hidden: string

    constructor() {
      this.hidden = 'i am hidden'
      this.visible = 'i am visible'
    }
  }

  it('should describe as an innumerable property', () => {
    const cls = new StdClass()

    expect(cls.propertyIsEnumerable('hidden')).toBe(false)
    expect(cls.propertyIsEnumerable('visible')).toBe(true)
  })

  it('should appear in own property detection', () => {
    const cls = new StdClass()

    expect(Object.getOwnPropertyNames(cls)).toEqual(['hidden', 'visible'])
    expect(Object.prototype.hasOwnProperty.call(cls, 'hidden')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(cls, 'visible')).toBe(true)
  })

  it('should not appear during property enumeration', () => {
    const cls = new StdClass()

    expect(Object.keys(cls)).toEqual(['visible'])
    expect(Object.entries(cls)).toEqual([['visible', 'i am visible']])
    expect(Object.values(cls)).toEqual(['i am visible'])

    for (const prop in cls) {
      expect(prop).not.toBe('hidden')
    }
  })
})
