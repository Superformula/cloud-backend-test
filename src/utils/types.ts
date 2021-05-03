export type Optional<T> = T | null | undefined;

export type WithIndexSignature<T, TValue> = T & { [key: string]: TValue };
