import { Entity } from "core/utils";
import { find, findIndex, isObject, keyBy, keys, map, size } from "lodash";
import { action, computed, observable, runInAction } from "mobx";

export abstract class Store {
  abstract clear(): Promise<void>;
}

abstract class ItemStore<T extends Entity> extends Store {
  @observable selectedId: number;
  @observable loaded = false;

  abstract get hasItems();
  abstract load(id: number): Promise<T>;
  abstract find(id: number): T;
  abstract update(item: T): T;
  abstract remove(idOrObject: number | T): T;

  async doLoadAll() {
    return [] as T[];
  }

  @computed
  get selected() {
    return this.find(this.selectedId);
  }

  @action.bound
  async select(id: number): Promise<T> {
    if (!id) return (this.selectedId = null);

    const item = await this.findOrLoad(id);

    return await runInAction(() => {
      this.selectedId = item ? item.id : null;
      return item;
    });
  }

  @action.bound
  clearSelected() {
    this.selectedId = null;
  }

  @action.bound
  add(item: T): T {
    return this.update(item);
  }

  @action.bound
  addAll(items: T[]): T[] {
    return map(items, this.add);
  }

  @action.bound
  async findOrLoad(id: number): Promise<T> {
    return this.find(id) || (await this.load(id));
  }

  idOrObject(idOrObject: number | T): T {
    return isObject(idOrObject) ? (idOrObject as T) : this.find(idOrObject as number);
  }

  @action.bound
  updateAll(items: T[]): T[] {
    return map(items, this.update);
  }

  @action.bound
  removeAll(values: number[] | T[]): T[] {
    return map(values as any, this.remove) as T[];
  }
}

export abstract class ItemStoreList<T extends Entity> extends ItemStore<T> {
  @observable items: T[] = [];

  async ensureLoaded() {
    return this.loaded ? this.items : this.loadAll();
  }

  async loadAll() {
    const results = await this.doLoadAll();
    return runInAction(() => {
      this.loaded = true;
      return (this.items = results);
    });
  }

  @computed
  get hasItems() {
    return this.items.length > 0;
  }

  find(id: number): T {
    return id && find(this.items, (i) => i.id == id);
  }

  @action.bound
  update(item: T): T {
    if (!item) return null;

    const i = findIndex(this.items, (i) => i.id === item.id);

    if (i === -1) {
      this.items.push(item);
    } else {
      this.items[i] = item;
    }

    return item;
  }

  @action.bound
  remove(idOrObject: number | T): T {
    const item = this.idOrObject(idOrObject);
    const i = findIndex(this.items, (i) => i.id === item.id);
    this.items.splice(i, 1);
    return item;
  }

  @action
  async clear() {
    this.items = [];
    this.selectedId = null;
    this.loaded = false;
  }
}

export abstract class ItemStoreMap<T extends Entity> extends ItemStore<T> {
  @observable items: Map<number, T> = new Map();

  async loadAll() {
    const results = await this.doLoadAll();
    return runInAction(() => {
      this.loaded = true;
      const keyed = keyBy(results, "id");
      const newItems = {} as Map<number, T>;
      keys(keyed).forEach((key) => (newItems[key] = keyed[key]));
      return (this.items = newItems);
    });
  }

  @computed
  get hasItems() {
    return size(this.items) > 0;
  }

  async ensureLoaded() {
    return this.loaded ? this.items : this.loadAll();
  }

  @action.bound
  find(id: number): T {
    return this.items[id];
  }

  @action.bound
  update(item: T): T {
    return (this.items[item.id] = item);
  }

  @action.bound
  remove(idOrObject: number | T): T {
    const item = this.idOrObject(idOrObject);
    delete this.items[item.id];
    return item;
  }

  @action
  async clear() {
    this.items = {} as Map<number, T>;
    this.selectedId = null;
    this.loaded = false;
  }
}
