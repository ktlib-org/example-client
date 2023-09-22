import Organization from "core/models/organization/Organization"

/**
 * This allows model objects to lookup other model objects without having to reference the store directly.
 */
export default interface Lookups {
  organization: () => Organization
}

let lookups: Lookups

export function setLookups(newLookups: Lookups) {
  lookups = newLookups
}

export function getLookups() {
  if (!lookups) {
    throw "Lookups not set. Please call setLookups() calling getLookups."
  }
  return lookups
}
