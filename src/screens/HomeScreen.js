import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen() {
  const [currentWeek, setCurrentWeek] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [medications, setMedications] = useState([]);
  const [todayMeds, setTodayMeds] = useState([]);

  useEffect(() => {
    generateCurrentWeek();
    fetchMedications();
  }, []);

  const generateCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    const week = [];
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push({
        day: days[i],
        date: date.getDate(),
        fullDate: date,
        isToday: i === currentDay,
      });
    }
    setCurrentWeek(week);
  };

  const fetchMedications = () => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('medications')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const meds = [];
        querySnapshot.forEach((doc) => {
          meds.push({ id: doc.id, ...doc.data() });
        });
        setMedications(meds);
        
        // Filter today's medications
        const today = new Date().toDateString();
        const todaysMedications = meds.filter(med => {
          // Simple check - in real app, you'd check schedule
          return true; // Show all for now
        });
        setTodayMeds(todaysMedications);
      });

    return unsubscribe;
  };

  const renderDayItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.dayContainer,
        item.isToday && styles.selectedDay,
        selectedDay === index && styles.selectedDay,
      ]}
      onPress={() => setSelectedDay(index)}
    >
      <Text style={[
        styles.dayText,
        (item.isToday || selectedDay === index) && styles.selectedDayText,
      ]}>
        {item.day}
      </Text>
      <Text style={[
        styles.dateText,
        (item.isToday || selectedDay === index) && styles.selectedDateText,
      ]}>
        {item.date}
      </Text>
    </TouchableOpacity>
  );

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medicationCard}>
      <View style={styles.medicationInfo}>
        <Text style={styles.medicationName}>{item.name}</Text>
        <Text style={styles.medicationDosage}>{item.dosage}</Text>
        <Text style={styles.medicationTime}>{item.time}</Text>
      </View>
      <TouchableOpacity style={styles.medicationAction}>
        <Icon name="check-circle-outline" size={24} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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

      {/* Week View */}
      <View style={styles.weekContainer}>
        <FlatList
          data={currentWeek}
          renderItem={renderDayItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekList}
        />
        <Text style={styles.dateSubtext}>Today, Apr 2</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {todayMeds.length === 0 ? (
          <View style={styles.noTaskContainer}>
            <Text style={styles.noTaskText}>No task</Text>
          </View>
        ) : (
          <FlatList
            data={todayMeds}
            renderItem={renderMedicationItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
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
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 15,
  },
  weekContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  weekList: {
    paddingHorizontal: 20,
  },
  dayContainer: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    minWidth: 60,
  },
  selectedDay: {
    backgroundColor: '#3f51b5',
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  selectedDayText: {
    color: '#fff',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
  },
  dateSubtext: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  noTaskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  noTaskText: {
    fontSize: 18,
    color: '#666',
  },
  medicationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  medicationTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  medicationAction: {
    padding: 5,
  },
});