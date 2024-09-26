import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Image, Animated, Easing } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import LoginScreen from './screens/loginScreen';
import HomeScreen from './screens/homeScreen';
import SignUp from './screens/SignUp';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyCourse from './screens/MyCourse';
import LeaderBoard from './screens/LeaderBoard';
import { auth } from './firebase';
import ProfileScreen from './screens/ProfileScreen';
import { Foundation, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import TopicList from './components/Courses/TopicList';
import { enableScreens } from 'react-native-screens';
import LessonList from './components/Courses/LessonList';
import TodoScreen from './components/Profile/ToDoScreen';
import registerNNPushToken from 'native-notify';

export default function App() {
  // Register push notifications
  registerNNPushToken(22997, 'YZ7If3fpYWiMaGCU7EKpBW');
  
  const [fontsLoaded] = useFonts({
    Nunito: require("./assets/fonts/Nunito-Regular.ttf"),
    //got an error here need to download the font
    NunitoMedium: require("./assets/fonts/Nunito-Medium.ttf"),
    "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
    PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
    PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),
    PoppinsExtraBold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
  });

  const [isAppReady, setAppReady] = useState(false);

  // Animated value for scaling the logo
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Pre-load your app resources here if needed
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isAppReady && fontsLoaded) {
      SplashScreen.hideAsync();
      animateLogo();
    }
  }, [isAppReady, fontsLoaded]);

  const animateLogo = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.5,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  enableScreens();

  const Home = () => (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: '#D0AA66',
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Foundation name="home" size={24} color={focused ? '#002D5D' : 'grey'} />
          ),
        }}
      />
      <Tab.Screen
        name="MyCourse"
        component={CoursesNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome5 name="book-open" size={20} color={focused ? '#002D5D' : 'grey'} />
          ),
        }}
      />
      <Tab.Screen
        name="LeaderBoard"
        component={LeaderBoard}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons name="leaderboard" size={24} color={focused ? '#002D5D' : 'grey'} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="user" size={24} color={focused ? '#002D5D' : 'grey'} />
          ),
        }}
      />
    </Tab.Navigator>
  );

  const CoursesNavigator = () => (
    <Stack.Navigator>
      <Stack.Screen name="Courses" component={MyCourse} options={{ headerShown: false }} />
      <Stack.Screen name="TopicList" component={TopicList} />
      <Stack.Screen name="LessonList" component={LessonList} />
    </Stack.Navigator>
  );

  const HomeNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );

  const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Homer" component={Home} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );

  const ProfileNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Todo" component={TodoScreen} />
    </Stack.Navigator>
  );

  const [user, setUser] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!isAppReady || !fontsLoaded) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Image
          source={require('./assets/images/logo.png')}
          style={[styles.logo, { transform: [{ scale: scaleValue }] }]}
        />
      </View>
    ); 
  }

  return (
    <NavigationContainer>
      {user ? <Home /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
});
