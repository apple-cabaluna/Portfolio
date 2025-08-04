# Voice Alarm - AudioRecorderPlayer Fix

## Problem
The error `const audioRecorderPlayer = new AudioRecorderPlayer();` occurs when the `react-native-audio-recorder-player` library is not properly installed or imported.

## Solution

### 1. Install the required package
```bash
npm install react-native-audio-recorder-player
```

### 2. For React Native 0.60+, link the library automatically:
```bash
cd ios && pod install && cd ..
```

### 3. For older React Native versions, manually link:
```bash
react-native link react-native-audio-recorder-player
```

### 4. Android Permissions
Add these permissions to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### 5. iOS Permissions
Add these permissions to `ios/YourProject/Info.plist`:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone to record voice alarms</string>
```

## Usage

The fixed code is in `VoiceAlarm.js`. Key fixes:

1. **Proper Import**: `import AudioRecorderPlayer from 'react-native-audio-recorder-player';`
2. **State Management**: Use `useState` to create the AudioRecorderPlayer instance
3. **Error Handling**: Wrap all audio operations in try-catch blocks
4. **Cleanup**: Remove listeners in useEffect cleanup

## Features
- Record voice alarms
- Play recorded alarms
- Real-time recording timer
- Playback progress tracking
- Error handling and user feedback

## Common Issues

### If you still get the error:
1. Make sure the package is installed: `npm list react-native-audio-recorder-player`
2. Clear cache: `npx react-native start --reset-cache`
3. Rebuild the app: `npx react-native run-android` or `npx react-native run-ios`
4. Check that auto-linking worked: `npx react-native config`

### For Android build issues:
Add to `android/app/build.gradle`:
```gradle
android {
    ...
    packagingOptions {
        pickFirst '**/libc++_shared.so'
        pickFirst '**/libjsc.so'
    }
}
```