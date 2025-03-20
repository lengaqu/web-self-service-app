(function(){
    'use strict';

    angular.module('selfService')
        .controller('SavingsApplicationCtrl', ['$scope', '$filter', '$mdToast', 'AccountService', 'SavingsApplicationService', SavingsApplicationCtrl]);

    /**
     * @module SavingsApplicationCtrl
     * @description
     * Controls Application for Savings
     */
    function SavingsApplicationCtrl($scope, $filter, $mdToast, AccountService, SavingsApplicationService) {
        var vm = this;

        vm.form = {
            locale: 'en',
            dateFormat: 'dd MMMM yyyy'
        };
        vm.template = {};
        vm.clientId = null;

        vm.init = init;
        vm.getSavingsTemplate = getSavingsTemplate;
        vm.clearForm = clearForm;
        vm.submit = submit;

        init();

        function init(){
            AccountService.getClientId().then(function (clientId) {
                vm.clientId = clientId;
                getSavingsTemplate(clientId, null);
            })
        }

        function getSavingsTemplate(clientId, productId) {
            SavingsApplicationService.template().get({
                clientId: clientId,
                productId: productId
            }).$promise.then(function(template) {
                vm.template = template;
                vm.currency = vm.template.currency.name; // Store separately
                vm.form.nominalAnnualInterestRate = vm.template.nominalAnnualInterestRate;
                vm.form.submittedOnDate = $filter('date','dd MMMM yyyy')(new Date(), 'dd MMMM yyyy');
            })
        }
        function clearForm() {
            $scope.savingsApplicationForm.$setPristine();
            $scope.savingsApplicationForm.$setUntouched();
            vm.template = {};
            vm.currency = ''; // Reset currency separately
            vm.form = {
                locale: 'en',
                dateFormat: 'dd MMMM yyyy'
            };
            init();
        }

        function submit() {
            var savingsTemp = {
                clientId: vm.clientId,
                minRequiredOpeningBalance: vm.template.minRequiredOpeningBalance,
                allowOverdraft: vm.template.allowOverdraft,
                charges: vm.template.charges
            };
            var data = Object.assign({}, savingsTemp, vm.form);
            delete data.currency;
            SavingsApplicationService.savings().save(data).$promise.then(function() {
                clearForm();
                $mdToast.show(
                    $mdToast.simple()
                        .content("Savings Application Submitted Successfully")
                        .hideDelay(2000)
                        .position('top right')
                );
            }, function(){
                $mdToast.show(
                    $mdToast.simple()
                        .content("Error Creating Savings Application")
                        .hideDelay(2000)
                        .position('top right')
                );
            });
        }
    }
})();