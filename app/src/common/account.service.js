(function () {
    'use strict';
    //@todo Move this service to the common folder
    angular.module('selfService')
        .service('AccountService', ['$http', '$resource', 'BASE_URL', 'storageService', AccountService]);

    function AccountService($http, $resource, BASE_URL, storageService) {

        function getAuthHeaders() {
            return storageService.getItem('token').then(function (token) {
                return { 'Authorization': 'Basic ' + token };
            }).catch(function () {
                return {};
            });
        }

        /**
         * Get the clients associated with the current user's account.
         *
         */
        this.getClients = function () {
            return getAuthHeaders().then(function (headers) {
                return $resource(BASE_URL + '/self/clients/', {}, {
                    query: { method: 'GET', headers: headers, isArray: true }
                }).query().$promise;
            });
        };

        this.getAllAccounts = function (clientId) {
            console.log('Fetching all accounts');
            return getAuthHeaders().then(function (headers) {
                return $resource(BASE_URL + '/self/clients/' + clientId + '/accounts', {}, {
                    query: { method: 'GET', headers: headers, isArray: true }
                }).query().$promise;
            });
        };

        this.getClient = function (id) {
            return getAuthHeaders().then(function (headers) {
                return $resource(BASE_URL + '/self/clients/' + id, {}, {
                    get: { method: 'GET', headers: headers }
                }).query().$promise;
            });
        }

        this.getClientImage = function (id) {
            return $http({
                method: 'GET',
                url: BASE_URL + '/self/clients/' + id + '/images'
            });
        }

        this.getClientCharges = function (id) {
            return $resource(BASE_URL + '/self/clients/' + id + '/charges?pendingPayment=true');
        }

        this.getClientAccounts = function (id) {
            return getAuthHeaders().then(function (headers) {
                return $resource(BASE_URL + '/self/clients/' + id, {}, {
                    get: { method: 'GET', headers: headers }
                }).query().$promise;
            });
        }

        this.getLoanAccount = function (id) {
            return getAuthHeaders().then(function (headers) {
                return $resource(BASE_URL + '/self/loans/' + id, {}, {
                    get: { method: 'GET', headers: headers }
                }).query().$promise;
            });
        }

        this.setClientId = function (id) {
            storageService.setObject('client_id', id);
        }

        this.getClientId = function () {
            return storageService.getItem('client_id');
        }

    }

})();
