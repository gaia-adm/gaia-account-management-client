"use strict";

const AuthService = function($window, $http, $q, $state, AuthUser, appConfig) {
  'ngInject';
  this.logout = function() {
    let _self = this;
    let gapi = $window.gapi;
    _self.gaiaLogout().then(function () {
      if(gapi.auth2) {
        _self.googleSignout(gapi.auth2.getAuthInstance());
      } else {
        gapi.load('auth2', function() {
          let instance = gapi.auth2.init();
          instance.then(function() {
            _self.googleSignout(instance);
          });
        });
      }
    });
  };

  this.googleSignout = function(authInstance) {
    authInstance.signOut().then(function () {
      console.log('User signed out.');
      AuthUser.invalidate();
      $state.go('login');
    });
  };

  this.gaiaLogout = function () {
     return $http({
      method: 'GET',
      url: appConfig.url + '/auth/gaia.logout'
    });
  }
};

const AuthUser = function($cookies) {
  'ngInject';
  this.data = null;
  this.set = function(data) {
    this.data = data;
    $cookies.put('user', JSON.stringify(data));
  };
  this.get = function() {
    if(this.data !== null) {
      return this.data;
    }
    let userCookie = $cookies.get('user');
    if(userCookie) {
      this.data = JSON.parse(userCookie);
      return this.data;
    }
    return null;
  };
  this.invalidate = function() {
    $cookies.remove('user');
    this.data = null;
  }
};

const AuthRole = function($cookies) {
  'ngInject';
  this.role = null;
  this.set = function(role) {
    this.role = role;
    $cookies.put('role', role);
  };
  this.get = function() {
    if(this.role !== null) {
      return this.role;
    }
    return $cookies.get('role');
  };
  this.invalidate = function() {
    $cookies.remove('role');
    this.role = null;
  }
};

export default angular.module('services.auth', [])
  .service('AuthService', AuthService)
  .service('AuthUser', AuthUser)
  .service('AuthRole', AuthRole)
  .config(['$httpProvider', function($httpProvider) {
    'ngInject';
    $httpProvider.defaults.withCredentials = true;
  }])
  .run(['$window', function($window) {
    'ngInject';

  }])
  .name;





