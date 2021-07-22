<<<<<<< HEAD
/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 * Modified by CSDN, Auth0 new feature, Custom by Joe
 */

window.userController = {
  data: {
    auth0Lock: null,
    config: null
  },

  uiElements: {
    loginButton: null,
    logoutButton: null,
    profileButton: null,
    profileNameLabel: null,
    profileImage: null
  },

  init(config) {
    var that = this;

    {
      const { uiElements } = this;
      uiElements.loginButton = $("#auth0-login");
      uiElements.logoutButton = $("#auth0-logout");
      uiElements.profileButton = $("#user-profile");
      uiElements.profileNameLabel = $("#profilename");
      uiElements.profileImage = $("#profilepicture");
    }

    {
      const { data } = this;
      data.config = config;
      data.auth0Lock = new Auth0Lock(
        config.auth0.clientId,
        config.auth0.domain,
        {
          auth: {
            responseType: 'id_token token',
          }
        }
      ); // new Auth0Lock
    }

    {
      var accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        this.configureAuthenticatedRequests();
        this.data.auth0Lock.getProfile(accessToken, (error, profile) => {
          if (error) {
            return alert("JOEW: Auth0 error: getting a profile:" + error.message);
          }
          this.showUserAuthenticationDetails(profile);
        });
      } // fi
    } // const accesToken

    this.wireEvents();
  }, //init initializer

  // Only call when token is in localstorage
  configureAuthenticatedRequests() {
    $.ajaxSetup({
      beforeSend(xhr) {
        xhr.setRequestHeader(
          'Authorization', 
          'Bearer ' + localStorage.getItem('idToken') +' '+ localStorage.getItem('accessToken')
        );
        /*
        xhr.setRequestHeader(
          "Authorization",
          "Bearer " + localStorage.getItem("userToken")
        );
        */
      } //xhr sending
    }); //ajax
  }, //configureAuthenticatedRequest()

  // Only call when token is in localstorage
  showUserAuthenticationDetails(profile) {
    const showAuthenticationElements = !!profile;

    if (showAuthenticationElements) {
      const { profileNameLabel, profileImage } = this.uiElements;
      profileNameLabel.text(profile.nickname);
      profileImage.attr("src", profile.picture);
    }

    {
      const { loginButton, logoutButton, profileButton } = this.uiElements;
      loginButton.toggle(!showAuthenticationElements);
      logoutButton.toggle(showAuthenticationElements);
      profileButton.toggle(showAuthenticationElements);
    }
  },


  wireEvents() {
    var that = this;
    const { auth0Lock, config } = this.data;
    console.log("JOEW: auth0Lock.show being wired up event...")

    // ORG auth0Lock.on location
    auth0Lock.on("authenticated", function(authResult) {
      console.log("JOEW: auth0Lock, ON activated");
      auth0Lock.getUserInfo(authResult.accessToken, function(error, profileResult) {
        console.log("JOEW: auth0Lock.getUser:");
        if (error) {
          // Handle error
          //This should mean that if the profile failed to load, then the events should not be wired up
          return alert('JOEW: Error, There was an error getting the profile: ' + err.message);
        }
        localStorage.setItem('accessToken', authResult.accessToken);
        localStorage.setItem('idToken', authResult.idToken);
        that.configureAuthenticatedRequests();
        that.showUserAuthenticationDetails(profileResult);
        accessToken = authResult.idToken;
        profile = profileResult;
    
        // Update DOM
      }); //getUserInfo
    }); //auth0Lock.on

    /*
    auth0Lock.on("authenticated", ({ accessToken }) =>
      auth0Lock.getUserInfo(accessToken, (error, profile) => {
        auth0Lock.hide();
        if (error) return alert("Auth0 error:" + error);
  
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("accessToken", accessToken);
        this.configureAuthenticatedRequests();
        this.showUserAuthenticationDetails(profile);
      })
    );  //auth0Lock.on    
    */
  
  

    {
      const { loginButton, logoutButton, profileButton } = this.uiElements;

      loginButton.click(() => {
        
=======
var userController = {
    data: {
      auth0Lock: null,
      config: null
    },
    uiElements: {
      loginButton: null,
      logoutButton: null,
      profileButton: null,
      profileNameLabel: null,
      profileImage: null
    },
    
    init: function(config) {
      var options = {
        container: 'hiw-login-container'
      };
      var that = this;
  
      this.uiElements.loginButton = $('#auth0-login');
      this.uiElements.logoutButton = $('#auth0-logout');
      this.uiElements.profileButton = $('#user-profile');
      this.uiElements.profileNameLabel = $('#profilename');
      this.uiElements.profileImage = $('#profilepicture');
  
      this.data.config = config;
      this.data.auth0Lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain,{
        auth: {
          responseType: 'id_token token'
        }
      });
      
      this.data.auth0Lock.on("authenticated", function(authResult) {
        console.log("ON activated");
        that.data.auth0Lock.getUserInfo(authResult.accessToken, function(error, profileResult) {
          console.log("Getting profile");
          if (error) {
            // Handle error
            return alert('There was an error getting the profile: ' + err.message);//This should mean that if the profile failed to load, then the events should not be wired up
  
          }
          localStorage.setItem('accessToken', authResult.accessToken);
          localStorage.setItem('idToken', authResult.idToken);
          that.configureAuthenticatedRequests();
          that.showUserAuthenticationDetails(profileResult);
          accessToken = authResult.idToken;
          profile = profileResult;
      
          // Update DOM
        });
      });
  
  
      var accessToken = localStorage.getItem('accessToken');//Tries to get the token from local storage
      //This check to see if the user has logged in before and has a token stored in the webbrowser
      if (accessToken) {
        this.configureAuthenticatedRequests();//Only gets called if token has already been saved
        this.data.auth0Lock.getProfile(accessToken, function(err, profile) {
          if (err) {
            return alert('There was an error getting the profile: ' + err.message);//This should mean that if the profile failed to load, then the events should not be wired up
          }
          that.showUserAuthenticationDetails(profile);
        });
      }
  
      this.wireEvents();//For every page reload no matter the state, this method will be called
    },
    configureAuthenticatedRequests: function() {//Only called if token is in storage
      $.ajaxSetup({
        'beforeSend': function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('idToken') +' '+ localStorage.getItem('accessToken'));
        }
      });
    },
    showUserAuthenticationDetails: function(profile) {//Only called if token is in storage
      var showAuthenticationElements = !!profile;
  
      if (showAuthenticationElements) {
        this.uiElements.profileNameLabel.text(profile.nickname);
        this.uiElements.profileImage.attr('src', profile.picture);
      }
      //Hides the log in button and shows the logout and profile button
      this.uiElements.loginButton.toggle(!showAuthenticationElements);
      this.uiElements.logoutButton.toggle(showAuthenticationElements);
      this.uiElements.profileButton.toggle(showAuthenticationElements);
    },
    wireEvents: function() {
      var that = this;
      console.log("auth0Lock.show being wired up");
      this.uiElements.loginButton.click(function(e) {
  //LOGIN
  
>>>>>>> cd303b62df5f2f18cc1f65d05e77ef1794200bb5
        var params = {
          authParams: {
            scope: 'openid email user_metadata picture'
          }
        };
<<<<<<< HEAD
        
        that.data.auth0Lock.show( 
          /*
          {
          auth: { 
            params: { 
              scope: "openid profile", 
              responseType: 'id_token token' 
            } 
          } 
          }
          */
        ); // auth0Lock.show      
        console.log("JOEW: end step of click loginBtn")
      }); // end loginButton.click

      logoutButton.click(() => {
        //localStorage.removeItem("userToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("idToken");

        logoutButton.hide();
        profileButton.hide();
        loginButton.show();
        //auth0Lock.logout({ returnTo: "http://localhost:8100" });
        auth0Lock.logout();
      }); // end logoutButton.click

      profileButton.click(() => {
        const url = config.apiBaseUrl + "/user-profile";
        $.get(url, data => {
          console.log("JOEW: Recieved a response data, to with alert function:" + data)
          //$("#user-profile-raw-json").text(JSON.stringify(data, null, 2));
          //$("#user-profile-modal").modal();
          alert(JSON.stringify(data))
        }) //.get
      }); //end profileButton.click
    } //es6
  } //wire event
} // user controller
=======
          console.log("auth0Lock.show being called");
        that.data.auth0Lock.show();
      console.log("Clicked")
      
      //END LOGIN
      });
  
      this.uiElements.logoutButton.click(function(e) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
  
        that.uiElements.logoutButton.hide();
        that.uiElements.profileButton.hide();
        that.uiElements.loginButton.show();
      });
  
      this.uiElements.profileButton.click(function(e) {
        var url = that.data.config.apiBaseUrl + '/user-profile';
  
        $.get(url, function(data, status) {
          console.log("Recived a response");
          console.log(data);
          //$('#user-profile-raw-json').text(JSON.stringify(data, null, 2));
          //$('#user-profile-modal').modal();
          alert("ALERT DIALOG : " + JSON.stringify(data));
        })
      });
    }
  }
>>>>>>> cd303b62df5f2f18cc1f65d05e77ef1794200bb5
