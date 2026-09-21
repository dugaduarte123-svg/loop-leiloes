export const safe = func => {
  try {
    func();
  } catch (error) {
    console.error(error);
  }
};