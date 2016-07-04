/**
 * Created with IntelliJ IDEA.
 * User: paradigm72
 * Date: 3/29/15
 * Time: 10:30 PM
 * To change this template use File | Settings | File Templates.
 */

angular.module('angularNodeDemo', []);

angular.module('angularNodeDemo').controller('dataList', function($scope, $http) {

    $scope.initializeList = function() {
        $http.get("http://192.168.1.129:8888").success(function(data) {
            $scope.text = data;
        });
    };

    $scope.contactServerGET = function() {
    	var input = { 'inputString': 'myString'};
    	$http.get("http://192.168.1.129:8000/getResponder?clientInput=" + 'myString').success(function(data) {
    		$scope.getResponse = data;
    	});
    };

    $scope.contactServerPOST = function() {
        var input = { 'clientInput': 'myString'};
        $http.post("http://192.168.1.129:8000/postResponder", 'testString').success(function(data) {
            $scope.postResponse = data;
        });
    };

});