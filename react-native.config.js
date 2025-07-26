module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          sourceDir: '../node_modules/react-native-vector-icons/ios',
          project: 'RNVectorIcons.xcodeproj',
        },
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/android',
          packageImportPath: 'import io.callstack.react.calendarevents.CalendarEventsPackage;',
        },
      },
    },
  },
};