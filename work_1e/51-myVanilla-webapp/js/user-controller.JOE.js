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
  
        var params = {
          authParams: {
            scope: 'openid email user_metadata picture'
          }
        };
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
          alert(JSON.stringify(data));
        })
      });
    }
  }