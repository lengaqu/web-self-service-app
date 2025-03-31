(function(){
    'use strict';

    angular.module('selfService')
        .controller('SharesApplicationCtrl', ['$scope', '$filter', '$mdToast', 'AccountService', 'SharesApplicationService', SharesApplicationCtrl]);

    /**
     * @module SharesApplicationCtrl
     * @description
     * Controls Application for Shares
     */
    function SharesApplicationCtrl($scope, $filter, $mdToast, AccountService, SharesApplicationService) {
        var vm = this;

        vm.form = {
            locale: 'en',
            dateFormat: 'dd MMMM yyyy'
        };
        vm.template = {};
        vm.clientId = null;
        vm.savingsAccounts = {};

        vm.init = init;
        vm.getSharesTemplate = getSharesTemplate;
        vm.getAccounts = getAccounts;
        vm.clearForm = clearForm;
        vm.submit = submit;
        
        init();

        function init() {
            AccountService.getClientId().then(function(clientId) {
                vm.clientId = clientId;
                getAccounts(clientId);
                getSharesTemplate(clientId, null); 
            })
        }
        function getAccounts(accountNo) {
            AccountService.getAllAccounts(accountNo).get().$promise.then(function (res) {
                vm.savingsAccounts = res.savingsAccounts.filter(function (account) {return account.status.value === "Active"});
            });            
        }

        function getSharesTemplate(clientId, productId) {
            SharesApplicationService.template().get({
                clientId: clientId,
                productId: productId
            }).$promise.then(function(template) {
                vm.template = template;
                vm.form.requestedShares = vm.template.productOptions.map(function (product) {return product.totalShares})[0];
                vm.currency = vm.template.productOptions.map(function (product) {return product.currency.name})[0];
                vm.form.submittedDate = $filter('date','dd MMMM yyyy')(new Date(), 'dd MMMM yyyy');
            })
        }
        function clearForm() {
            $scope.shareApplicationForm.$setPristine();
            $scope.shareApplicationForm.$setUntouched();
            vm.template = {};
            vm.form = {
                locale: 'en',
                dateFormat: 'dd MMMM yyyy'
            };
            init();
        }

        function submit() {
            vm.form.applicationDate = $filter('date')(new Date(), 'dd MMMM yyyy')
            var sharesTemplate = {
                clientId: vm.clientId,
            };
            var data = Object.assign({}, sharesTemplate, vm.form);
            SharesApplicationService.shares().save(data).$promise.then(function() {
                clearForm();
                $mdToast.show(
                    $mdToast.simple()
                        .content("Shares Application Submitted Successfully")
                        .hideDelay(2000)
                        .position('top right')
                );
            }, function(){
                $mdToast.show(
                    $mdToast.simple()
                        .content("Error Creating Shares Application")
                        .hideDelay(2000)
                        .position('top right')
                );
            });
        }

    }
})();