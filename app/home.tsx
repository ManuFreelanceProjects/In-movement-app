import { inMovementDb } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Linking, Alert } from "react-native";
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';


interface VideoItem {
    uid: string;
    title: string;
    description: string;
    url: string;
    createdAt: Date;
    modifiedAt: Date;
    enabled: boolean;
    symptoms: string[];
    thumbnail: string;
  }
  
  interface User {
    uid: string;
    firstName: string;
    secondName: string;
    email: any;
    createdAt: Date;
    enabled: string;
    avatarUrl: string;
    dateOfBirth: number;
  }
  
  export default function HomeScreen({ navigation }: { navigation: any }) {

    const [userData, setUserData] = useState<User | null>(null);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [favoriteVideos, setFavoriteVideos] = useState<string[]>([]);
    const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>(videos);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    useEffect(() => {
      const fetchUserData = async () => {
        if (currentUser) {
          const patientQuery = query(
            collection(inMovementDb, 'patients'),
            where('uid', '==', currentUser.uid));
  
          // const patientDoc = await getDoc(doc(inMovementDb, 'patients', 'zUEbvuGqEbrYoclGImL3'));
          const patientQuerySnapshot = await getDocs(patientQuery);
          const users = patientQuerySnapshot.docs.map((doc) => {
            const userData = doc.data();
            const birthTimestamp = userData.dateOfBirth;
            const birthDate = birthTimestamp ? new Date(birthTimestamp.seconds * 1000): null;
              
            return {
                uid: doc.data().uid,
                firstName: userData.firstName || userData.email?.split('@')[0],
                secondName: userData.secondName,
                email: userData.email,
                createdAt: userData.createdAt,
                enabled: userData.enabled,
                avatarUrl: userData.avatarUrl,
                dateOfBirth: birthDate ? moment().diff(birthDate, 'years') : 0,
            };
          });
  
          const videosCollection = collection(inMovementDb, 'videos');
          const querySnapshot = await getDocs(videosCollection);
          const videosList = querySnapshot.docs.map((doc) => ({
            uid: doc.data().uid,
            title: doc.data().title,
            description: doc.data().description,
            url: doc.data().url,
            createdAt: doc.data().createdAt,
            modifiedAt: doc.data().modifiedAt,
            enabled: doc.data().enabled,
            symptoms: doc.data().symptoms,
            thumbnail: doc.data().thumbnail,
          }));
  
          setVideos(videosList);
          setUserData(users[0]);
        } else {
          console.log('No user signed in!');
        }
        setLoading(false);
      };
      fetchUserData();
    },[]);
  
    
    const openFilter = () => {
      setFilterVisible(true);
    };
  
    const closeFilter = () => {
      setFilterVisible(false);
    };
  
    const handleSearch = (text: string) => {
      setSearchText(text);
      const results = videos.filter(video =>
        video.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredVideos(results);
    };
  
    const toggleFavorite = (id: string) => {
      setFavoriteVideos((prevFavorites) =>
        prevFavorites.includes(id)
          ? prevFavorites.filter((favId) => favId !== id)
          : [...prevFavorites, id]
      );
    };
  
    const handleVideoClick = async (url: string) => {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open the video link');
        }
      } catch (error) {
        console.error('Error opening URL:', error);
        Alert.alert('Error', 'An unexpected error occurred while trying to open the video');
      }
    };
  
    const renderVideoItem = ({ item }: {item: VideoItem}) => (
      <View style={styles.videoItem}>
        <TouchableOpacity onPress={() => handleVideoClick(item.url)}>
        <Image source=
          {require('../assets/images/play.png')} style={styles.thumbnail} />
          </TouchableOpacity>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.uid)}>
            <MaterialIcons
              name={favoriteVideos.includes(item.uid) ? "favorite" : "favorite-border"}
              size={24}
              color={favoriteVideos.includes(item.uid) ? "#CD84EF" : "#666"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
    
  
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }
    
    return (
      <View style={styles.container}>
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/logo-horizontal.png')} style={styles.logo} />
        </View>
  
        {/* Header Section with User Info */}
        <View style={styles.header}>
          <View style={styles.userInfoContainer}>
            <Image source={
              userData?.avatarUrl ? userData.avatarUrl : require('../assets/images/avatar.png')
            } style={styles.avatar} />
            <View style={styles.userDetails}>
            <Text style={styles.userAge}>Hola</Text>
              <Text style={styles.userName}>{userData?.firstName || null} {userData?.secondName || null}</Text>
              <Text style={styles.userAge}>
                {userData?.dateOfBirth ? `${userData.dateOfBirth} años` : `${0} años`}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
                <Text style={styles.updateLink}>Ver mi perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                <Text style={styles.updateLink}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
  
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#A94DC7" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar videos..."
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={openFilter}>
            <MaterialIcons name="filter-alt" size={24} color="#ffffff" />
          </TouchableOpacity>
          </View>
  
        {/* Rest of the content for the Videos screen */}
        <FlatList
          data={videos}
          keyExtractor={(item) => item.uid}
          renderItem={renderVideoItem}
          contentContainerStyle={styles.videoList}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    logoContainer: {
      backgroundColor: '#ffffff', // White background for the logo area
      padding: 20,
      alignItems: 'flex-start',
      marginTop: 40,
    },
    logo: {
      width: 200,
      height: 40,
    },
    header: {
      backgroundColor: '#A94DC7', // Background color for user info section
      paddingVertical: 20,
    },
    userInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 15,
    },
    userDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
    },
    userAge: {
      fontSize: 14,
      color: '#fff',
    },
    updateLink: {
      color: '#fff',
      textDecorationLine: 'underline',
      marginTop: 5,
    },
    searchContainer: {
      flexDirection: 'row',
      padding: 20,
      alignItems: 'center',
    },
    searchBar: {
      flexDirection: 'row',
      flex: 1,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      alignItems: 'center',
      paddingHorizontal: 10,
      marginRight: 10,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      fontSize: 16,
      backgroundColor: '#ECECF3',
    },
    filterButton: {
      backgroundColor: '#9728BD',
      padding: 10,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    content: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    videoList: {
      paddingHorizontal: 20,
    },
    videoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginVertical: 5,
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
    },
    thumbnail: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 15,
    },
    videoInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    videoTitle: {
      fontSize: 16,
      color: '#333',
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });