import { h, Component } from "preact";

export class Air extends Component {
  render() {
    return (
      <div>
        <iframe
          className="air-iframe"
          src="https://maps.luftdaten.info/#12/42.4876/27.4772"
        ></iframe>
      </div>
    );
  }
}

export default Air;
