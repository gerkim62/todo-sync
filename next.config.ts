import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: false,
});

export default withSerwist({
  // Your Next.js config
});
