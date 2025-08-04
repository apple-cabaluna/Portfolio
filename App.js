import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  StatusBar,
  Modal,
  FlatList,
  BackHandler,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const audioRecorderPlayer = new AudioRecorderPlayer();

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [playTime, setPlayTime] = useState('00:00');
  const [recordedUri, setRecordedUri] = useState('');
  const [alarms, setAlarms] = useState([]);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [recordingTimer, setRecordingTimer] = useState(null);

  useEffect(() => {
    requestPermissions();
    loadAlarms();
    setupNotifications();
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showAlarmModal) {
        setShowAlarmModal(false);
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
      if (recordingTimer) {
        clearTimeout(recordingTimer);
      }
    };
  }, []);

  const setupNotifications = () => {
    PushNotification.configure({
      onNotification: function(notification) {
        if (notification.userInteraction) {
          // Handle alarm notification tap
          playAlarmSound(notification.data.soundUri);
        }
      },
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: 'voice-alarm-channel',
        channelName: 'Voice Alarms',
        channelDescription: 'Channel for voice alarm notifications',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const loadAlarms = async () => {
    try {
      const savedAlarms = await AsyncStorage.getItem('voice_alarms');
      if (savedAlarms) {
        setAlarms(JSON.parse(savedAlarms));
      }
    } catch (error) {
      console.log('Error loading alarms:', error);
    }
  };

  const saveAlarms = async (newAlarms) => {
    try {
      await AsyncStorage.setItem('voice_alarms', JSON.stringify(newAlarms));
      setAlarms(newAlarms);
    } catch (error) {
      console.log('Error saving alarms:', error);
    }
  };

  const startRecording = async () => {
    try {
      const path = Platform.select({
        ios: 'voice_recording.m4a',
        android: `${RNFS.CachesDirectoryPath}/voice_recording.mp3`,
      });

      const result = await audioRecorderPlayer.startRecorder(path);
      setRecordedUri(result);
      setIsRecording(true);
      
      audioRecorderPlayer.addRecordBackListener((e) => {
        const minutes = Math.floor(e.currentPosition / 60000);
        const seconds = Math.floor((e.currentPosition % 60000) / 1000);
        setRecordTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      });

      // Auto-stop recording after 15 seconds
      const timer = setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 15000);
      setRecordingTimer(timer);

    } catch (error) {
      console.log('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordedUri(result);
      
      if (recordingTimer) {
        clearTimeout(recordingTimer);
        setRecordingTimer(null);
      }
      
      Alert.alert('Recording Complete', 'Your voice has been recorded successfully!');
    } catch (error) {
      console.log('Error stopping recording:', error);
    }
  };

  const playRecording = async () => {
    if (!recordedUri) {
      Alert.alert('No Recording', 'Please record your voice first');
      return;
    }

    try {
      if (isPlaying) {
        await audioRecorderPlayer.stopPlayer();
        setIsPlaying(false);
      } else {
        await audioRecorderPlayer.startPlayer(recordedUri);
        setIsPlaying(true);
        
        audioRecorderPlayer.addPlayBackListener((e) => {
          const minutes = Math.floor(e.currentPosition / 60000);
          const seconds = Math.floor((e.currentPosition % 60000) / 1000);
          setPlayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          
          if (e.currentPosition === e.duration) {
            setIsPlaying(false);
            audioRecorderPlayer.removePlayBackListener();
          }
        });
      }
    } catch (error) {
      console.log('Error playing recording:', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const selectMusic = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      
      setSelectedMusic(result[0]);
      Alert.alert('Music Selected', `Selected: ${result[0].name}`);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled music selection');
      } else {
        console.log('Error selecting music:', error);
        Alert.alert('Error', 'Failed to select music file');
      }
    }
  };

  const setAlarm = () => {
    if (!recordedUri && !selectedMusic) {
      Alert.alert('No Audio', 'Please record your voice or select music first');
      return;
    }
    setShowAlarmModal(true);
  };

  const createAlarm = (time) => {
    const alarmId = Date.now().toString();
    const soundUri = recordedUri || selectedMusic?.uri;
    const soundName = recordedUri ? 'Voice Recording' : selectedMusic?.name;
    
    const newAlarm = {
      id: alarmId,
      time: time,
      soundUri: soundUri,
      soundName: soundName,
      isActive: true,
      type: recordedUri ? 'voice' : 'music',
    };

    const updatedAlarms = [...alarms, newAlarm];
    saveAlarms(updatedAlarms);

    // Schedule notification
    const [hours, minutes] = time.split(':');
    const alarmDate = new Date();
    alarmDate.setHours(parseInt(hours));
    alarmDate.setMinutes(parseInt(minutes));
    alarmDate.setSeconds(0);

    if (alarmDate <= new Date()) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      id: alarmId,
      channelId: 'voice-alarm-channel',
      title: 'Voice Alarm',
      message: `Time to wake up! Playing: ${soundName}`,
      date: alarmDate,
      soundName: 'default',
      vibrate: true,
      vibration: 300,
      data: { soundUri: soundUri },
    });

    setShowAlarmModal(false);
    Alert.alert('Alarm Set', `Alarm set for ${time} with ${soundName}`);
  };

  const deleteAlarm = (alarmId) => {
    const updatedAlarms = alarms.filter(alarm => alarm.id !== alarmId);
    saveAlarms(updatedAlarms);
    PushNotification.cancelLocalNotifications({ id: alarmId });
  };

  const playAlarmSound = async (soundUri) => {
    try {
      await audioRecorderPlayer.startPlayer(soundUri);
    } catch (error) {
      console.log('Error playing alarm sound:', error);
    }
  };

  const AlarmModal = () => (
    <Modal
      visible={showAlarmModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAlarmModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Set Alarm Time</Text>
          
          <View style={styles.timeButtonsContainer}>
            {['06:00', '07:00', '08:00', '09:00', '10:00'].map((time) => (
              <TouchableOpacity
                key={time}
                style={styles.timeButton}
                onPress={() => createAlarm(time)}
              >
                <Text style={styles.timeButtonText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowAlarmModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderAlarm = ({ item }) => (
    <View style={styles.alarmItem}>
      <View style={styles.alarmInfo}>
        <Text style={styles.alarmTime}>{item.time}</Text>
        <Text style={styles.alarmSound}>{item.soundName}</Text>
        <Text style={styles.alarmType}>{item.type === 'voice' ? '🎤 Voice' : '🎵 Music'}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteAlarm(item.id)}
      >
        <Icon name="delete" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#4A90E2', '#7B68EE']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Alarm</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Icon name="more-vert" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.microphoneContainer}>
          <TouchableOpacity
            style={[styles.microphoneButton, isRecording && styles.microphoneButtonActive]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Icon 
              name={isRecording ? "stop" : "mic"} 
              size={60} 
              color={isRecording ? "#ff4444" : "#4A90E2"} 
            />
          </TouchableOpacity>
          
          <Text style={styles.recordTime}>{recordTime}</Text>
          
          {isRecording && (
            <Text style={styles.recordingText}>Recording... (Max 15s)</Text>
          )}
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.playbackControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={playRecording}
            >
              <Icon name={isPlaying ? "pause" : "play-arrow"} size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                setRecordTime('00:00');
                setPlayTime('00:00');
                setRecordedUri('');
                setIsPlaying(false);
              }}
            >
              <Icon name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {playTime !== '00:00' && (
            <Text style={styles.playTime}>Playing: {playTime}</Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={selectMusic}>
            <Text style={styles.actionButtonText}>Choose Music</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={setAlarm}>
            <Text style={styles.actionButtonText}>Set as Alarm</Text>
          </TouchableOpacity>
        </View>

        {selectedMusic && (
          <View style={styles.selectedMusicContainer}>
            <Text style={styles.selectedMusicText}>Selected: {selectedMusic.name}</Text>
          </View>
        )}

        <View style={styles.alarmsSection}>
          <Text style={styles.alarmsTitle}>Active Alarms</Text>
          <FlatList
            data={alarms}
            renderItem={renderAlarm}
            keyExtractor={(item) => item.id}
            style={styles.alarmsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="white" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="access-time" size={24} color="white" />
          <Text style={styles.navText}>Alarms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemCenter}>
          <View style={styles.addButton}>
            <Icon name="add" size={24} color="#4A90E2" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="volume-up" size={24} color="white" />
          <Text style={styles.navText}>Sounds</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={24} color="white" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <AlarmModal />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerRight: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  microphoneContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  microphoneButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  microphoneButtonActive: {
    backgroundColor: '#ffebee',
  },
  recordTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  recordingText: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
    opacity: 0.8,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playTime: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedMusicContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectedMusicText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  alarmsSection: {
    flex: 1,
  },
  alarmsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  alarmsList: {
    flex: 1,
  },
  alarmItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  alarmSound: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginTop: 2,
  },
  alarmType: {
    fontSize: 12,
    color: 'white',
    opacity: 0.6,
    marginTop: 2,
  },
  deleteButton: {
    padding: 10,
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  timeButtonsContainer: {
    width: '100%',
  },
  timeButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  timeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;