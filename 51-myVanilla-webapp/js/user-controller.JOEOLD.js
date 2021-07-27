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
        
        var params = {
          authParams: {
            scope: 'openid email user_metadata picture'
          }
        };
        
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