self.addEventListener('messenger', function(msg) {
	var data = msg.data;
	self.postMessage(null);
});

