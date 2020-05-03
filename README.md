
**App builder** - Ionic 5 project (Work in progress)

Installation on local machine :

 - `brew install node`/ (`sudo apt-get install nodejs`, `sudo apt-get install npm`) (`NPM 6.14.4` and `Node v14.0.0`)
 - `npm install ionic cordova -g` (`ionic@5.4.16` and `cordova@9.0.0`)
 - Follow the installation https://github.com/EddyVerbruggen/cordova-plugin-googleplus for google-plus plugin used for `OAuth`
 - If your `REVERSE_CLIENT_ID` does not reflect in `info.plist`, add :
```<dict>
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

**Backend for app-builder**
- https://github.com/addu390/app-builder-backend.
- Django web framework, MySQL database.


**Application screens**

1. **Google OAuth Sign-in/ Sign-up.**
- First screen after installing the application (User sign-in with Google OAuth).
- Key features: auto login & logout, token refresh on expiry.

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/1_login.png?raw=true" width="300"/>


2. **Account selection (Google OAuth)**
- Google no longer allows OAuth requests via embedded browsers.
- Plugin used for Google Oauth : https://github.com/EddyVerbruggen/cordova-plugin-googleplus

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/2_account_selection.png?raw=true" width="300"/>

3. **Login screen (After sign-in)**
- googlePlus.login() response contains `displayName` and `imageUrl`.

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/3_user_details.png?raw=true" width="300"/>

4. **Side menu has two options**
- To navigate to login screen and view list of applications.

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/4_side_bar.png?raw=true" width="300"/>

5. **Create application**
- An application is a group of input components (`TEXT_AREA`, `RADIO` etc) and actions (`SUBMIT_BUTTON` - API Call).

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/5_create_application.png?raw=true" width="300"/>

6. **Application screen**
- Application screen actions : Create/ edit/ delete component, re-arrange components
- Toggle between edit and view mode
- Below is the screen after creating the application (No components added yet).

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/6_application.png?raw=true" width="300"/>

7. **Add component**
- Component refers to the UI input components and actions, select the type of component to be added.

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/7_add_component.png?raw=true" width="300"/>

8. **Component type : Input text field**
- To demonstrate how to use the application, using `Todos` API - http://jsonplaceholder.typicode.com/,
- Where https://jsonplaceholder.typicode.com/users/ gives the list of `Todos` and https://jsonplaceholder.typicode.com/todos/1 gives the detail of the `Todo`.
- Note : The `unique identifier` is a mandatory field for a component and used in `actions`.

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/8_input_component.png?raw=true" width="300"/>

9. **Component type (Action): Submit button**
- Continuing the same example, the `GET` API here is https://jsonplaceholder.typicode.com/todos/todos-number,
- Where `todos-number` is the unique identifier of the above `Input text field`,
- Hence the `todos-number` in the `GET` API will be replaced with the value of `Input text field`.

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/9_submit_component.png?raw=true" width="300"/>

10. **The application view**
- Enter the `Todo` number and hot on the `Submit` button.

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/11_final_application.png?raw=true" width="300"/>

11. **API Response**
- At the moment, the response JSON is directly shown in an alert pop-up.
- WIP : A new `Response` component to configure how the output is to be shown.

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/12_response.png?raw=true" width="300"/>

12. **Edit/ delete components**
- As mentioned earlier, components can be edited/ deleted as well, swipe the component to the right to get these options.

<img src="https://pyblog.xyz/wp-content/uploads/2020/05/10_edit_components.png?raw=true" width="300"/>

