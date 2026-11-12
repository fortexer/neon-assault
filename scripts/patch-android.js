// افقی کردن اپ و تمام‌صفحه کردن آن بعد از ساخت پروژه‌ی اندروید
const fs = require('fs');
const m = 'android/app/src/main/AndroidManifest.xml';
let x = fs.readFileSync(m, 'utf8');
if (!x.includes('screenOrientation')) x = x.replace('<activity', '<activity android:screenOrientation="sensorLandscape"');
fs.writeFileSync(m, x);
const s = 'android/app/src/main/res/values/styles.xml';
let y = fs.readFileSync(s, 'utf8');
y = y.replace(/(<style name="AppTheme\.NoActionBar"[^>]*>)/,
  '$1\n        <item name="android:windowFullscreen">true</item>\n        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>');
fs.writeFileSync(s, y);
console.log('android patched');
