import { h } from 'preact';
import './style.scss';

const Toggle = ({ disabled, onClick, checked, label, hint, icon }) => (
	<div
		class={`Toggle ${disabled && 'Toggle--disabled'} ${checked &&
			'Toggle--checked'} `}
	>
		<div class="Toggle__icon" />
		<div class="Toggle__text">
			<div class="Toggle__label">{label}</div>
			<div class="Toggle__hint">{hint}</div>
		</div>
		<button
			class="Toggle__btn"
			onClick={() => onClick(!checked)}
			disabled={disabled}
		/>
	</div>
);

export default Toggle;
