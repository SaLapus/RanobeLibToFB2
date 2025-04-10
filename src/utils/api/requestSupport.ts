import Awaiter from "./awaiter";

const awaiter = new Awaiter();

export default function requestSupport<
  Args extends unknown[],
  Return extends Promise<unknown>
>(reqFunc: (...args: Args) => Return): (...args: Args) => Promise<Awaited<Return>> {
  return async (
    ...value: Args
  ): Promise<Awaited<Return>> => {
    do {
      let attempts = 0;
      try {
        await awaiter.next();

        return await reqFunc(...value);
      } catch (e) {
        attempts++;
        console.error(e);
        if (attempts === 10)
          console.error(
            `Too many (10) attempts at ${reqFunc.name}\nArgs: ${value.join()}`
          );
      }
      // eslint-disable-next-line no-constant-condition
    } while (true);
  };
}
