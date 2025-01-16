import { auth, inMovementDb } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Text, Alert, Linking, View, StyleSheet, TextInput, Pressable, TouchableOpacity } from "react-native";


interface User {
    uid: string;
    firstName: string;
    secondName: string;
    dateOfBirth: Date;
    email: any;
    currentCondition: string;
    medicalHistory: string;
    enabled: string;
    createdAt: Date;
    modifiedAt: Date;
    symptoms: string[];
    therapeuticPlans: string[];
  }
  
  export default function RegisterScreen({ navigation }: { navigation: any }) {
    //   const navigation = useNavigation();  
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [errors, setErrors] = useState({username: '', password: '', confirmPassword: ''});
      const [authError, setAuthError] = useState('');
      
  
      const validateFields = () => {
        let valid = true;
        const newErrors = {username: '', password: '', confirmPassword: ''};
  
        if (!username.includes('@')) {
          // setErrors({...errors, email: 'Debe ingresar un correo electrónico válido.' });
          newErrors.username = "Debe ingresar un correo electrónico";
          valid = false;
        }
  
        if (password.length < 6) {
          // setErrors({...errors, password: 'Debe ingresar una contraseña de al menos 8 caracteres.' });
          newErrors.password = "Debe ingresar una contraseña de al menos 6 caracteres";
          valid = false;
        }
  
        if (password!== confirmPassword) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
          // setErrors({...errors, confirmPassword: 'Las contraseñas no coinciden.', confirmPasswordConfirm: 'Contraseña no coincide.' });
          valid = false;
        }
  
        setErrors(newErrors);
        return valid;
      };
  
      const signInMethods = () => {
        let valid = true;
        fetchSignInMethodsForEmail(auth, username)
        .then((methods) => {
          if (methods.length > 0) {
            valid = false;
          }
        });
        return valid;
      };
      
      const handleRegister = () => {
        if (validateFields()) {
          if (signInMethods()) {
              createUserWithEmailAndPassword(auth, username, password)
              .then((userCredential) => {
                // Signed up 
                const userCreated = userCredential.user;
                console.log("User signed up successfully: ", userCreated);
                alert("El usuario se ha registrado correctamente");
                const user: User = {
                  uid: userCreated.uid,
                  firstName: userCreated.email?.split('@')[0] ?? '',
                  secondName: '',
                  dateOfBirth: new Date(),
                  email: userCreated.email,
                  currentCondition: '',
                  medicalHistory: '',
                  enabled: 'true',
                  createdAt: new Date(),
                  modifiedAt: new Date(),
                  symptoms: [],
                  therapeuticPlans: [],
                }
                saveBasicInfo(user);
                navigation.navigate('Login' as never);
                handleRestartForm();
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setAuthError(errorMessage);
                console.error(errorCode);
              });
            }
          }
        };
  
        const saveBasicInfo = async (user: User) => {
          await setDoc(doc(inMovementDb, "patients", user.uid), {
            uid: user.uid,
            firstName: user.firstName,
            secondName: user.secondName,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            currentCondition: user.currentCondition,
            medicalHistory: user.medicalHistory,
            enabled: user.enabled,
            createdAt: user.createdAt,
            modifiedAt: user.modifiedAt,
            symptoms: user.symptoms,
            therapeuticPlans: user.therapeuticPlans,
          }).catch((error) => {
            console.error("Error adding the document: ", error);
          });
        };
  
        const goToLogin = () => {
          handleRestartForm();
          navigation.navigate('Login' as never);
        };
  
        const handleRestartForm = () =>{
          setUsername('');
          setPassword('');
          setConfirmPassword('');
          setErrors({username: '', password: '', confirmPassword: '',});
          setAuthError('');
        };
  
        const openUrl = async (url: string) => {
          const supported = await Linking.canOpenURL(url);
          if (supported) {
            await Linking.openURL(url);
          } else {
            Alert.alert(`Cannot open the link: ${url}`);
          }
        }
  
  
    return (
      <View style={styles.container}>
  
        <View style={styles.header}>
          <Text style={styles.titleText}>Registrarse</Text>
        </View>
        
        <View style={styles.inputUsernameContainer}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            placeholder="Usuario"
            value={username}
            onChangeText={setUsername}
            style={[styles.input, errors.username ? styles.inputError : null]}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {
            errors.username? 
            <Text style={styles.errorText}>{errors.username}</Text> 
            : null
          }
        </View>
  
        <View style={styles.inputPasswordContainer}>
        <Text style={styles.label}>Constraseña</Text>
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, errors.password ? styles.inputError : null]}
            secureTextEntry
          />
          {
            errors.password? 
            <Text style={styles.errorText}>{errors.password}</Text> 
            : null
          }
        </View>
  
        <View style={styles.inputConfirmPasswordContainer}>
          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
            secureTextEntry
          />
          {
            errors.confirmPassword? 
            <Text style={styles.errorText}>{errors.confirmPassword}</Text> 
            : null
          }
          {/* Autentication error */}
          {
            authError? 
            <Text style={styles.authError}>{authError}</Text> 
            : null
          }
        </View>
  
        <Text style={styles.termsText}>
          Al registrarte, aceptas los{' '}
          <Text style={styles.registerLink} onPress={() => openUrl('https://example.com/terms')}>
            Términos de uso
          </Text>{' '}
          y la{' '}
          <Text style={styles.registerLink} onPress={() => openUrl('https://example.com/privacy')}>
            Pólitica de privacidad
          </Text>.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.text}>Registrame</Text>
          </Pressable>
        </View>
  
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿Tienes una cuenta? </Text>
          <TouchableOpacity onPress={goToLogin}>
            <Text style={styles.registerLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
  
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
      backgroundColor: '#ffffff',
    },
    header: {
      justifyContent: 'center',
    },
    titleText:{
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 60,
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
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 50,
      elevation: 3,
      backgroundColor: '#36AEBE',
      marginTop: 20,
      width: '60%',
    },
    text: {
      fontSize: 18,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    inputError: {
      borderColor: '#e74c3c',
    },
    errorText: {
      color: '#e74c3c',
      marginBottom: 10, 
      textAlign: 'left',
    },
    authError: {
      color: '#e74c3c',
      marginBottom: 10,
      textAlign: 'left',
    },
    inputContainer: {
      marginBottom: 16
    },
    inputUsernameContainer: {
      marginBottom: 20
    },
    inputPasswordContainer: {
      marginBottom: 20
    },
    inputConfirmPasswordContainer: {
      marginBottom: 20
    },
    label: {
      fontSize: 14,
      color: '#333',
      marginBottom: 4, // space between label and input
      textAlign: 'left',
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 25,
      justifyContent: 'center',
    },
    registerContainer: {
      flexDirection: 'row',
      marginTop: 20,
      justifyContent: 'center',
    },
    registerText: {
      color: '#000000',
    },
    registerLink: {
      color: '#0000ff',
      textDecorationLine: 'underline',
    },
    termsText: {
      fontSize: 14,
      color: '#333',
      textAlign: 'center',
      marginVertical: 16,
    },
  });
  
  