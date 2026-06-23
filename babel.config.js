const sourceTraceEnabled = process.env.AVS_SOURCE_TRACE === "1" || process.env.AVS_CAPTURE_SOURCE_TRACE === "1";

module.exports = {
  presets: ["next/babel"],
  plugins: sourceTraceEnabled ? ["./scripts/avs-jsx-source-trace-babel.cjs"] : [],
};
