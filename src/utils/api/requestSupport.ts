import Awaiter from "./awaiter";

const awaiter = new Awaiter();

export default function requestSupport<Input, Output>(
  reqFunc: (...value: Input[]) => Promise<Output>
): (...value: Input[]) => Promise<Output> {
  return async (...value: Input[]) => {
    let returnValue: Output;
    let attempts = 0;

    do {
      try {
        await awaiter.next();

        returnValue = await reqFunc(...value);

        return returnValue;
      } catch (e) {
        attempts++;
        console.error(e);
        if (attempts === 10)
          throw `Too many (10) attempts at ${reqFunc.name}\nArgs: ${value}`;
      }
      // eslint-disable-next-line no-constant-condition
    } while (true);
  };
}
