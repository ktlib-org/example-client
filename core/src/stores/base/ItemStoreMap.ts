import Entity from "core/models/Entity"
import ItemStore from "core/stores/base/ItemStore"
import { action, computed, observable, runInAction } from "mobx"
import { group } from "radash"

export abstract class ItemStoreMap<T extends Entity> extends ItemStore<T> {
  @observable items: Map<string, T> = new Map()

  async loadAll() {
    const results = await this.doLoadAll()
    return runInAction(() => {
      this.loaded = true
      const keyed = group(results, (e) => e.id)
      const newItems = {} as Map<string, T>
      Object.keys(keyed).forEach((key) => (newItems[key] = keyed[key]))
      return (this.items = newItems)
    })
  }

  @computed
  get hasItems() {
    return this.items.size > 0
  }

  async ensureLoaded() {
    return this.loaded ? this.items : this.loadAll()
  }

  @action.bound
  find(id: string): T {
    return this.items[id]
  }

  @action.bound
  update(item: T): T {
    return (this.items[item.id] = item)
  }

  @action.bound
  remove(idOrObject: string | T): T {
    const item = this.idOrObject(idOrObject)
    delete this.items[item.id]
    return item
  }

  @action
  async clear() {
    this.items = {} as Map<string, T>
    this.selectedId = null
    this.loaded = false
  }
}
