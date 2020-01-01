import { h, Component } from "preact";
import firebase from "firebase/app";

export class Weather extends Component {
  render({ data }) {
    if (!data) {
      return null;
    }

    const date = new Date(data.lastTime);

    return (
      <div>
        <strong>Последно съобщение в {date.toLocaleString()}:</strong>
        <br />
        <br />
        {data.message}
      </div>
    );
  }
}

export default Weather;
