function defer() {
  //initilize the functions as dead functions
  let resolve = () => {};
  let reject = () => {};
  const promise = new Promise((fst, snd) => {
    resolve = fst;
    reject = snd;
  });
  return {
    promise,
    resolve,
    reject
  };
}
export default defer;