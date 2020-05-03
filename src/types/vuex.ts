import { Constructor } from '../types'
import { Database } from '../database/Database'
import { Model } from '../model/Model'
import { Repository } from '../repository/Repository'

declare module 'vuex/types/index' {
  interface Store<S> {
    /**
     * The database instance.
     */
    $database: Database

    /**
     * Get a new Repository instance for the given model.
     */
    $repo<M extends Model>(model: Constructor<M>): Repository<M>
    $repo<R extends Repository<any>>(repository: Constructor<R>): R
  }
}
