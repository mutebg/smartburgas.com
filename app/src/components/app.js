import { h, Component } from "preact";
import { Router } from "preact-router";
import firebase from "firebase/app";
import "firebase/messaging";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_mLxTfin4jvHkzRw-i9NCSehci-QONR8",
  authDomain: "smartburgas-c307e.firebaseapp.com",
  databaseURL: "https://smartburgas-c307e.firebaseio.com",
  projectId: "smartburgas-c307e",
  storageBucket: "smartburgas-c307e.appspot.com",
  messagingSenderId: "736449147119",
  appId: "1:736449147119:web:82b21477d7820102466b1a",
  measurementId: "G-HNKYG7503L"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

import Header from "./header";

// Code-splitting is automated for routes
import Home from "../routes/home";
import About from "../routes/about";
import Details from "../routes/details";

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Header />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <About path="/about" />
          <Details path="/details/:type" />
        </Router>
      </div>
    );
  }
}
