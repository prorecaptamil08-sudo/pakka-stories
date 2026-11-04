import {Config} from '@remotion/cli/config';

/**
 * Central Remotion render configuration.
 *
 * The browser executable can be overridden with REMOTION_BROWSER_EXECUTABLE so the
 * project can render in air-gapped / sandboxed environments that ship their own
 * Chromium instead of downloading Remotion's browser.
 */

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setStillImageFormat('png');
Config.setOverwriteOutput(true);

// Conservative settings: this project is designed to render on small (2 vCPU / 3 GB) machines.
Config.setConcurrency(2);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');

// Allow air-gapped rendering with a locally provided Chromium.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
if (process.env.REMOTION_CHROME_MODE === 'chrome-for-testing') {
  Config.setChromeMode('chrome-for-testing');
}

// Fonts are loaded from public/fonts via @remotion/fonts (no network access needed).
Config.setDelayRenderTimeoutInMilliseconds(60000);
