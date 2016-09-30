// Copyright (c) 2015-2016 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
/* global io:false, $:false */
(function() {
	"use strict";

	var shared = require("./__test_harness_shared.js");

	var endpoints = shared.endpoints;

	exports.PORT = shared.PORT;

	exports.waitForServerDisconnect = function waitForServerDisconnect(connection, callback) {
		ajax({
			connection: connection,
			endpoint: endpoints.WAIT_FOR_SERVER_DISCONNECT,
			async: true
		}, function(err, responseText) {
			return callback(err);
		});
	};

	exports.isConnected = function isConnected(connection) {
		var responseText = ajax({
			connection: connection,
			endpoint: endpoints.IS_CONNECTED,
			async: false
		});

		var connectedIds = JSON.parse(responseText);
		return connectedIds.indexOf(connection.getSocketId()) !== -1;
	};

	exports.waitForPointerLocation = function waitForPointerLocation(connection, callback) {
		ajax({
			connection: connection,
			endpoint: endpoints.WAIT_FOR_POINTER_LOCATION,
			async: true
		}, function(err, responseText) {
			return callback(err, JSON.parse(responseText));
		});
	};

	exports.sendPointerLocation = function sendPointerLocation(connection, event, callback) {
		ajax({
			connection: connection,
			endpoint: endpoints.SEND_POINTER_LOCATION,
			async: true,
			data: event.toSerializableObject()
		}, function(err, responseText) {
			callback();
		});
	};

	function ajax(options, callback) {
		var origin = window.location.protocol + "//" + window.location.hostname + ":" + exports.PORT;
		var request = $.ajax({
			type: "GET",
			url: origin + options.endpoint,
			data: {
				data: JSON.stringify(options.data),
				socketId: options.connection.getSocketId()
			},
			async: options.async,
			cache: false
		});

		if (options.async) {
			request.done(function() {
				if (request.status !== 200) throw new Error("Invalid status: " + request.status);
				return callback(null, request.responseText);
			});
			request.fail(function(_, errorText) {
				throw new Error(errorText);
			});
		}
		else {
			if (request.status !== 200) throw new Error("Invalid status: " + request.status);
			else return request.responseText;
		}
	}

}());