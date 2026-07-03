/** SVGO config for logo.svg — keeps xmlns and viewBox for <img> / favicon use. */
export default {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIds: false,
        },
      },
    },
    {
      name: "convertPathData",
      params: { floatPrecision: 1, transformPrecision: 1 },
    },
    "removeTitle",
    "removeDesc",
    "removeMetadata",
    "removeEditorsNSData",
  ],
};
