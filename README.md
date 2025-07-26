# Medication Management App

A React Native application for managing medications with Firebase backend integration.

## Features

- **User Authentication**: Sign up and sign in functionality
- **Homepage**: Weekly view with medication schedule
- **Calendar**: Monthly calendar view for medication tracking
- **Add Medication**: Prescription form to add new medications
- **Profile Management**: User profile with personal information

## Technologies Used

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Authentication & Firestore)
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **Icons**: React Native Vector Icons
- **Calendar**: React Native Calendars

## Setup Instructions

### Prerequisites

1. Install Node.js (version 14 or higher)
2. Install Expo CLI: `npm install -g expo-cli`
3. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Go to your Firebase project settings
   - Copy your Firebase config object
   - Replace the placeholder config in `App.js` with your actual Firebase configuration:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-actual-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. Enable Authentication in Firebase:
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable "Email/Password" provider

5. Create Firestore Database:
   - Go to Firebase Console > Firestore Database
   - Create database in test mode
   - Set up the following collections:
     - `users` (for user profiles)
     - `medications` (for medication data)

### Running the App

1. Start the development server:
   ```bash
   npm start
   # or
   expo start
   ```

2. Use Expo Go app on your phone to scan the QR code, or run on simulator:
   ```bash
   npm run ios    # for iOS simulator
   npm run android # for Android emulator
   ```

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
  createdAt: "2024-01-01T00:00:00.000Z"
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
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## Navigation Flow

1. **Authentication Flow**:
   - Login Screen → Register Screen (optional) → Home Screen

2. **Main App Flow** (Bottom Tab Navigation):
   - Home: Dashboard with weekly view and medication list
   - Calendar: Monthly calendar for medication tracking
   - Add: Form to add new medications
   - Profile: User profile and settings

## Key Features Implementation

### Authentication
- Uses Firebase Authentication with email/password
- Automatic navigation based on auth state
- Form validation and error handling

### Home Screen
- Weekly calendar view
- Current day highlighting
- Medication list for selected day
- Empty state when no medications

### Calendar Screen
- Full monthly calendar
- Date selection
- Marked dates for medications
- Navigation between months

### Add Medication Screen
- Comprehensive form for medication details
- Required field validation
- Saves to Firestore with user association
- Success feedback and navigation

### Profile Screen
- Displays user information
- Sign out functionality
- Placeholder for edit profile and settings

## Customization

### Colors
The app uses a blue theme. To change colors, update the following in the StyleSheet objects:
- Primary: `#3f51b5`
- Success: `#4CAF50`
- Background: `#f5f5f5`

### Icons
Icons are from Material Icons. You can change them by updating the `name` prop in `Icon` components.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please ensure you have proper licenses for any commercial use.