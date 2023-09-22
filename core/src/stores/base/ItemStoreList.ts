import Entity from "core/models/Entity"
import { action, computed, observable, runInAction } from "mobx"
import ItemStore from "core/stores/base/ItemStore"

export default abstract class ItemStoreList<T extends Entity> extends ItemStore<T> {
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
