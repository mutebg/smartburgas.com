export const getUserID = () => {
	const id = localStorage.getItem('userid');
	if (id) {
		return id;
	}
	else {
		const id = new Date().getTime().toString();
		localStorage.setItem('userid', id);
		return id;
	}
};
