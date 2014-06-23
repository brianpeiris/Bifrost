/* globals WebSocket, console */
"use strict";

var Treadmill = function(url) {
	var self = this;

	self.initialize = function() {
		self.url = url;
		self.ws = new WebSocket(url);
		self.ws.onmessage = self.onMessage;
		self.ws.onopen = self.onOpen;
		self.ws.onclose = self.onClose;
        /**
         * @property {Number} distance Distance travelled in cm.
         */
		self.distance = 0.0;
	};

	self.onMessage = function(e) {
		self.distance = parseInt(e.data, 10);
	};

	self.onOpen = function() {
		console.log("Treadmill socket connected.");
	};

	self.onClose = function() {
		console.log("Treadmill socket disconnected.");
	};

	self.initialize();
};
