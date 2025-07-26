import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#3f51b5',
    },
    '2024-04-05': {
      marked: true,
      dotColor: '#4CAF50',
    },
    '2024-04-10': {
      marked: true,
      dotColor: '#FF9800',
    },
    '2024-04-15': {
      marked: true,
      dotColor: '#F44336',
    },
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jojns</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="calendar-today" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Week Days Header */}
      <View style={styles.weekHeader}>
        <View style={styles.weekDaysContainer}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
            <View key={index} style={styles.weekDayItem}>
              <Text style={[
                styles.weekDayText,
                index === 1 && styles.selectedWeekDay // Monday selected in the image
              ]}>
                {day}
              </Text>
              <Text style={[
                styles.weekDayNumber,
                index === 1 && styles.selectedWeekDayNumber
              ]}>
                {29 + index}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.todayText}>Today, Apr 2</Text>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          onDayPress={onDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#3f51b5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#3f51b5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: '#3f51b5',
            monthTextColor: '#2d4150',
            indicatorColor: '#3f51b5',
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 13
          }}
          style={styles.calendar}
        />
      </View>

      {/* Selected Date Info */}
      <View style={styles.dateInfoContainer}>
        <Text style={styles.selectedDateText}>
          Selected: {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3f51b5',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 15,
  },
  weekHeader: {
    backgroundColor: '#fff',
    paddingVertical: 15,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  weekDayItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  selectedWeekDay: {
    backgroundColor: '#3f51b5',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  selectedWeekDay: {
    color: '#fff',
  },
  weekDayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedWeekDayNumber: {
    color: '#fff',
  },
  todayText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendar: {
    borderRadius: 10,
  },
  dateInfoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});