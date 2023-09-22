export default abstract class Store {
  abstract clear(): Promise<void>
}
