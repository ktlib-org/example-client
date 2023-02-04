import { DependencyList, useEffect as useEffectReact, useRef } from "react";
import { autoRerun } from "./utils";
import { getStore } from "core/stores";
import { Store } from "core/stores/store";

type UnloadEffect = () => void | undefined | Promise<void>;
type EffectCallback = () => void | Promise<void> | UnloadEffect;

export function useEffect(effect: EffectCallback, deps?: DependencyList) {
  useEffectReact(() => effect() as any, deps);
}

export function useInitialEffect(effect: EffectCallback) {
  return useEffect(effect, []);
}

export function useUnloadEffect(unloadEffect: UnloadEffect) {
  return useEffect(() => unloadEffect, []);
}

export function rerunWhileComponentLoaded(action: () => any, frequencyInSeconds: number) {
  useInitialEffect(() => autoRerun(action, frequencyInSeconds));
}

export function useRequestTracker() {
  const tracker = useRef(0);
  return {
    startRequest: () => (tracker.current = Math.random()),
    isLatestRequest: (num: number) => num == tracker.current,
  };
}

export function useOnlyLatestRequest<T>(request: () => Promise<T>, updater: (restul: T) => any) {
  const { startRequest, isLatestRequest } = useRequestTracker();

  return async () => {
    const thisRun = startRequest();
    const result = await request();
    if (isLatestRequest(thisRun)) {
      updater(result);
    }
  };
}

export function useStore<T extends Store>(type: new (...args) => T) {
  return getStore(type);
}
