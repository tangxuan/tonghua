'use strict';

// Members controller
angular.module('members').controller('MembersController', ['$scope', '$stateParams', '$location', '$filter', '$timeout', 'Authentication', 'Members', 'dialogs',
    function($scope, $stateParams, $location, $filter, $timeout, Authentication, Members, dialogs) {
        $scope.authentication = Authentication;

        // mock data
        $scope.code = '001';
        $scope.name = '葛楠';
        $scope.birthday = new Date('1987/08/25');
        $scope.address = '龙湖时代天街';
        $scope.phoneNumber = '15390017852';
        $scope.lessonCount = 100;

        // TODO: cell click to view member detail
        $scope.gridOptions = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableFullRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            rowHeight: 35,
            showGridFooter:true,
            multiSelect: false,
            columnDefs: [{
                displayName: '姓名',
                field: 'name',
            }, {
                displayName: '学号',
                field: 'code',
            }, {
                displayName: '电话',
                field: 'phoneNumber',
            }, {
                displayName: '地址',
                field: 'address',
            }, {
                displayName: '生日',
                field: 'birthday'
            }, {
                displayName: '课程数',
                field: 'lessonCount'
            }]
        };

        function render (members) {
            members.forEach(function(member) {
                member.birthday = $filter('date')(new Date(member.birthday), 'yyyy/MM/dd');
            });
        }

        $scope.gridOptions.onRegisterApi = function(gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                $scope.member = $scope.gridApi.selection.getSelectedRows()[0];
            });

        };

        $scope.gotoCreate = function () {
            $location.path('members/create');
        };

        // Create new Member
        $scope.create = function() {
            // Create new Member object
            var member = new Members ({
                code: this.code,
                name: this.name,
                birthday: this.birthday,
                address: this.address,
                phoneNumber: this.phoneNumber,
                lessonCount: this.lessonCount
            });

            // Redirect after save
            member.$save(function(response) {
                // Clear form fields
                $scope.code = '';
                $scope.name = '';
                $scope.birthday = '';
                $scope.address = '';
                $scope.phoneNumber = '';
                $scope.lessonCount = '';
                
                $scope.error = null;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Member
        $scope.remove = function() {

            var dlg = dialogs.confirm('确认', '確定要刪除 ' + $scope.member.name + ' 吗？');
            dlg.result.then(function () {
                $scope.member.$remove();
                for (var i in $scope.members) {
                    if ($scope.members [i] === $scope.member) {
                        $scope.members.splice(i, 1);
                    }
                }
                $scope.gridApi.selection.clearSelectedRows();
                $scope.member = null;

                // remove all members
                // $scope.member.$remove(function() {
                //  $location.path('members');
                // });
            })

            
        };

        // Update existing Member
        $scope.gotoModify = function() {
            $location.path('members/' + $scope.member._id);
        };

        $scope.update = function () {
            $scope.member.$update(function() {
                render([$scope.member]);
                dialogs.notify('成功', '修改 ' + $scope.member.name + ' 成功！');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });  
        };

        $scope.checkIn = function () {
            $scope.member.lessonCount--;  
            $scope.member.$update(function() {
                render([$scope.member]);
                dialogs.notify('成功', $scope.member.name + ' 打卡成功！');
            }, function(errorResponse) {
                dialogs.error('失败', $scope.member.name + ' 打卡失败。\n\n\t' + errorResponse.data.message);
            });   
        };

        // Find a list of Members
        $scope.find = function() {
            Members.query().$promise.then(function (members) {
                render(members);
                $scope.gridOptions.data = $scope.members = members;

                $timeout(function() {
                    $scope.gridApi.selection.selectRow($scope.member);
                });
            });
        };

        // Find existing Member
        $scope.findOne = function() {
            $scope.member = Members.get({ 
                memberId: $stateParams.memberId
            });
        };
    }
]);