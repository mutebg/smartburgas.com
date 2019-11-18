import { getUserID } from './user';
import firebase from 'firebase/app';

const db = firebase.firestore();
const users = db.collection('users');

export const requestPermission = () =>
	new Promise((resolve, reject) => {
		Notification.requestPermission().then(permission => {
			if (permission === 'granted') {
				resolve('granted');
			}
			else {
				reject('rejected');
			}
		});
	});

export const sendTokenToServer = token =>
	users.doc(getUserID()).set(
		{
			token
		},
		{ merge: true }
	);

export const updateTopics = (topics = []) =>
	users.doc(getUserID()).set(
		{
			topics
		},
		{ merge: true }
	);

export const getUserTopics = () =>
	users
		.doc(getUserID())
		.get()
		.then(doc => doc.data());
