import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, FlatList, Alert, Platform, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { inMovementDb } from '@/firebaseConfig';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';



interface Profile {
    uid?: string;
    firstName: string;
    secondName: string;
    dateOfBirth: Date;
    email: string;
    password?: string;
    confirmPassword?: string;
    gender: string;
    avatar?: string;
    currentCondition?: string;
    medicalHistory?: string;
    enabled?: boolean;
    createdAt?: Date;
    modifiedAt: Date;
    symptoms?: string[];
    therapeuticPlans?: string[];
  }
  
  export default function UpdateScreen({ navigation }: { navigation: any }) {
    const [avatar, setAvatar] = useState('');
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [errors, setErrors] = useState({firstName: '', secondName: '', dateOfBirth:'', email: '', password:'', confirmPassword: '', gender: '',});
    const [currentConditions, setCurrentConditions] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [symptoms, setSymptoms] = useState([]);
    const [therapeuticPlans, setTherapeuticPlans] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const auth = getAuth();

    const currentUser = auth.currentUser;
    
  
    const pickImageAsync = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        const imageUrl = result.assets[0].uri;
        const filename = imageUrl.split('/').pop(); //extract the filename
        const newPath = `${FileSystem.documentDirectory}${filename}`
  
        try {
          await FileSystem.copyAsync({
            from: imageUrl,
            to: newPath,
          });
        setAvatar(newPath);
        }catch (error){
          console.error('Error saving image:', error);
          Alert.alert('Error', 'No se pudo guardar la imagen.');
        }
      }
    };
  
    useEffect(() => {
      const fetchUserData = async () => {
        if(currentUser) {
  
          const userQuery = query(
            collection(inMovementDb, 'patients'),
            where('uid', '==', currentUser.uid));
         
          (await getDocs(userQuery)).docs.map((doc) => {
            setFirstName(doc.data().firstName);
            setSecondName(doc.data().secondName);
            setDateOfBirth(doc.data().dateOfBirth ? new Date(doc.data().dateOfBirth.seconds * 1000): null);
            setEmail(doc.data().email);
            setGender(doc.data().gender);
            setCurrentConditions(doc.data().currentCondition || 'No tiene condiciones actuales en el sistema.');
            setMedicalHistory(doc.data().medicalHistory || 'No tiene historial medico en el sistema.');
            if(doc.data().avatar) {
              setAvatar(doc.data().avatar);
            }
          });
        }
      };
      fetchUserData();
    },[]);
  
  
    const toggleDatePicker = () => {
      setShowDatePicker(!showDatePicker);
    };
  
    const onDateChange = (_: any, selectedDate?: Date) => {
      setShowDatePicker(Platform.OS === 'ios'); // Close picker on Android, keep open on iOS
      if (selectedDate) {
        setDateOfBirth(selectedDate);
      }
    };
  
  
    const validateFields = () => {
      let valid = true;
      const newErrors = {firstName:'', secondName:'', dateOfBirth:'', email:'', password:'', confirmPassword:'', gender:''};
  
      if (!firstName) {
        newErrors.firstName = 'Ingrese su nombre';
        valid = false;
      }
  
      if (!secondName) {
        newErrors.secondName = 'Ingresar su segundo nombre';
        valid = false;
      }
  
      if (!dateOfBirth) {
        newErrors.dateOfBirth = 'Ingresar su fecha de nacimiento';
        valid = false;
      }
  
      if (!email) {
        newErrors.email = 'Ingresar su correo electrónico';
        valid = false;
      }
  
      // if (!password || password.length < 6) {
      //   newErrors.password = 'Ingresar una contraseña de al menos 6 caracteres';
      //   valid = false;
      // }
  
      // if (password !== confirmPassword) {
      //   newErrors.confirmPassword = 'Las contraseñas no coinciden';
      //   valid = false;
      // }
  
      if (!gender) {
        newErrors.gender = 'Seleccionar un género';
        valid = false;
      }
  
      setErrors(newErrors);
      return valid;
  
    };
  
    // Function to handle saving profile updates
    const handleUdpateProfile = async () => {
      if(validateFields()) {
        if(!currentUser){
          Alert.alert('Debe iniciar sesión para actualizar su información');
          return;
        }
        const userRef = doc(inMovementDb, 'patients', currentUser.uid);
        await updateDoc(userRef, {
          firstName: firstName,
          secondName: secondName,
          dateOfBirth: dateOfBirth,
          email: email,
          gender: gender,
          modifiedAt: new Date(),
          avatar: avatar,
        }).then(function(){
          Alert.alert('Información actualizada correctamente');
          navigation.navigate('home' as never);
        }).catch((error) => {
          Alert.alert('Hubo un error al actualizar su información', error.message);
          console.log("TrackError: ", error.message);
        });
      }
    };
  
    const renderItem = ({item}: {item: string}) => (
      <Text style={styles.listItem}>• {item}</Text>
    );
  
    return (
      <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView}>
  
          <TouchableOpacity onPress={pickImageAsync}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>Cargar foto</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Primer nombre</Text>
            <TextInput
                placeholder="Primer Nombre"
                value={firstName}
                onChangeText={setFirstName}
                style={[styles.input, errors.firstName ? styles.inputError: null]}
              />
              {
              errors.firstName ? 
              <Text style={styles.errorText}>{errors.firstName}</Text> 
              : null
              }
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Segundo nombre</Text>
            <TextInput
                placeholder="Segundo Nombre"
                value={secondName}
                onChangeText={setSecondName}
                style={[styles.input, errors.secondName ? styles.inputError: null]}
              />
              {
              errors.secondName? 
              <Text style={styles.errorText}>{errors.secondName}</Text> 
              : null
              }
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha de nacimiento:</Text>
            <TouchableOpacity onPress={toggleDatePicker} style={styles.dateDisplay}>
              <Text style={styles.dateText}>
                {dateOfBirth ? 
                dateOfBirth.toLocaleDateString() 
                : 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dateOfBirth || new Date()}
                mode="date"
                display='default'
                onChange={onDateChange}
                />
            )}
              {
              errors.dateOfBirth? 
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text> 
              : null
              }
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, errors.email ? styles.inputError: null]}
            />
            {
              errors.email? 
              <Text style={styles.errorText}>{errors.email}</Text> 
              : null
            }
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, errors.password ? styles.inputError: null]}
              secureTextEntry
            />
            {
              errors.password? 
              <Text style={styles.errorText}>{errors.password}</Text> 
              : null
            }
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[styles.input, errors.confirmPassword ? styles.inputError: null]}
              secureTextEntry
            />
            {
              errors.confirmPassword? 
              <Text style={styles.errorText}>{errors.confirmPassword}</Text> 
              : null
            }
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Género</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={[styles.picker, errors.gender ? styles.inputError : null]}
                >
                  <Picker.Item label="Seleccionar género" value="" />
                  <Picker.Item label="Masculino" value="male" />
                  <Picker.Item label="Femenino" value="female" />
                  <Picker.Item label="Otro" value="other" />
                </Picker>
              </View>
              {
              errors.gender? 
              <Text style={styles.errorText}>{errors.gender}</Text> 
              : null
              }
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Condiciones Actuales</Text>
              <TextInput
                value={currentConditions}
                style={styles.textArea}
                editable={false}
                multiline
            />  
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Historial Médico</Text>
              <TextInput
                value={medicalHistory}
                style={styles.textArea}
                editable={false}
                multiline
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sintomatología</Text>
            {symptoms.length > 0 ? (
              <FlatList
                data={symptoms}
                renderItem={renderItem}
                keyExtractor={(item) => item}
              />
            ): (
              <Text style={styles.emptyText}>No hay síntomas registrados.</Text>
            )}
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Plan Terapéutico</Text>
              {therapeuticPlans.length > 0 ? (
              <FlatList
                data={therapeuticPlans}
                renderItem={renderItem}
                keyExtractor={(item) => item}
              />
            ): (
              <Text style={styles.emptyText}>No hay plan de terapéutico registrado.</Text>
            )}
          </View>
  
          <Pressable style={styles.button} onPress={handleUdpateProfile}>
            <Text style={styles.textButton}>Actualizar</Text>
          </Pressable>
  
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingTop: 20,
      // paddingBottom: 20,
    },
     input: {
      width: '100%',
      padding: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: '#ECECF3',
      backgroundColor: '#ECECF3',
      borderRadius: 5,
    },
    label: {
      alignSelf: 'flex-start',
      color: '#333',
      marginVertical: 10,
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 3,
    },
    textArea: {
      width: '100%',
      padding: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: '#ECECF3',
      borderRadius: 5,
      minHeight: 80,
      textAlignVertical: 'top',
      backgroundColor: '#ECECF3',
    },
    listItem: {
      alignSelf: 'flex-start',
      fontSize: 14,
      color: '#333333',
      marginBottom: 5,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 50,
      elevation: 3,
      backgroundColor: '#36AEBE',
      marginTop: 30,
      width: '60%',
      alignSelf: 'center',
      marginBottom: 70,
    },
    textButton: {
      fontSize: 18,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#cccccc',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatarText: {
      color: '#ffffff',
      fontSize: 16,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ECECF3',
      borderRadius: 5,
      backgroundColor: '#ECECF3',
      marginBottom: 10,
    },
    picker: {
      width: '100%',
      borderColor: '#ECECF3',
      backgroundColor: '#ECECF3',
      borderRadius: 5,
    },
    inputError: {
      borderColor: '#FF0000',
    },
    errorText:{
      color: '#FF0000',
      marginBottom: 10,
      textAlign: 'left',
    },
    inputContainer: {
      marginBottom: 10
    },
    emptyText: {
      fontSize: 16,
      fontStyle: 'italic',
      color: '#888',
      marginVertical: 5,
    },
    dateDisplay: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
      borderColor: '#ECECF3',
      backgroundColor: '#ECECF3',
    },
    dateText: {
      fontSize: 14,
      color: '#333',
    },
  });