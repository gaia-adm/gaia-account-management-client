import angular from 'angular';
import routing from './home.routes';
import HomeController from './home.controller';

export default angular.module('app.home', [])
  .config(routing)
  .controller('HomeController', HomeController)
  .name;
