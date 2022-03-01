
**App Inventor** - Ionic 5 project (Work in progress),
Previously called as **app-builder-frontend**

Installation on local machine :

 - `brew install node`/ (`sudo apt-get install nodejs`, `sudo apt-get install npm`) (`NPM 6.14.4` and `Node v14.0.0`)
 - `npm install ionic cordova -g` (`ionic@5.4.16` and `cordova@9.0.0`)
 - Follow the installation https://github.com/EddyVerbruggen/cordova-plugin-googleplus for google-plus plugin used for `OAuth`
 - If your `REVERSE_CLIENT_ID` does not reflect in `info.plist`, add :

```
<dict>
	<key>CFBundleURLName</key>
	<string>REVERSED_CLIENT_ID</string>
	<key>CFBundleURLSchemes</key>
	<array>
		<string>com.googleusercontent.apps.xxxxxxx</string>
	</array>
</dict>
 ```

- To test the app, you can use `capacitator` : https://capacitor.ionicframework.com/docs/getting-started/with-ionic/
- To start the app, run `ionic build`, `ionic capacitor run <platform> --livereload` or `ionic lab` or `ionic serve -l`, note that native features cannot be tested in browser.

**Backend for app-inventor**

- https://github.com/addu390/app-inventor-backend.
- Django web framework, MySQL database.


**Application screens**: Check out: https://thenextbigproject.com/app-inventor-an-application-to-build-one/


#### What's cooking?

- Support for MySQL and Elastic Search queries.
- Enter Connection details (TCP/IP, SSH or Socket) for database connection and add placeholders in queries.

