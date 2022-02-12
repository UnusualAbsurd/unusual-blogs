declare global {
  var _mongoClientPromise: any;
}

export const _mongoClientPromise = global._mongoClientPromise;
