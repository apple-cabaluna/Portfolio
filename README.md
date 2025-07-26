# Medication Management App

A React Native application for managing medications with Firebase backend integration.

## Features

- **User Authentication**: Sign up and sign in functionality
- **Homepage**: Weekly view with medication schedule
- **Calendar**: Monthly calendar view for medication tracking
- **Add Medication**: Prescription form to add new medications
- **Profile Management**: User profile with personal information

## Technologies Used

- **Frontend**: React Native CLI
- **Backend**: Firebase (Authentication & Firestore)
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **Icons**: React Native Vector Icons
- **Calendar**: React Native Calendars

## Setup Instructions

### Prerequisites

1. Install Node.js (version 14 or higher)
2. Install React Native CLI: `npm install -g react-native-cli`
3. Set up Android Studio and/or Xcode for mobile development
4. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. **Android Setup**:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

4. **iOS Setup** (Mac only):
   ```bash
   cd ios
   pod install
   cd ..
   ```

5. **Configure Firebase**:
   - Go to your Firebase project settings
   - Download `google-services.json` for Android and place it in `android/app/`
   - Download `GoogleService-Info.plist` for iOS and add it to your Xcode project
   - The app is already configured to use React Native Firebase

6. **Enable Firebase Services**:
   - **Authentication**: Enable Email/Password provider in Firebase Console
   - **Firestore**: Create database in test mode

### Running the App

1. **Start Metro bundler**:
   ```bash
   npm start
   ```

2. **Run on Android**:
   ```bash
   npm run android
   ```

3. **Run on iOS** (Mac only):
   ```bash
   npm run ios
   ```

## Firebase Setup

### Android Configuration
1. Go to Firebase Console → Project Settings
2. Add Android app with package name: `com.medicationapp`
3. Download `google-services.json`
4. Place it in `android/app/google-services.json`

### iOS Configuration
1. Go to Firebase Console → Project Settings
2. Add iOS app with bundle ID: `com.medicationapp`
3. Download `GoogleService-Info.plist`
4. Add it to your iOS project in Xcode

## App Structure

```
src/
├── screens/
│   ├── LoginScreen.js          # Sign in screen
│   ├── RegisterScreen.js       # Registration form
│   ├── HomeScreen.js          # Main dashboard
│   ├── CalendarScreen.js      # Calendar view
│   ├── AddMedicationScreen.js # Add medication form
│   └── ProfileScreen.js       # User profile
```

## Key Features

### Authentication Flow
- **Login Screen** → **Register Screen** (optional) → **Home Screen**
- Automatic navigation based on authentication state

### Main App Flow (Bottom Tab Navigation)
- **Home**: Dashboard with weekly view and medication list
- **Calendar**: Monthly calendar for medication tracking  
- **Add**: Form to add new medications (Plus button)
- **Profile**: User profile and settings

### Navigation
- When you click **register** or **sign in** → goes directly to **homepage**
- When you click **calendar button** → shows calendar view
- When you click **plus (+) button** → goes to add medication form

## Firebase Collections

### Users Collection
```javascript
{
  fname: "John",
  lname: "Doe", 
  age: "30",
  gender: "Male",
  height: "6'0\"",
  weight: "180 lbs",
  contactNumber: "+1234567890",
  email: "john@example.com",
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
}
```

### Medications Collection  
```javascript
{
  name: "Aspirin",
  dosage: "500mg",
  frequency: "Twice daily",
  time: "8:00 AM, 8:00 PM",
  duration: "7 days",
  instructions: "Take with food",
  prescribedBy: "Dr. Smith",
  startDate: "01/01/2024",
  endDate: "01/07/2024", 
  userId: "user-uid",
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
}
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues**:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

3. **iOS build issues**:
   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

4. **Vector Icons not showing**:
   - Make sure you've run the linking process
   - For Android, check if fonts are properly copied

### Dependencies

The app uses React Native Firebase which requires:
- `@react-native-firebase/app` - Core Firebase app
- `@react-native-firebase/auth` - Authentication
- `@react-native-firebase/firestore` - Database

## Development

- The app uses React Native CLI (not Expo)
- Firebase configuration is handled through native SDKs
- Icons are from Material Icons via react-native-vector-icons
- Navigation uses React Navigation v6

## License

This project is for educational purposes. Please ensure you have proper licenses for any commercial use.