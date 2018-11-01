
# Verizon POC
> Proof of Concept for video playlist designer app for Verizon

![Editor: Step 2](https://i.imgur.com/2RVFKLp.png)


## Table of Contents
<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Verizon POC](#verizon-poc)
	- [Table of Contents](#table-of-contents)
	- [Live Demo](#live-demo)
	- [Views](#views)
	- [User Scenario](#user-scenario)
	- [Data Structure](#data-structure)
	- [Project Architecture (Application Methods Explained)](#project-architecture-application-methods-explained)
		- [Login Component](#login-component)
			- [SignIn() method](#signin-method)
		- [SignUp Component](#signup-component)
		- [Dashboard Component](#dashboard-component)
			- [switchVideoTwo() method](#switchvideotwo-method)
			- [player1Button() method](#player1button-method)
			- [startBuilding() method](#startbuilding-method)
			- [startOver() method](#startover-method)
			- [step2Button() method](#step2button-method)
			- [step2Button() method](#step2button-method)
			- [clearPlaylist() method](#clearplaylist-method)
			- [generateUUID() method](#generateuuid-method)
		- [Playlist Component](#playlist-component)
			- [fetchData()  method](#fetchdata-method)
			- [player1Button()  method](#player1button-method)
			- [player2Button()  method](#player2button-method)
			- [preloadVideos() method](#preloadvideos-method)
			- [switchVideoTwo() method](#switchvideotwo-method)
			- [generateEmbed() method](#generateembed-method)
		- [Playlists Component](#playlists-component)
			- [deletePlaylist()  method](#deleteplaylist-method)
		- [Profile Component](#profile-component)
			- [logout()  method](#logout-method)
		- [Upload Component](#upload-component)
			- [onFileSelected(event)  method](#onfileselectedevent-method)
			- [saveVideo() method](#savevideo-method)
			- [generateUUID() method](#generateuuid-method)
		- [Video Component](#video-component)
			- [fetchData()  method](#fetchdata-method)
			- [deleteVideo() method](#deletevideo-method)
		- [Embed Component](#embed-component)
	- [Dev Notes](#dev-notes)
	- [Build Setup](#build-setup)
	- [Screenshots](#screenshots)

<!-- /TOC -->

## Live Demo
Live version deployed to firebase is available at
https://verizon-poc-c0d3f.firebaseapp.com

## Views

* Login
* Sign Up
* Dashboard
* Profile
* All user’s playlists
* Playlist
* Upload videos
* Video 
* Embed (Added 10/01)

## User Scenario

Admin logs in and is being redirected to the dashboard where she can see her previously built playlists or build a new one. She selects one of two options (personal, corporate) and is shown a list of all videos for the selected category. She presses on each video she wants to be included in the playlist, and the video block moves to a timeframe block. Once all the videos wanted for the playlist are selected, she presses create. This creates a new dynamic page with a video player assigned to play videos in the playlist right after each other.

## Data Structure

![data-structure](https://i.imgur.com/Cg7yDkq.png "Data Structure")

## Project Architecture (Application Methods Explained)

### Login Component
#### SignIn() method:
``` bash
// Passing email and password to Firebase and trying to sign in
firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        // If login successful
        (user) => {

	        // Call vuex store method to set the current user
            this.$store.dispatch('setUser')

			// Reroute to Dashboard
            this.$router.replace('dashboard')
        },
        (err) => {

            // If can not find the user, display the error message
            alert('Oops. ' + err.message)
        }
);
```
 &nbsp;

### SignUp Component
 #### SignUp() method:
 ``` bash
 // Passing email and password to Firebase and trying to sign up
 firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(

          // If registration successful
          (user) => {

			     // Reroute to Dashboard
              this.$router.replace('dashboard')
          },
          (err) => {

              // If can not create the user, display the error message
              alert('Oops. ' + err.message)
          }
);
```
 &nbsp;

### Dashboard Component
 #### addToPlaylist(video) method:
 ``` bash
document.getElementById("placeholder").style.display = "none";

// Check if the video was already added to the array
if (this.playlist.indexOf(video) > -1) {

        // If so, notify the user and do not add it again
        alert("This video has already been added.")

} else {

        // Otherwise, add the video to the playlist array
        this.playlist.push(video)

        // If video type is step3, assume it is the last video and give the user an option to finalize the playlist
        if (video.type === "step3") {

                // Display UI elements to create the playlist
                document.getElementById("create").style.display = "block";
                document.getElementById("default-link").style.display = "block";

        }
}
```
 &nbsp;

 #### switchVideoOne() method:
> This method is used to switch video after player 1 is done and preload the next video while playing video from player2 in order to achieve a seamless-style playback capability.
>
>NOTE: This method is not dry. It’s not reused in the application and only called once. Eventually, switchVideoOne(), switchVideoTwo() and preloadVideos() will be combined in order to achieve a cleaner, reusable code.
 ``` bash
// First, check if the current video index is lower than the total number of videos in the playlist

if (this.playerIndex < this.playlist.length) {

        // Switch current video index to the next one
        this.playerIndex++;
        console.log(this.playerIndex);
        var player1 = document.getElementById("play-one");

        // Hiding player1 behind the player2 by switching their Z-indexes
        player1.style.zIndex = "0";
        var player2 = document.getElementById("play-two");
        player2.style.zIndex = "1000";

        // Start playing preloaded video on player2
        player2.play();

        // Preload the next video on player1
        player1.src = this.playlist[this.playerIndex].bucketRef;
        player1.load();
}

// If it is the last video, console.log (only for debugging purposes). Get rid of it when deploying the project.
else {
        console.log("end of list");
}
```
 &nbsp;

#### switchVideoTwo() method:
> This method is similar to **switchVideoOne()** method.

 &nbsp;

#### player1Button() method:
> This method brings custom controls to the video element.
 ``` bash
var player1 = document.getElementById('play-one');
if (player1.paused == true) {

        // Play the video
        player1.play();

} else {

        // Pause the video
        player1.pause();

}
 ```
 &nbsp;

 #### player2Button() method:
>This method is similar to **player1Button()** method. They will be combined in one of the upcoming pushes to make the code DRY.

 &nbsp;

 #### formatStepName(type) method:
 >This method is used to translate video type property (passed as an argument) to a user-friendly text to display on front-end.
  ``` bash
// Passing type to the switch case construction
// Returning the name of whichever step passed
switch(type) {
        case "step1":
                return "Vision Intro"
                break;
        case "step2":
                return "Outcome"
                break;
        case "step3":
                return "Use Case"
                break;
}
 ```
 &nbsp;

  #### sortVideos(videos) method
  >This method sorts videos by type and separates them into 3 different arrays.
``` bash
this.step1Videos = videos.filter(video => video.type === "step1")
this.step2Videos = videos.filter(video => video.type === "step2")
this.step3Videos = videos.filter(video => video.type === "step3")
```
 &nbsp;
#### startBuilding() method
>This method is being called once the user presses a button to start playlist building process.
  ``` bash
 // Display only step1 type videos
this.currentStepVideos = this.step1Videos

// Hide/Show elements. Should be pretty self-explanatory.
document.getElementById("step1").style.display = "block";
document.getElementById("step-hr").style.display = "block";
document.getElementById("start-btn").style.display = "none";
document.getElementById("step2-btn").style.display = "block";
document.getElementById("startOver-btn").style.display = "block";
document.getElementById("step-hr").classList.add('yellow');

// This is a bug fix for Carousel3d components. The bug is that it does not display the videos until the user
// clicks on the Carousel element or resizes the window.
setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
}, 100)
  ```
 &nbsp;

#### startOver() method
>This method is being called once the user presses a button to restart playlist building process from the beginning.
  ``` bash
  // Set video index to 0 to play videos from the beginning once the playlist is created
this.playerIndex = 0;

// Clear the array of videos displaying in editor
this.currentStepVideos = [];

// Hide/Show elements. Should be pretty self-explanatory.
document.getElementById("video-players").style.display = "none";
document.getElementById("carousel").style.display = "block";
document.getElementById("url-box").style.display = "none";
document.getElementById("embed-box").style.display = "none";
document.getElementById("step2").style.display = "none";
document.getElementById("step3").style.display = "none";
document.getElementById("step4").style.display = "none";
document.getElementById("step1").style.display = "block";
document.getElementById("step2-btn").style.display = "block";
document.getElementById("step3-btn").style.display = "none";
document.getElementById("startOver-btn").style.display = "block";
document.getElementById("step-hr").classList.remove('green');
document.getElementById("step-hr").classList.remove('cyan');
document.getElementById("step-hr").classList.remove('orange');
document.getElementById("step-hr").classList.add('yellow');

// Call function to clear the playlist
this.clearPlaylist()

// This is a bug fix for Carousel3d components. The bug is that it does not display the videos until the user
// clicks on the Carousel element or resizes the window.
setTimeout(() => {

		  // Trigger window resize event
		  window.dispatchEvent(new Event('resize'));

		  // Start with showing only step1 videos
	    this.currentStepVideos = this.step1Videos;

}, 100)
```
&nbsp;

#### step2Button() method
>This method is being called once the user presses a button to go to step 2 of playlist creation.
  ``` bash
// Resetting array of videos currently displayed in editor
this.currentStepVideos = [];

// Hide/Show elements. Should be pretty self-explanatory.
document.getElementById("step1").style.display = "none";
document.getElementById("step2").style.display = "block";
document.getElementById("step2-btn").style.display = "none";
document.getElementById("step3-btn").style.display = "block";
document.getElementById("step-hr").classList.remove('yellow');
document.getElementById("step-hr").classList.add('green');

// This is a bug fix for Carousel3d components. The bug is that it does not display the videos until the user
// clicks on the Carousel element or resizes the window.
setTimeout(() => {

		  // Trigger window resize event
	    window.dispatchEvent(new Event('resize'));

		  // Show step2 videos in editor
        this.currentStepVideos = this.step2Videos;

}, 100)
```
&nbsp;

#### step2Button() method
>This method is being called once the user presses a button to go to step 3 of playlist creation. Similar to step1Button() method.

&nbsp;

#### clearPlaylist() method
 ``` bash
// Clear the playlist array
this.playlist = []

// Hide/Show elements. Should be pretty self-explanatory.
document.getElementById("create").style.display = "none";
document.getElementById("placeholder").style.display = "block";
document.getElementById("default-link").style.display = "none";
 ```
 &nbsp;

 #### createPlaylist() method
>This method is called once the user presses Create Playlist button.
>
>NOTE: This method is not dry. A lot of the functionality can be split into smaller reusable methods and will be done in future releases.
 ``` bash
// Map this to a new variable because this isnt accessible in a function body
var self = this;

// Generate a Slug and store it in a variable for reference
var slug = this.generateUUID();

// Save playlist as a Firestore object
db.collection('playlists').add({
	    name: this.playlistName,
	    creatorId: firebase.auth().currentUser.uid,
	    videos: this.playlist,
	    uploadDate: new Date(),
	    slug: slug
})

// Once the object is saved
.then(function (docRef) {
	    console.log('Document written with ID: ', docRef.id)

	    // Generate link to the playlist using slug
	    let playlistUrl = 'http://' + window.location.host + '/#/' + slug;

	    // Generate HTML code for an iFrame embedding
	    let embedCode = "<iframe src='http://"+ window.location.host + '/#/embed/' + slug + "' width='600px' height='400px' style='border:none;'></iframe>";

        // Hide/Show elements. Should be pretty self-explanatory.
	    document.getElementById("url-box").style.display = "block";
	    document.getElementById("embed-box").style.display = "block";
	    document.getElementById("create").style.display = "none";
	    document.getElementById("url").value = playlistUrl;
	    document.getElementById("code").value = embedCode;
	    document.getElementById("step3").style.display = "none";
	    document.getElementById("step4").style.display = "block";
	    document.getElementById("step-hr").classList.add('orange');
	    document.getElementById("carousel").style.display = "none";
	    document.getElementById("video-players").style.display = "block";

        // Uncomment the following line to reroute to playlists view after playlist creation
		   // self.$router.replace('playlists')

        // Preload videos and play the first one
		   var player1 = document.getElementById('play-one');
		   var player2 = document.getElementById('play-two');
        player1.src = self.playlist[self.playerIndex].bucketRef;
		   self.playerIndex++;
	    player2.src = self.playlist[self.playerIndex].bucketRef;
		   player1.load();
        player2.load();
	    player1.play();
})

// If there was an error saving the playlist
.catch(function (error) {

		   // console.log only for debugging
		   console.error('Error adding document: ', error)

})
 ```
 &nbsp;

#### generateUUID() method
> This method generates a random slug that will be used to create a url  and a reference to the playlist object. This method can be rewritten with any different approach to slug creation.
> &nbsp;
>![data-structure](https://www.w3resource.com/w3r_images/javascript-math-exercise-23.png)
 ``` bash
// Start by gettin the current date
let d = new Date().getTime()

// Define a string format and use regex to randomize
let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,

function (c) {
		   // Use Math.random() to randomize the characters
		   let r = (d + Math.random() * 16) % 16 | 0
		   d = Math.floor(d / 16)
		   return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
})

return uuid

 ```
 &nbsp;
### Playlist Component
#### fetchData()  method:
> This method is used to query playlist data from Google Firestore using the playlist slug.
 ``` bash
// Query database to return the current playlist using the slug
// this.$route.params.playlist returns the slug by getting it from router params.
db.collection('playlists').where('slug', '==', this.$route.params.playlist).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
	          console.log(doc.id, ' => ', doc.data())
			
			  // Save data retrieved from Firestore to the components' variables
	          this.id = doc.id
	          this.name = doc.data().name
	          this.creatorId = doc.data().creatorId
	          this.uploadDate = doc.data().uploadDate
	          this.videos = doc.data().videos
	          this.success = this.$route.params.success
        })
})
 ``` 
 &nbsp;
 
#### player1Button()  method:
> This method brings custom controls to the video element.
 ``` bash
var player1 = document.getElementById('play-one');
var player1Button = document.getElementById("player1-button");
if (player1.paused == true) {
			 // Play the video
			 player1.play();
			 // Update the button text to 'Pause'
			 player1Button.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
} else {
			 // Pause the video
			 player1.pause();
			 // Update the button text to 'Play'
			 player1Button.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
}
 ```
 &nbsp;
 
#### player2Button()  method:
>This method is similar to **player1Button()** method. They will be combined in one of the upcoming pushes to make the code DRY.

&nbsp;

#### preloadVideos() method:
> This method is used to achieve seamless video stitching using 2 players by preloading videos on each of the player upon loading the view.
> 
> NOTE: This method is not dry. It's not reused in the application and only called once. Eventually, switchVideoOne(), switchVideoTwo() and preloadVideos() will be combined in order to achieve a cleaner, reusable code.
> 
 ``` bash
// Remapping this to self, so we can access this object inside the function 
 var self = this;
 setTimeout(function() {
 
			   // console.log only while debugging
			   console.log('preloading');
			   console.log(self.playerIndex);
			   console.log(self.videos);
				
			   // Storing both video players in variables
			   var player1 = document.getElementById('play-one');
			   var player2 = document.getElementById('play-two');
				
			   // Preloading videos, starting to play the first one.
			   player1.src = self.videos[self.playerIndex];
			   self.playerIndex++;
			   player2.src = self.videos[self.playerIndex];
			   player1.load();
			   player2.load();
			   player1.play();
 }, 1000);
 ``` 
 &nbsp;
 
 #### switchVideoOne() method:
> This method is used to switch video after player 1 is done and preload the next video while playing video from player2 in order to achieve a seamless-style playback capability.
> 
> NOTE: This method is not dry. It’s not reused in the application and only called once. Eventually, switchVideoOne(), switchVideoTwo() and preloadVideos() will be combined in order to achieve a cleaner, reusable code.
 ``` bash
// First, check if the current video index is lower than the total number of videos in the playlist

if (this.playerIndex < this.playlist.length) {

        // Switch current video index to the next one
        this.playerIndex++;
        console.log(this.playerIndex);
        var player1 = document.getElementById("play-one");

        // Hiding player1 behind the player2 by switching their Z-indexes
        player1.style.zIndex = "0";
        var player2 = document.getElementById("play-two");
        player2.style.zIndex = "1000";

        // Start playing preloaded video on player2
        player2.play();

        // Preload the next video on player1
        player1.src = this.playlist[this.playerIndex].bucketRef;
        player1.load();
}

// If it is the last video, console.log (only for debugging purposes). Get rid of it when deploying the project.
else {
        console.log("end of list");
}
```
 &nbsp;

#### switchVideoTwo() method:
> This method is similar to **switchVideoOne()** method.

 &nbsp;

#### generateEmbed() method:
> This method generates code to embed the video with an iframe. It's triggered when the user presses Generate embed button.
 ``` bash
 // window.location.host provides the current domain address
 // this.$route.params.playlist returns a slug for the particular playlist from the route params
 let embedCode = "<iframe src='http://"+ window.location.host + '/#/embed/' + this.$route.params.playlist + "' width='600px' height='400px' style='border:none;'></iframe>";

// Hide Embed button, display the box with embed code
 document.getElementById("embedBtn").style.display = "none";
 document.getElementById("url-box").style.display = "block";
 document.getElementById("code").value = embedCode;
 ``` 
  &nbsp;
  
### Playlists Component
#### deletePlaylist()  method:
> This method is triggered when the user clicks on Delete button.
 ``` bash
// Remapping this to self, so we can access this object inside the function
var self = this

// Query the playlist from the Firestore using the id and call Firestore delete method
db.collection('playlists').doc(playlist.id).delete().then(function () {
			console.log('playlist deleted')

			// Reroute the user to Dashboard view
			self.$router.replace('dashboard')
})
// Throw an error if the call failed
.catch(function (error) {
		    console.error('Error deleting the playlist: ', error)
})
 ``` 
  &nbsp;
  
### Profile Component
#### logout()  method:
> This method is triggered when the user clicks on logout button to sign out from her account.
 ``` bash
 // Call firebase own signOut method 
firebase.auth().signOut().then(() => {

		     // Update user data in vuex Store
          this.$store.dispatch('setUser')
          
          // Reroute user to login screen
          this.$router.replace('login')
})
 ``` 
  &nbsp;

### Upload Component
#### onFileSelected(event)  method:
> This method is triggered when the user selects a file to upload.
> 
> NOTE: This is not an ideal way of handling the uploads because it takes a few seconds for the reference to the storage object to be returned, and if the user clicks on Submit button too quickly there is a chance the reference won't be saved in Firestore. This will be fixed in future releases.
 ``` bash
// Remapping this to self, so we can access this object inside the function
var self = this;
var storage = firebase.storage();

// Get file 
var file = event.target.files[0];
console.log(file);

// Create storage ref
var storageRef = firebase.storage().ref('videos/' + file.name);

// Put request to upload file to firebase storage
storageRef.put(file).then(function(snapshot) {
		  console.log('Successfully uploaded to storage!');
  
		  //Get URL and store it for creating reference with Firestore
		  storageRef.getDownloadURL().then(function(result){
			      self.bucketRef = result;
			      console.log("bucketRef: " + self.bucketRef);
		  });
  
})
 ``` 
  &nbsp;

#### saveVideo() method:
> This method stores reference to the video file in Firestore database
> 
 ``` bash
 // Remapping this to self, so we can access this object inside the function
var self = this;

// Creating an object in Firestore video collection
db.collection('videos').add({
	     name: this.name,
	     type: this.type,
	     bucketRef: this.bucketRef,
	     uploadDate: new Date(),
	     slug: this.generateUUID(),
	     creatorId: firebase.auth().currentUser.uid
})
.then(function (docRef) {
	     console.log('Document written with ID: ', docRef.id)
		    // Reroute user to dashboard
	     self.$router.replace('dashboard')
})
.catch(function (error) {
         console.error('Error adding document: ', error)
})
  ```
 &nbsp;
 
  
#### generateUUID() method
> This method generates a random slug that will be used to create a url  and a reference to the playlist object. This method can be rewritten with any different approach to slug creation.
> &nbsp;
>![data-structure](https://www.w3resource.com/w3r_images/javascript-math-exercise-23.png)
 ``` bash
// Start by gettin the current date
let d = new Date().getTime()    

// Define a string format and use regex to randomize
let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,

function (c) {
		   // Use Math.random() to randomize the characters
		   let r = (d + Math.random() * 16) % 16 | 0
		   d = Math.floor(d / 16)
		   return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
})

return uuid

 ```
 &nbsp;
 
### Video Component
#### fetchData()  method:
> This method is used to query data for the video file by using the video slug

 ``` bash
// Query video from Firestore using the video slug found in router params
db.collection('videos').where('slug', '==', this.$route.params.id).get().then((querySnapshot) => {
		   querySnapshot.forEach((doc) => {
				    // Save data from Firestore to components variables
				    console.log(doc.id, ' => ', doc.data())
				    this.id = doc.id
				    this.name = doc.data().name
				    this.type = doc.data().type
				    this.uploadDate = doc.data().uploadDate
				    this.bucketRef = doc.data().bucketRef
				    this.success = this.$route.params.success
		   })
})		   
``` 
 &nbsp;

#### deleteVideo() method:

 ``` bash
 // Remapping this to self, so we can access this object inside the function
var self = this
db.collection('videos').doc(this.id).delete().then(function () {
			  console.log('Video deleted')
			  
			  //Router is not working for some reason. Needs to be fixed
			  //self.$router.replace('dashboard')
})
.catch(function (error) {
			  console.error('Error deleting the video: ', error)
})
 ```
 &nbsp;

### Embed Component
> This component is identical to [Playlist Component](#playlist-component) except for the styling. The video elements scale to take the 100% of the screen width to achieve scalable embeddable view.

 &nbsp;
## Dev Notes

**09/10/2018** - For the simplicity of the demo app, I'm leaving Firebase configuration in main.js file, but on the real production app, we'll need to have a separate config file.

**09/17/2018** - Add functionality to upload videos to storage. Create reference to the storage object and store in Firestore. Add option to delete video objects. Still need to delete actual videos from the storage simultaneously.

**09/22/2018** - Move Firebase configuration to a separate firebaseConfig file.

**09/28/2018** - Fix styling/positioning issues.

**10/01/2018** - Add functionality to embed videos with iframe. Embed code is being generated on dashboard when creating a playlist as well as on the playlist page. Add user roles and state management with Vuex. Block functionality to embed videos from non-admin users. Allow unauthorized users to view playlist and embeds. Hide menu from unauthorized users.


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Screenshots

![Editor: Step 1](https://i.imgur.com/MuWL2fF.png)

![Editor: Step 2](https://i.imgur.com/2RVFKLp.png)

![Editor: Step 3](https://i.imgur.com/9wmnMlQ.png)

![Editor: Last step](https://i.imgur.com/1aNAXlq.png)

![Video upload screen](https://i.imgur.com/jl4VnoV.png)

![Profile screen](https://i.imgur.com/Z8N1QPe.png)

![All playlists: Admin view](https://i.imgur.com/SdL9u3I.png)

![Playlist preview: Admin view](https://i.imgur.com/es1MzBf.png)

![Unauthorized user view](https://i.imgur.com/4KZvaZB.png)

