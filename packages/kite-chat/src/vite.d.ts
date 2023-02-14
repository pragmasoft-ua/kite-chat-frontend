declare module '*?sharedworker&inline' {
  const sharedWorkerConstructor: {
    new (): SharedWorker;
  };
  export default sharedWorkerConstructor;
}

declare module '*?inline-shared-worker' {
  export default string;
}
