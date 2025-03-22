(function() {
    'use strict';

    angular.module('selfService')
        .service('SharesApplicationService', ['$resource', 'BASE_URL', SharesApplicationService]);

    /**
     * @module SharesApplicationService
     * @description
     * Service required for Shares Application
     */
    function SharesApplicationService($resource, BASE_URL) {
        
        this.template = function() {
            return $resource(BASE_URL + '/self/shareaccounts/template');
        }
        this.shares = function() {
            return $resource(BASE_URL + '/self/shareaccounts');
        }
    }

})();