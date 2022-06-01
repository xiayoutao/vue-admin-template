<script>
export default {
	props: {
		position: {
			type: Array,
			default() {
				return [];
			},
		},
		menuData: {
			type: Array,
			default() {
				return [];
			},
		},
		data: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	render() {
		const { position, menuData, data } = this;

		const canvasWrapper = document.body;
		const { x, y } = canvasWrapper.getBoundingClientRect();

		const left = position[0] - x;
		const top = position[1] - y;

		return (
			<transition name="fade">
				<div class="contextmenu" style={{ left: left + 'px', top: top + 'px' }}>
					{menuData.map((item) => {
						return (
							<span
								class={{
									disabled: this.isFunction(item.disabled)
										? item.disabled(data)
										: !!item.disabled,
								}}
								onClick={(event) => {
									event.stopPropagation();
									this.$emit('close');
									this.isFunction(item.handler) && item.handler(event, data);
								}}
							>
								{item.text}
							</span>
						);
					})}
				</div>
			</transition>
		);
	},
};
</script>
