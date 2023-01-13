declare module '*?sharedworker&inline' {
  const sharedWorkerConstructor: {
    new (): SharedWorker;
  };
  export default sharedWorkerConstructor;
}
