import { Config } from "@remotion/cli/config";
// Keep hardware-accelerated WebGL for local desktop renders; CI overrides this with --gl=swiftshader.
Config.setChromiumOpenGlRenderer("angle");
Config.setOverwriteOutput(true);
