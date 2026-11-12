// تنظیمات اندروید: افقی، تمام‌صفحه، آیکون، اسپلش تیره، ورژن و امضای نسخه‌ی release
const fs = require('fs'), path = require('path');
const rd = f => fs.readFileSync(f, 'utf8');
const RES = 'android/app/src/main/res';

// 1) افقی
const m = 'android/app/src/main/AndroidManifest.xml';
let x = rd(m);
if (!x.includes('screenOrientation')) x = x.replace('<activity', '<activity android:screenOrientation="sensorLandscape"');
fs.writeFileSync(m, x);

// 2) آیکون برنامه: حذف آیکون‌های پیش‌فرض و کپی آیکون خودمان
for (const d of fs.readdirSync(RES)) {
  if (!d.startsWith('mipmap-')) continue;
  for (const f of fs.readdirSync(path.join(RES, d)))
    if (f.startsWith('ic_launcher')) fs.unlinkSync(path.join(RES, d, f));
}
fs.cpSync('res-overrides', RES, { recursive: true });
console.log('icons installed');

// 3) تمام‌صفحه + اسپلش تیره (به‌جای لوگوی پیش‌فرض کپاسیتور)
const s = RES + '/values/styles.xml';
let y = rd(s);
y = y.replace(/(<style name="AppTheme\.NoActionBar"[^>]*>)/, '$1\n        <item name="android:windowFullscreen">true</item>');
y = y.replace(/@drawable\/splash/g, '@color/ic_launcher_background');
if (/<style name="AppTheme\.NoActionBarLaunch"[^>]*Theme\.SplashScreen/.test(y))
  y = y.replace(/(<style name="AppTheme\.NoActionBarLaunch"[^>]*>)/, '$1\n        <item name="windowSplashScreenBackground">@color/ic_launcher_background</item>');
fs.writeFileSync(s, y);

const cfg = JSON.parse(rd('capacitor.config.json'));
const dir = 'android/app/src/main/java/' + cfg.appId.split('.').join('/');
fs.writeFileSync(dir + '/MainActivity.java', `package ${cfg.appId};

import android.os.Build;
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
    if (Build.VERSION.SDK_INT >= 28) {
      getWindow().getAttributes().layoutInDisplayCutoutMode =
        WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
    }
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

// 4) ورژن و امضای release
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
  z = z.replace(/(buildTypes\s*\{\s*release\s*\{)/, '$1\n            signingConfig signingConfigs.release\n            debuggable false');
}
if (!z.includes('checkReleaseBuilds')) z = z.replace(/android\s*\{/, 'android {\n    lint {\n        checkReleaseBuilds false\n        abortOnError false\n    }');
if (!z.includes('signingConfig signingConfigs.release')) throw new Error('signing patch failed');
fs.writeFileSync(g, z);
console.log('android patched');
