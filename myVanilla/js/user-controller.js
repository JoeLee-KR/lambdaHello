/**
 * modified by yiearth
 * Serverless Architectures on AWS
 * https://github.com/JoeLee-KR/lambdaHello/pull/1
 * Last Updated: 6/30/2021, by yieartch : https://github.com/yiearth
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
        config.auth0.domain
      );
    }

    {
      const accessToken = localStorage.getItem("userToken");
      if (accessToken) {
        this.configureAuthenticatedRequests();
        this.data.auth0Lock.getUserInfo(accessToken, (error, profile) => {
          if (error) return alert("Auth0 error, cant getUserInfo: " + error.message);
          this.showUserAuthenticationDetails(profile);
        });
      }
    }

    this.wireEvents();
  },

  configureAuthenticatedRequests() {
    $.ajaxSetup({
      beforeSend(xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Bearer " + localStorage.getItem("userToken")
        );
      }
    });
  },

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
    const { auth0Lock, config } = this.data;

    auth0Lock.on("authenticated", ({ accessToken }) =>
      auth0Lock.getUserInfo(accessToken, (error, profile) => {
        auth0Lock.hide();
        if (error) return alert("Auth0 error:" + error);

        localStorage.setItem("userToken", accessToken);
        this.configureAuthenticatedRequests();
        this.showUserAuthenticationDetails(profile);
      })
    );

    {
      const { loginButton, logoutButton, profileButton } = this.uiElements;

      loginButton.click(() =>
        auth0Lock.show({ auth: { params: { scope: "openid profile", responseType: 'id_token token' } } })
      );

      logoutButton.click(() => {
        localStorage.removeItem("userToken");
        logoutButton.hide();
        profileButton.hide();
        loginButton.show();
        auth0Lock.logout();
        // auth0Lock.logout({ returnTo: "http://127.0.0.1:8200" });
      });

      profileButton.click(() => {
        const url = config.apiBaseUrl + "/user-profile";
        $.get(url, data => {
          $("#user-profile-raw-json").text(JSON.stringify(data, null, 2));
          $("#user-profile-modal").modal();
        });
      });
    }
  }
};


