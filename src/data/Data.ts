import { NormalizedSchema as BaseNormalizedSchema } from 'normalizr'
import { Model } from '../model/Model'

export type Element = Record<string, any>

export interface Elements {
  [id: string]: Element
}

export type NormalizedSchema<R> = BaseNormalizedSchema<Elements, R>

export interface NormalizedData {
  [entity: string]: Elements
}

export type Item<M extends Model = Model> = M | null

export type Collection<M extends Model = Model> = M[]

export type Collections = Record<string, Collection<Model>>
