import { parseJSON } from "date-fns";
import { computed } from "mobx";

export class Entity {
  id: number;
}

export class EntityWithDates extends Entity {
  createdAt: string;
  updatedAt: string;

  @computed
  get createdAtDate() {
    return parseJSON(this.createdAt);
  }

  @computed
  get updatedAtDate() {
    return parseJSON(this.updatedAt);
  }
}
