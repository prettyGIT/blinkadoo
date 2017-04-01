import { ref, firebaseAuth } from '../config/constants'

export function email () {
  return firebaseAuth().currentUser.email
}

export function uid() {
  return firebaseAuth().currentUser.uid
}

export function auth (email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveUser (user) {
  return ref.child(`users/${user.uid}`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}

export function googleLogin (idToken) {
    var credential = firebaseAuth.GoogleAuthProvider.credential(idToken);
    return firebaseAuth().signInWithCredential(credential)
}
