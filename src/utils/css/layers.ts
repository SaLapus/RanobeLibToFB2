const Layer = {
  Popup: 1000,
  Top: 10,
  Middle: 5,
  Low: 1,
};

const Layout = (() => {
  const Body = "100vh";

  // App
  const Header = "3em";
  const Main = `calc(${Body}-${Header})`;

  //Search
  const SBar = "3em";
  const SContent = `calc(${Main}-${SBar})`;

  return {
    Body,
    App: {
      Full: Body,

      Header,
      Main,
    },
    Search: {
      Full: Main,

      Bar: SBar,
      Content: SContent,
    },
    Title: {
      Full: Main,
    },
  };
})();

export { Layer, Layout };

