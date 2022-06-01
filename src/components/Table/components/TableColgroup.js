/**
 * 为了实现表格自定义字段显示，需要用到render
 */

export default {
	name: 'TableColgroup',
	functional: true,
	props: {
		columns: Array,
		gutter: Boolean,
	},
	render(h, { props }) {
		const { columns, gutter } = props;
		return (
			<colgroup align="center">
				{columns.map((column, index) => {
					if (column.type === 'selection') {
						return (
							<col
								key={column.prop + index}
								name={'col_' + index}
								style="width: 48px"
							/>
						);
					} else {
						return (
							<col
								key={column.prop + index}
								name={'col_' + index}
								style={{
									width:
										(column.width + '').indexOf('px') >= 0
											? column.width
											: `${column.width}px`,
								}}
							/>
						);
					}
				})}
				{gutter && <col name="col_gutter" style="width: 17px" />}
			</colgroup>
		);
	},
};
