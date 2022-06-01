export default {
	name: 'Render',
	functional: true,
	inheritAttrs: false,
	props: {
		render: Function,
		data: Object,
	},
	render(h, { props }) {
		const { data, render } = props;
		return render(h, {
			data,
		});
	},
};
