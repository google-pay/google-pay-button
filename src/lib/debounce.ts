export function debounce<T>(func: (...params: any[]) => T, wait: number = 0): () => Promise<T> {
  let timeout: number | undefined;

  return function(...args: any[]) {
    window.clearTimeout(timeout);

    var later = function() {
      timeout = undefined;
      return func.apply<any, any[], T>(null, args);
    };

    return new Promise(resolve => {
      timeout = window.setTimeout(() => {
        const result = later();
        resolve(result);
      }, wait);     
    });
  };
};
