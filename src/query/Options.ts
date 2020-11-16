import { Model } from '../model/Model'
import { Query } from './Query'

export interface Where {
  field: WherePrimaryClosure | string
  value: WhereSecondaryClosure | any
  boolean: 'and' | 'or'
}

export type WherePrimaryClosure = (model: any) => boolean

export type WhereSecondaryClosure = (value: any) => boolean

export interface WhereGroup {
  and?: Where[]
  or?: Where[]
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
