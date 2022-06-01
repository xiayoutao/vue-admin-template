import { Message } from 'element-ui';
import { isObject } from 'lodash';

export function showMsg(options) {
	Message.closeAll();
	return Message(options);
}

showMsg.closeAll = Message.closeAll;

['success', 'warning', 'info', 'error'].forEach((type) => {
	showMsg[type] = (options) => {
		Message.closeAll();
		if (isObject(options)) {
			return Message({
				type,
				...options,
			});
		}
		return Message({
			type,
			message: options,
		});
	};
});
