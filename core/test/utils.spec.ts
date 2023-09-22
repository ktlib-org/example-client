import { describe, expect, it } from "bun:test"
import { defaultIfEmpty } from "core/utils"

describe("defaultIfEmpty", () => {
  it("should return default for null", () => {
    const result = defaultIfEmpty(null, "myDefault")

    expect(result).toEqual("myDefault")
  })
})
