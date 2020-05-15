import { Model } from '../model/Model'
import { Query } from './Query'

export interface Where<M extends Model, K extends keyof M> {
  field: WherePrimaryClosure<M> | K
  value: WhereSecondaryClosure<M, K> | M[K] | M[K][]
  boolean: 'and' | 'or'
}

export type WherePrimaryClosure<M extends Model> = (model: M) => boolean

export type WhereSecondaryClosure<M extends Model, K extends keyof M> = (
  value: M[K]
) => boolean

export interface WhereGroup<M extends Model, K extends keyof M> {
  and?: Where<M, K>[]
  or?: Where<M, K>[]
}

export interface Order<M extends Model> {
  field: OrderBy<M>
  direction: OrderDirection
}

export type OrderBy<M extends Model> = string | ((model: M) => any)

export type OrderDirection = 'asc' | 'desc'

export interface EagerLoad {
  [name: string]: EagerLoadConstraint
}

export type EagerLoadConstraint = (query: Query) => void

export type PersistMethod = 'insert' | 'fresh' | 'update'
