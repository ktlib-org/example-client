import { describe, expect, it } from "bun:test"
import UseCases from "core/usecases/UseCases"

describe("UseCases", () => {
  it("should set paths correctly", () => {
    expect((UseCases.Employee.listUsers as any).path).toEqual("/use-cases/employee/ListUsers")
  })
})
