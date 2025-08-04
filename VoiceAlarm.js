import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const VoiceAlarm = () => {
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [audioRecorderPlayer]);

  const onStartRecord = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordSecs(e.currentPosition);
        setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      });
      setIsRecording(true);
      console.log('Recording started:', result);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordSecs(0);
      setIsRecording(false);
      console.log('Recording stopped:', result);
      Alert.alert('Success', 'Voice alarm recorded successfully!');
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const onStartPlay = async () => {
    try {
      const msg = await audioRecorderPlayer.startPlayer();
      audioRecorderPlayer.addPlayBackListener((e) => {
        setCurrentPositionSec(e.currentPosition);
        setCurrentDurationSec(e.duration);
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      });
      setIsPlaying(true);
      console.log('Playback started:', msg);
    } catch (error) {
      console.error('Error starting playback:', error);
      Alert.alert('Error', 'Failed to play voice alarm');
    }
  };

  const onStopPlay = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      console.log('Playback stopped');
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Alarm Recorder</Text>
      
      <View style={styles.recordSection}>
        <Text style={styles.recordTime}>{recordTime}</Text>
        <TouchableOpacity
          style={[styles.button, isRecording ? styles.stopButton : styles.recordButton]}
          onPress={isRecording ? onStopRecord : onStartRecord}
        >
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.playSection}>
        <Text style={styles.playTime}>{playTime} / {duration}</Text>
        <TouchableOpacity
          style={[styles.button, isPlaying ? styles.stopButton : styles.playButton]}
          onPress={isPlaying ? onStopPlay : onStartPlay}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? 'Stop Alarm' : 'Play Alarm'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  recordSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  playSection: {
    alignItems: 'center',
  },
  recordTime: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  playTime: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 150,
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: '#4CAF50',
  },
  playButton: {
    backgroundColor: '#2196F3',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VoiceAlarm;