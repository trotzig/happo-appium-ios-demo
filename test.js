const path = require('path');
const wdio = require('webdriverio');
const HappoController = require('happo-e2e/controller');
const { execSync } = require('child_process');

const opts = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    platformName: 'iOS',
    platformVersion: '15.2',
    deviceName: 'iPhone 13',
    app: path.resolve(
      __dirname,
      './build/Release-iphonesimulator/TestApp-iphonesimulator.app',
    ),
    automationName: 'XCUITest',
  },
};

async function main() {
  const happoController = new HappoController();
  await happoController.init();

  const client = await wdio.remote(opts);
  execSync('xcrun simctl status_bar booted override --time "12:00" --batteryState charged --batteryLevel 100 --cellularBars 4');
  const screenshot = await client.takeScreenshot();
  await happoController.registerLocalSnapshot({
    component: 'Foo',
    variant: 'bar',
    target: 'iPhone',
    buffer: Buffer.from(screenshot, 'base64'),
  });
  await client.deleteSession();
  await happoController.finish();
}

main();
