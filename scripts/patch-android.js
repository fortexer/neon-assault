// تنظیمات اندروید: افقی، تمام‌صفحه‌ی واقعی، ورژن و امضای نسخه‌ی release
const fs = require('fs');
const rd = f => fs.readFileSync(f, 'utf8');

// 1) افقی
const m = 'android/app/src/main/AndroidManifest.xml';
let x = rd(m);
if (!x.includes('screenOrientation')) x = x.replace('<activity', '<activity android:screenOrientation="sensorLandscape"');
fs.writeFileSync(m, x);

// 2) تمام‌صفحه (بدون نوار وضعیت و نوار پایین) و استفاده از ناحیه‌ی ناچ
const s = 'android/app/src/main/res/values/styles.xml';
let y = rd(s);
y = y.replace(/(<style name="AppTheme\.NoActionBar"[^>]*>)/,
  '$1\n        <item name="android:windowFullscreen">true</item>\n        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>');
fs.writeFileSync(s, y);

const cfg = JSON.parse(rd('capacitor.config.json'));
const dir = 'android/app/src/main/java/' + cfg.appId.split('.').join('/');
fs.writeFileSync(dir + '/MainActivity.java', `package ${cfg.appId};

import android.os.Bundle;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    hideBars();
  }
  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) hideBars();
  }
  private void hideBars() {
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
    c.hide(WindowInsetsCompat.Type.systemBars());
    c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
  }
}
`);

// 3) ورژن و امضا
const g = 'android/app/build.gradle';
let z = rd(g);
z = z.replace(/versionCode\s+\d+/, 'versionCode ' + (process.env.VERSION_CODE || '1'))
     .replace(/versionName\s+"[^"]*"/, 'versionName "' + (process.env.VERSION_NAME || '1.0') + '"');
if (!z.includes('signingConfigs')) {
  z = z.replace(/buildTypes\s*\{/, `signingConfigs {
        release {
            storeFile file(System.getenv('KEYSTORE_PATH') ?: 'release.jks')
            storePassword System.getenv('KEYSTORE_PASSWORD')
            keyAlias System.getenv('KEY_ALIAS')
            keyPassword System.getenv('KEY_PASSWORD')
        }
    }
    buildTypes {`);
  z = z.replace(/(buildTypes\s*\{\s*release\s*\{)/, '$1\n            signingConfig signingConfigs.release');
}
fs.writeFileSync(g, z);
console.log('android patched');
