import { isFunction } from 'lodash';
import { webapp_ws_fun_StopPreview } from '@/utils/grwebapp';

/**
 * 打印插件数据处理
 * @param {*} event 收到的消息通知
 * @param {*} callbacks 回调函数。onPrinters、onPrinterPapers、onPrintEnd、onExportEnd
 */
export function onPrinterMessage(event, callbacks) {
	const onPrinters = function (message) {
		if (isFunction(callbacks.onPrinters)) {
			callbacks.onPrinters(message);
		}
	};
	const onPrinterPapers = function (message) {
		if (isFunction(callbacks.onPrinterPapers)) {
			callbacks.onPrinterPapers(message);
		}
	};
	const onPrintEnd = async function (message) {
		if (isFunction(callbacks.onPrintEnd)) {
			await callbacks.onPrintEnd(message);
			webapp_ws_fun_StopPreview();
		}
	};
	const onExportEnd = function (message) {
		if (isFunction(callbacks.onExportEnd)) {
			callbacks.onExportEnd(message);
		}
	};

	//接收消息处理
	const message = JSON.parse(event.data);
	if (message.type == 'fun') {
		switch (message.fun) {
			case 'Printers': // 获取打印机列表
				onPrinters(message);
				break;
			case 'PrinterPapers': // 获取指定打印机张纸设置
				onPrinterPapers(message);
				break;
		}
	}

	if (message.event == 'PrintEnd') {
		// 打印结束
		onPrintEnd(message);
	} else if (message.event == 'ExportEnd') {
		// 导出结束
		onExportEnd(message);
	}
}
