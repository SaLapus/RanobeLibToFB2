import Awaiter from "./awaiter";

const awaiter = new Awaiter();

export default function requestSupport<
  Args extends unknown[],
  Return extends Promise<unknown>
>(
  reqFunc: (...args: Args) => Return
): (...args: Args) => Promise<Awaited<Return>> {
  return async (...value: Args): Promise<Awaited<Return>> => {
    let attempts = 0;

    while (attempts < 10) {
      try {
        await awaiter.next();

        // Fix to remove this await
        // Or try understand why it needs from logic point
        return await reqFunc(...value);
      } catch (e) {
        attempts++;
        console.error(e);

        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(1000 * attempts, 5000))
        );
      }
    }

    throw new Error(
      `Too many (10) attempts at ${reqFunc.name}\nArgs: ${value.join()}`
    );
  };
}
