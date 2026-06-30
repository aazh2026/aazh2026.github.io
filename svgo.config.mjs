// svgo configuration — applied to every SVG in assets/images before it's
// served. See scripts/check-svgo.js for the CI enforcement of this contract.
//
// Why we keep IDs (cleanupIds → false):
//   * `id="…"` references survive into post body when SVGs are inlined; some
//     posts use `<use href="#id">` and <animate xlink:href="#id">.
//   * draw.io / Excalidraw emit a lot of internal IDs that we'd otherwise
//     need to keep stable for cross-element references.
//   * `data-name` and similar attributes are emitted by draw.io / Excalidraw
//     and may be used by the planned dark-mode recolor pass.
// viewBox is preserved naturally — removeViewBox isn't in preset-default.

export default {
  multipass: true,
  js2svg: { indent: 0 },
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          cleanupIds: false,
        },
      },
    },
  ],
};