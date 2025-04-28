module.exports = {
    name: "Deepfaking-detection",
    script: "node_modules/serve/build/main.js",
    args: ["-s", "build", "-p", "3009"],
    watch: true,
    ignore_watch: ["node_modules", "build"],
    exec_mode: "fork",
};
