import { resolve } from "node:path";
import nativeConfigDefault from "@mendix/pluggable-widgets-tools/configs/rollup.config.native.mjs";

const nativeEntry = resolve("src/ComboTreeMultiEntityNative.tsx");

function isNativeBundleOutput(output) {
    if (!output || typeof output !== "object") {
        return false;
    }
    const file = output.file;
    return typeof file === "string" && (file.endsWith(".ios.js") || file.endsWith(".android.js"));
}

export default async function nativeOverrideConfig(args) {
    const defaultConfig = await nativeConfigDefault(args);
    if (!Array.isArray(defaultConfig)) {
        return defaultConfig;
    }

    return defaultConfig.map(config => {
        const outputs = Array.isArray(config.output) ? config.output : [config.output];
        const isNativeConfig = outputs.some(output => isNativeBundleOutput(output));

        if (!isNativeConfig) {
            return config;
        }

        return {
            ...config,
            input: nativeEntry
        };
    });
}

