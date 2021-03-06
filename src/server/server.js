// Copyright (c) 2012-2017 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
(function() {
	"use strict";

	const HttpServer = require("./http_server.js");
	const RealTimeServer = require("./real_time_server.js");
	const RealTimeLogic = require("./real_time_logic.js");

	module.exports = class Server {

		async start(contentDir, notFoundPageToServe, portNumber) {
			if (!portNumber) throw new Error("port number is required");

			this._httpServer = new HttpServer(contentDir, notFoundPageToServe);
			await this._httpServer.start(portNumber);

			// Consider Martin Grandrath's suggestions from E509 comments (different server initialization)
			// http://disq.us/p/1i1xydn  http://www.letscodejavascript.com/v3/comments/live/509

			this._realTimeServer = new RealTimeServer(this._httpServer);
			this._realTimeServer.start();

			this._realTimeLogic = new RealTimeLogic(this._realTimeServer);
			this._realTimeLogic.start();
		}

		async stop() {
			if (this._realTimeLogic === undefined) throw new Error("stop() called before server started");

			this._realTimeLogic.stop();
			await this._realTimeServer.stop();
		}

	};

}());