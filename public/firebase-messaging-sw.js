importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

self.addEventListener("fetch", () => {
  try {
    const urlParams = new URLSearchParams(location.search);
    self.firebaseConfig = Object.fromEntries(urlParams);
  } catch (err) {
    console.error("Failed to add event listener", err);
  }
});

const firebaseConfig = {
  apiKey: "AIzaSyAag1Urii6wfhCXUsAw-uBw1Tkngh477-c",
  authDomain: "doop-4ccc8.firebaseapp.com",
  projectId: "doop-4ccc8",
  storageBucket: "doop-4ccc8.firebasestorage.app",
  messagingSenderId: "867434092317",
  appId: "1:867434092317:web:bb358036bb44fd701cf3f4",
  measurementId: "G-X8B8CL9K3J",
};

firebase.initializeApp(firebaseConfig);

let messaging;
try {
  messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
} catch (err) {
  console.error("Failed to initialize Firebase Messaging", err);
}

if (messaging) {
  try {
    messaging.onBackgroundMessage((payload) => {
      console.log("Received background message: ", payload);
      const notificationTitle = payload.notification?.title;
      const notificationOptions = {
        body: payload.notification?.body,
        tag: notificationTitle,
        icon: payload.notification?.image || "",
        data: {
          url: payload?.data?.openUrl || "",
        },
      };

      if (payload?.collapseKey && payload?.notification) {
        self.registration.showNotification(
          notificationTitle,
          notificationOptions
        );
      } else {
        return new Promise(function (resolve, reject) {});
      }
    });
  } catch (err) {
    console.log(err);
  }
}
