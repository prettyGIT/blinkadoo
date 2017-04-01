import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyCqBfQM0RaZe-Yc5wM5SEdYPMYbG3HC9zQ",
  authDomain: "blinkadoo-96ad5.firebaseapp.com",
  databaseURL: "https://blinkadoo-96ad5.firebaseio.com",
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth

export const BLINK_NUMBER = 10