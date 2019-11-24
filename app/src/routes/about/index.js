import { h, Component } from 'preact';

export class About extends Component {
	render() {
		return (
			<div class="page">
				Проекта е с
				<a href="https://github.com/mutebg/smartburgas.com"> отворен код</a> и
				всеки може да допренесе с идей, можете да ни пишете на
				<a href="mailto:team@smartburgas.com">team@smartburgas.com</a>
			</div>
		);
	}
}

export default About;
