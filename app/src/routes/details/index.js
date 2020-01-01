import { h, Component } from "preact";
import firebase from "firebase/app";
const db = firebase.firestore();
import Air from "./air";
import Weather from "./weather";

export class Details extends Component {
  constructor() {
    super();
    this.state = {
      lastData: null
    };
  }

  componentDidMount() {
    db.collection(`alerts`)
      .where("type", "==", this.props.type)
      .orderBy("lastTime", "desc")
      .limit(1)
      .get()
      .then(snapshot => {
        const data = [];
        snapshot.forEach(doc => {
          data.push(doc.data());
        });
        if (data.length) {
          this.setState({
            lastData: data[0]
          });
        }
      });
  }

  render({ type }, { lastData }) {
    let component = null;

    switch (type) {
      case "air":
        component = <Air data={lastData} />;
        break;
      case "weather":
        component = <Weather data={lastData} />;
        break;

      default:
        break;
    }

    return <div class="page">{component}</div>;
  }
}

export default Details;
