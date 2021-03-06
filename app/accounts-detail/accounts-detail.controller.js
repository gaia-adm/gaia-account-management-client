"use strict";

let _toastr, _state, _uibModal;

export default class AccountsDetailController {
  /*@ngInject*/

  constructor($stateParams, AccountResource, toastr, $state, $uibModal) {
    let _self = this;
    _toastr = toastr;
    _state = $state;
    _uibModal = $uibModal;
    let id = $stateParams.accountId;
    this.account = AccountResource.get({id: id}, function(account) {
      account.invitations = _.filter(account.invitations, {date_accepted: null});
      return account;
    });
    this.inviteUserModalConfig = {
      backdrop: true,
      controller: function($scope, $uibModalInstance) {
        'ngInject';
        $scope.onInvitationCancelled = function() {
          $uibModalInstance.close();
          _self.onInvitationCancelled();
        };
        $scope.onInvitationSuccess = function(invitation) {
          $uibModalInstance.close();
          _self.onInvitationSuccess(invitation);
        };
        $scope.onInvitationFailure = function() {
          $uibModalInstance.close();
          _self.onInvitationFailure();
        };
      },
      template: '<div ' +
      'invite-user ' +
      'account-id="' + id + '" ' +
      'on-success="onInvitationSuccess(invitation)" ' +
      'on-failure="onInvitationFailure()" ' +
      'on-cancel="onInvitationCancelled()" ' +
      '/>'
    };
  }

  //ACCOUNT

  saveChanges(account) {
    account.$update().then(function(account) {
      _toastr.success('Account updated');
      _state.go('authenticated.accounts.main');
    })
  }

  disableAccount(account) {
    account.enabled = false;
    this.saveChanges(account);
  }

  reenableAccount(account) {
    account.enabled = true;
    this.saveChanges(account);
  }

  //INVITATION

  inviteUser(account) {
    this.inviteUserModalInstance = _uibModal.open(this.inviteUserModalConfig);
  }

  onInvitationSuccess(invitation) {
    this.account.invitations.push(invitation);
  }


  onInvitationFailure() {
    console.log('invitation failure');
  }


  onInvitationCancelled() {
    console.log('invitation cancelled');
  }

  //USER MANAGEMENT
  removeUser(user) {
    _.remove(this.account.users, function(u) {
      return u.id === user.id;
    });
  }


}
