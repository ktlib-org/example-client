import Entity from "core/models/Entity"
import Store from "core/stores/base/Store"
import { action, computed, observable, runInAction } from "mobx"
import { isObject } from "radash"

export default abstract class ItemStore<T extends Entity> extends Store {
  @observable selectedId: string | null = null
  @observable loaded = false

  abstract get hasItems()

  abstract load(id: string): Promise<T>

  abstract find(id: string): T

  abstract update(item: T): T

  abstract remove(idOrObject: string | T): T

  async doLoadAll() {
    return [] as T[]
  }

  @computed
  get selected() {
    return this.find(this.selectedId)
  }

  @action.bound
  async select(id: string): Promise<T> {
    if (!id) return (this.selectedId = null)

    const item = await this.findOrLoad(id)

    return runInAction(() => {
      this.selectedId = item ? item.id : null
      return item
    })
  }

  @action.bound
  clearSelected() {
    this.selectedId = null
  }

  @action.bound
  add(item: T): T {
    return this.update(item)
  }

  @action.bound
  addAll(items: T[]): T[] {
    return items.map(this.add)
  }

  @action.bound
  async findOrLoad(id: string): Promise<T> {
    return this.find(id) || this.update(await this.load(id))
  }

  idOrObject(idOrObject: string | T): T {
    return isObject(idOrObject) ? (idOrObject as T) : this.find(idOrObject as string)
  }

  @action.bound
  updateAll(items: T[]): T[] {
    return items.map(this.update)
  }

  @action.bound
  removeAll(values: string[] | T[]): T[] {
    return (values as any).map(this.remove)
  }
}

export abstract class ItemStoreList<T extends Entity> extends ItemStore<T> {
  @observable items: T[] = []

  async ensureLoaded() {
    return this.loaded ? this.items : this.loadAll()
  }

  async loadAll() {
    const results = await this.doLoadAll()
    return runInAction(() => {
      this.loaded = true
      return (this.items = results)
    })
  }

  @computed
  get hasItems() {
    return this.items.length > 0
  }

  find(id: string): T {
    return id && this.items.find((i) => i.id == id)
  }

  @action.bound
  update(item: T): T {
    if (!item) return null

    const i = this.items.findIndex((i) => i.id === item.id)

    if (i === -1) {
      this.items.push(item)
    } else {
      this.items[i] = item
    }

    return item
  }

  @action.bound
  remove(idOrObject: string | T): T {
    const item = this.idOrObject(idOrObject)
    const i = this.items.findIndex((i) => i.id === item.id)
    this.items.splice(i, 1)
    return item
  }

  @action
  async clear() {
    this.items = []
    this.selectedId = null
    this.loaded = false
  }
}
