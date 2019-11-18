// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
	messagingSenderId: '736449147119'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
	console.log(
		'[firebase-messaging-sw.js] Received background message ',
		payload
	);

	const data = payload.data;
	console.log({ data });

	// Customize notification here
	const notificationTitle = data.title;
	const notificationOptions = {
		body: data.body,
		icon: '/firebase-logo.png'
	};

	return self.registration.showNotification(
		notificationTitle,
		notificationOptions
	);
});
