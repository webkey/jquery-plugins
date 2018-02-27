// добавить сообщение в консоль
FunctionConstructor.prototype.consoleInfo = function (key, suffix, param) {
	console.log('==' + this.index + '-' + key + '-' + suffix + '==', param || '');
};

// вызов

FunctionConstructor.prototype.event = function () {

	var self = this;
	self.consoleInfo('clickEscape','before');

};