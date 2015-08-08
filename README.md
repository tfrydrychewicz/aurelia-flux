# aurelia-flux
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Circle CI](https://circleci.com/gh/tfrydrychewicz/aurelia-flux.svg?&style=shield&circle-token=072ff96bc8a1c1b3bc23cd72c0c39639e5531bdb)](https://circleci.com/gh/tfrydrychewicz/aurelia-flux)

A Flux plugin for [Aurelia](http://www.aurelia.io/) that supports Promises.

``` javascript
import {inject} from 'aurelia-framework';
import {Dispatcher, handle, waitFor} from 'aurelia-flux';

@inject(Dispatcher)
class MessagesStore {
	messages = [];

	constructor(dispatcher) {
		this.dispatcher = dispatcher;
	}

	@handle('message.submit')
	collect(action, message) {
		return new Promise((resolve) => {
			setTimeout(() => {
				this.messages.push(message);
				this.dispatcher.dispatch('message.submitted', message);
				resolve();
			}, 1000);
		});
	}

	getMessages() {
		return this.messages;
	}
}

@inject(Dispatcher, MessagesStore)
export class Welcome {

	message = "Hello Aurelia!";

	constructor(dispatcher, store) {
		this.dispatcher = dispatcher;
		this.store = store;

		this.dispatcher.handle('message.submitted', (action, message) => {
			alert(message);
		});
	}

	submit() {
		this.dispatcher.dispatch('message.submit', this.message);
	}

	@handle('message.*')
	@waitFor(MessagesStore)
	logMessage(action, message) {
		console.log(event, message);
	}
}
```
## Articles

* [Creating Reactive, Loosely Coupled Apps with Aurelia and Flux - Episode 1](http://blog.durandal.io/2015/07/23/creating-reactive-loosely-coupled-apps-with-aurelia-and-flux-episode-1/)
* [Creating Reactive, Loosely Coupled Apps with Aurelia and Flux - Episode 2](http://blog.durandal.io/2015/08/07/creating-reactive-loosely-coupled-apps-with-aurelia-and-flux-episode-2/)

## Dependencies

* [aurelia-binding](https://github.com/aurelia/binding)
* [aurelia-dependency-injection](https://github.com/aurelia/dependency-injection)
* [aurelia-router](https://github.com/aurelia/router)
* [aurelia-templating](https://github.com/aurelia/templating)

## Used By

This library isn't used by [Aurelia](http://www.aurelia.io/). It is an optional plugin.

## Platform Support

This library can be used in the **browser** only.

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

	```shell
	npm install
	```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

	```shell
	npm install -g gulp
	```
4. To build the code, you can now run:

	```shell
	gulp build
	```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

	```shell
	npm install -g karma-cli
	```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

	```shell
	npm install -g jspm
	```
3. Install the client-side dependencies with jspm:

	```shell
	jspm install
	```

4. You can now run the tests with this command:

	```shell
	karma start
	```
