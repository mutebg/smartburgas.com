import { h, Component } from 'preact';
import firebase from 'firebase/app';

import Toggle from '../../components/toggle';
import {
	requestPermission,
	sendTokenToServer,
	updateTopics,
	getUserTopics
} from '../../utils/subs';

const topics = [
	{ key: 'weather', label: 'Време', hint: 'Съобщения при опасно време' },
	{
		key: 'air',
		label: 'Замърсяване на въздуха',
		hint: 'Съобщения когато замърсяването в градът е над допустимите стойности'
	}
];

const messaging = firebase.messaging();
// Add the public key generated from the console here.
messaging.usePublicVapidKey(
	'BN1_OZBwEndM10ji1Z6DCR0I1IbN3slAgoarP-BgFqQB_Z0X5oNS3UgPNGORwgqT-OBpJotJvZBvPkmFG6cm5ZI'
);

export class Home extends Component {
	constructor() {
		super();

		const permissionGranted = Notification.permission == 'granted';

		const topicsState = topics.reduce((prev, next) => {
			// TODO: Initial topic state maybe from DB or localStorage
			prev[next.key] = {
				checked: false,
				disabled: !permissionGranted
			};
			return prev;
		}, {});

		this.state = {
			permissionGranted,
			token: null,
			topics: topicsState
		};
	}

	componentDidMount() {
		messaging.onTokenRefresh(async () => {
			try {
				const refreshedToken = await messaging.getToken();
				sendTokenToServer(refreshedToken);
				this.setState({
					token: refreshedToken
				});
			}
			catch (e) {}
		});

		getUserTopics().then(data => {
			if (data) {
				const { topics } = this.state;
				// UPDATE INITIAL STATE
				data.topics.forEach(topic => {
					topics[topic].checked = true;
				});

				this.setState({
					topics
				});
			}
		});
	}

	handleSubscribe = (topic, checked) => {
		const { topics } = this.state;
		topics[topic] = {
			checked,
			disabled: true
		};

		this.setState({
			topics
		});

		const checkedTopics = [];
		for (const [key, value] of Object.entries(topics)) {
			if (value.checked) {
				checkedTopics.push(key);
			}
		}

		updateTopics(checkedTopics).then(() => {
			topics[topic] = {
				checked,
				disabled: false
			};

			this.setState({
				topics
			});
		});
	};

	handlePermissions = async () => {
		if (!this.state.permissionGranted) {
			try {
				// ask for permissions
				await requestPermission();

				// update UI
				this.setState({
					permissionGranted: true
				});

				// take token
				const currentToken = await messaging.getToken();

				// save token
				await sendTokenToServer(currentToken);

				const { topics } = this.state;

				// remove disabled after initial recieving of permissions
				for (const [key, value] of Object.entries(topics)) {
					topics[key].disabled = false;
				}

				this.setState({
					token: currentToken,
					topics
				});
			}
			catch (e) {
				console.log(e);
			}
		}
		else {
			// TODO: Revoke permissions
			// There is not working browser API for that
			// Just delete all user data from DB
		}
	};

	render(props, { permissionGranted }) {
		return (
			<div class="page">
				<button
					onClick={this.handlePermissions}
					class={`btn ${!permissionGranted && 'btn--primary'}`}
				>
					{!permissionGranted
						? 'Разреши изпращане на съобщения'
						: 'Откажи се от съобщения'}
				</button>

				{permissionGranted ? (
					<ul class="list">
						{topics.map(({ key, label, hint }) => (
							<li key={key}>
								<Toggle
									label={label}
									hint={hint}
									icon={key}
									onClick={value => this.handleSubscribe(key, value)}
									checked={this.state.topics[key].checked}
									disabled={this.state.topics[key].disabled}
								/>
							</li>
						))}
					</ul>
				) : (
					<p class="alert">
						За да ви изпращаме съобщения трябва да ни разрешите. Натиснете
						бутона
					</p>
				)}
			</div>
		);
	}
}

export default Home;
