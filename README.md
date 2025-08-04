# Voice Alarm App

A React Native mobile application that allows users to record their voice for up to 15 seconds and set it as an alarm, or choose music files from their device to use as alarm sounds.

## Features

### 🎤 Voice Recording
- **15-Second Maximum Recording**: Tap the microphone icon to start recording your voice
- **Auto-Stop**: Recording automatically stops after 15 seconds
- **Real-time Timer**: See recording progress with a live timer
- **Visual Feedback**: Microphone button changes color during recording

### 🔊 Audio Playback
- **Instant Playback**: Listen to your recorded voice immediately
- **Play/Pause Controls**: Full control over audio playback
- **Progress Tracking**: See playback progress with timer

### 🎵 Music Selection
- **File Picker**: Choose any audio file from your device
- **Multiple Formats**: Supports common audio formats (MP3, M4A, WAV, etc.)
- **Preview Selection**: See selected music file name

### ⏰ Alarm Management
- **Voice or Music Alarms**: Set alarms using recorded voice or selected music
- **Pre-set Times**: Quick selection of common alarm times (6:00, 7:00, 8:00, 9:00, 10:00)
- **Active Alarm List**: View all set alarms with details
- **Easy Deletion**: Remove alarms with a single tap
- **Persistent Storage**: Alarms are saved and restored between app sessions

### 📱 Modern UI
- **Beautiful Gradient Design**: Matching the provided design mockup
- **Intuitive Controls**: Easy-to-use interface with clear visual feedback
- **Bottom Navigation**: Complete navigation structure
- **Modal Dialogs**: Clean alarm setting interface

## Installation

### Prerequisites
- Node.js (>= 16)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VoiceAlarmApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Android Setup**
   - Make sure Android Studio is installed
   - Create an Android Virtual Device (AVD) or connect a physical device

### Running the App

**For Android:**
```bash
npx react-native run-android
```

**For iOS:**
```bash
npx react-native run-ios
```

## Permissions

The app requires the following permissions:

### Android
- `RECORD_AUDIO` - For voice recording
- `WRITE_EXTERNAL_STORAGE` - For saving recordings
- `READ_EXTERNAL_STORAGE` - For accessing music files
- `VIBRATE` - For alarm notifications
- `RECEIVE_BOOT_COMPLETED` - For persistent alarms
- `WAKE_LOCK` - For alarm functionality
- `USE_EXACT_ALARM` - For precise alarm timing

### iOS
- `NSMicrophoneUsageDescription` - For voice recording
- `NSPhotoLibraryUsageDescription` - For accessing media files
- Background audio mode for alarm functionality

## Usage Guide

### Recording Your Voice
1. Tap the large microphone button in the center
2. Speak your message (maximum 15 seconds)
3. Tap the stop button or wait for auto-stop
4. Your recording is automatically saved

### Playing Back Your Recording
1. After recording, tap the play button (▶️) in the control area
2. Use the pause button to stop playback
3. Use the refresh button to reset and clear the recording

### Selecting Music
1. Tap the "Choose Music" button
2. Browse and select an audio file from your device
3. The selected file name will be displayed

### Setting an Alarm
1. Record your voice OR select a music file
2. Tap "Set as Alarm"
3. Choose from the preset times (6:00, 7:00, 8:00, 9:00, 10:00)
4. Your alarm is now active and will trigger at the specified time

### Managing Alarms
- View all active alarms in the "Active Alarms" section
- Each alarm shows the time, sound source, and type (Voice/Music)
- Tap the delete button (🗑️) to remove an alarm
- Alarms persist between app sessions

## Technical Details

### Dependencies
- **react-native-audio-recorder-player**: Audio recording and playback
- **react-native-document-picker**: File selection for music
- **react-native-push-notification**: Alarm notifications
- **react-native-fs**: File system operations
- **@react-native-async-storage/async-storage**: Data persistence
- **react-native-linear-gradient**: UI gradients
- **react-native-vector-icons**: Icons

### Architecture
- State management using React hooks
- Persistent storage with AsyncStorage
- Background notifications for alarms
- Permission handling for both platforms
- File system operations for audio storage

### Audio Recording
- Maximum 15-second duration with auto-stop
- Platform-specific file paths (iOS: .m4a, Android: .mp3)
- Real-time recording feedback
- Automatic cleanup and error handling

### Alarm System
- Local notifications with custom sounds
- Persistent alarm storage
- Automatic rescheduling for next day if time has passed
- Background audio support for alarm sounds

## Troubleshooting

### Common Issues

1. **Permissions Denied**
   - Ensure all required permissions are granted in device settings
   - Restart the app after granting permissions

2. **Recording Not Working**
   - Check microphone permissions
   - Ensure device has sufficient storage space
   - Try restarting the app

3. **File Selection Issues**
   - Verify storage permissions are granted
   - Ensure the selected file is a valid audio format

4. **Alarms Not Triggering**
   - Check notification permissions
   - Ensure the app is not being killed by battery optimization
   - Verify system date/time settings

### Platform-Specific Notes

**Android:**
- Some devices may require disabling battery optimization for the app
- Notification channels are automatically created for Android 8.0+

**iOS:**
- Background app refresh should be enabled for alarm functionality
- Notification permissions are requested automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both platforms
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review device permissions
3. Ensure all dependencies are properly installed
4. Test on a physical device for best results

---

**Note**: This app works best on physical devices due to audio recording and notification requirements. Some features may be limited in simulators/emulators.