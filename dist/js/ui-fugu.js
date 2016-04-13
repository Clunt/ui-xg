/*
 * angular-ui-fugu
 * Version: 0.0.1 - 2016-04-13
 * License: ISC
 */
angular.module("ui.fugu", ["ui.fugu.tpls","ui.fugu.alert","ui.fugu.button","ui.fugu.buttonGroup","ui.fugu.timepanel","ui.fugu.calendar","ui.fugu.datepicker","ui.fugu.dropdown","ui.fugu.modal","ui.fugu.notification","ui.fugu.pager","ui.fugu.searchBox","ui.fugu.select","ui.fugu.sortable","ui.fugu.switch","ui.fugu.timepicker","ui.fugu.tooltip","ui.fugu.tree"]);
angular.module("ui.fugu.tpls", ["alert/templates/alert.html","button/templates/button.html","buttonGroup/templates/buttonGroup.html","timepanel/templates/timepanel.html","calendar/templates/calendar.html","datepicker/templates/datepicker.html","dropdown/templates/dropdown-choices.html","dropdown/templates/dropdown.html","modal/templates/backdrop.html","modal/templates/window.html","notification/templates/notification.html","pager/templates/pager.html","searchBox/templates/searchBox.html","select/templates/choices.html","select/templates/match-multiple.html","select/templates/match.html","select/templates/select-multiple.html","select/templates/select.html","switch/templates/switch.html","timepicker/templates/timepicker.html","tree/templates/tree-node.html","tree/templates/tree.html"]);
/**
 * alert
 * 警告提示指令
 * Author:heqingyang@meituan.com
 * Date:2015-01-11
 */
angular.module('ui.fugu.alert',[])
.controller('fuguAlertCtrl',['$scope','$attrs', '$timeout','$interpolate', function ($scope,$attrs,$timeout,$interpolate) {

    //指令初始化
    function initConfig(){
        $scope.closeable = ($scope.close&&($scope.close=="true"||$scope.close=="1"))?true:false;
        $scope.defaultclose = false;
        $scope.hasIcon = ($scope.hasIcon&&($scope.hasIcon=="true"||$scope.hasIcon=="1"))?true:false;
    }
    initConfig();

    //添加默认close方法
    if(!$attrs.closeFunc){
        $scope.closeFunc = function(){
            $scope.defaultclose = true;
        }
    }

    //判断是否显示图标
    var type = angular.isDefined($attrs.type)? $interpolate($attrs.type)($scope.$parent): null;

    if($scope.hasIcon) {
    switch(type){
        case 'danger':
            $scope.iconClass = 'remove-sign';
            break;
        case 'success':
            $scope.iconClass = 'ok-sign';
            break;
        case 'info':
            $scope.iconClass = 'info-sign';
            break;
        default:
            $scope.iconClass = 'exclamation-sign';
            break;
        }
    }

    //判断是否有时间参数
    var dismissOnTimeout = angular.isDefined($attrs.dismissOnTimeout)?
        $interpolate($attrs.dismissOnTimeout)($scope.$parent): null;
    if(dismissOnTimeout) {
        $timeout(function(){
            $scope.closeFunc();
        },parseInt(dismissOnTimeout, 10))
    }
}])
.directive('fuguAlert',function () {
    return {
        restrict: 'E',
        templateUrl: function(element, attrs){
            return attrs.templateUrl || 'templates/alert.html';
        },
        replace:true,
        transclude:true,
        scope:{
            type:'@',
            close : '@',
            closeFunc : '&',
            closeText : '@',
            hasIcon : '@'
        },
        controller:'fuguAlertCtrl',
        controllerAs: 'alert'
    }
});
/**
 * button
 * 按钮指令
 * Author:penglu02@meituan.com
 * Date:2016-01-12
 */
angular.module('ui.fugu.button', [])
    .constant('buttonConfig', {

    })
    .directive('fuguButton', [function(){
        return {
            restrict: 'AE',
            scope:{
                disabled: '=?',   // 对于不是必须传递需要使用?
                loading: '=?',
                onClick : '&?click'
            },
            replace:false,
            templateUrl: 'templates/button.html',
            controller: 'buttonController',
            link: function(scope, element, attrs){
               element = angular.element(element.children()[0]);
               var btnClass = getAttrValue(attrs.btnclass, 'default'), // 样式:primary|info等,默认default
                    size  = getAttrValue(attrs.size, 'default'), // 大小:x-small,small等,默认为default
                    block = getAttrValue(attrs.block, false), //是否按100%的width填充父标签,默认为false
                    active = getAttrValue(attrs.active, false),// 激活状态,默认为false
                    type = getAttrValue(attrs.type, 'button'), // 按钮类型:button|submit|reset,默认为button
                    text = getAttrValue(attrs.text, 'button'), //按钮显示文本,默认为Button
                    icon = getAttrValue(attrs.icon, ''); //按钮图标,默认没有
                scope.text = scope.initText = text;
                scope.type = type;
                scope.icon = 'glyphicon-' + icon;
                scope.iconFlag = icon !== ''  ? true : false;
                scope.disabled =  scope.initDisabled =angular.isDefined(scope.disabled) ?  scope.disabled : false; // 是否不可用,默认为false
                scope.loading = angular.isDefined(scope.loading) ?  scope.loading : false; // 是否有加载效果,默认为false
               /**
                 * 获取属性值:数据绑定(通过变量设置|定义常量)|默认值
                 * @param {string} attributeValue 标签绑定数据(可解析|定值)
                 * @param {string | boolean} defaultValue 默认值
                 * @returns {*} 最终值
                 */
               function getAttrValue(attributeValue, defaultValue){
                    var val = scope.$parent.$eval(attributeValue);   //变量解析
                    return angular.isDefined(val) ? val :  attributeValue ? attributeValue : defaultValue;
               }
               element.addClass('btn-' + btnClass); //设置按钮样式

               // 设置按钮大小
               switch(size)
               {
                    case 'large':
                        size = 'lg';
                        break;
                    case 'small':
                        size = 'sm';
                        break;
                    case 'x-small':
                        size = 'xs';
                        break;
                    default:
                        size = 'default';
                        break;
               }

               element.addClass('btn-' + size); //设置按钮大小

               // 设置block
               if(block){
                    element.addClass('btn-block');
               }

               // 设置active状态
               if(active){
                    element.addClass('active');
               }

               scope.$watch('disabled', function(val){
                    if(val){
                        element.attr('disabled', 'disabled');
                    }else{
                        element.removeAttr('disabled');
                    }
               });

               // button绑定click事件
               element.bind('click', function(){
                    if(scope.onClick){
                        scope.onClick();
                        scope.$parent.$apply();
                    }
               });
               scope.$watch('loading', function(val){
                    var spanEle = element.children('span.glyphicon-refresh-animate'),
                        ele = null;
                   if(val){
                        scope.disabled = val;
                        if(spanEle.length > 0){
                            spanEle.removeClass('hidden');
                        }else{
                            scope.text = 'isLoading...';
                            ele = '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>';
                            element.prepend(ele);
                        }
                    }else{
                        scope.disabled = scope.initDisabled;
                        scope.text = scope.initText;
                        if(spanEle.length > 0){
                            spanEle.addClass('hidden');
                        }
                    }
               });
            }
        }
    }])
    .controller('buttonController', ['$scope', function($scope){
        $scope.btnClassArr = ['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'];  // 所有可设置样式
        $scope.sizeArr = ['large', 'small', 'x-small', 'default'];  // 所有可设置大小
        $scope.typeArr = ['button', 'reset', 'submit'];  // 所有可设置类型
    }]);

/**
 * button
 * 按钮组指令
 * Author:penglu02@meituan.com
 * Date:2016-01-23
 */
angular.module('ui.fugu.buttonGroup', [])
    .constant('buttonGroupConfig', {
        size : 'default',   // 按钮组大小:x-small,small,default,larger
        type : 'radio',  // 按钮组类型:radio 或者 checkbox类型
        showClass : 'default', //按钮组样式:danger | warning | default | success | info ｜ primary
        checkboxTrue : true, // 按钮选中对应ngModel的值
        checkboxFalse : false, //按钮不选对应ngModel的值
        disabled : false  // 按钮组不可用状态
    })
    .controller('buttonGroupController',['$transclude', '$scope', '$element', '$attrs', 'buttonGroupConfig', function($transclude, $scope, $element, $attrs, buttonGroupConfig){
        var transcludeEles = $transclude(),// 获取嵌入元素 TODO:1.2.25版本不需要传入$scope，否则会报错
            i = 0,
            tagName,
            childElements = [],
            btnObj = {};

        // 根据插入按钮，生成嵌入元素数据对象
        for (;i < transcludeEles.length; i++ ){
            tagName = transcludeEles[i].tagName;
            if(tagName && tagName.toLocaleLowerCase() === 'button'){
                btnObj = {};
                btnObj.value = transcludeEles[i].innerText;   // 获取button显示内容
                btnObj.btnRadio = getAttrValue(angular.element(transcludeEles[i]).attr('btn-radio'), "");  //获取btn-radio属性对应值:控制选中状态
                btnObj.btnCheckbox = getAttrValue(angular.element(transcludeEles[i]).attr('btn-checkbox'), "");  //获取btn-checkbox属性对应值:控制勾选状态
                childElements.push(btnObj);
            }
        }

        $scope.buttonGroup = {};
        $scope.buttons = childElements;
        $scope.type = getAttrValue($attrs.type, buttonGroupConfig.type);  //按钮组类型:radio | checkbox
        $scope.size = getAttrValue($attrs.size, buttonGroupConfig.size);  // 按钮组大小
        $scope.showClass = getAttrValue($attrs.showClass, buttonGroupConfig.showClass); //按钮组样式
        $scope.checkboxTrue = getAttrValue($attrs.checkboxTrue, buttonGroupConfig.checkboxTrue);   //checkbox选中对应model值
        $scope.checkboxFalse = getAttrValue($attrs.checkboxFalse, buttonGroupConfig.checkboxFalse);   //checkbox不选对应model值
        $scope.disabled = getAttrValue($attrs.disabled, buttonGroupConfig.disabled);

        // 设置按钮大小,转变成class
        switch($scope.size)
        {
            case 'large':
                $scope.size = 'btn-lg';
                break;
            case 'small':
                $scope.size = 'btn-sm';
                break;
            case 'x-small':
                $scope.size = 'btn-xs';
                break;
            default:
                $scope.size = 'btn-default';
                break;
        }

        // 设置按钮样式类型,转变成class
        $scope.showClass = "btn-" + $scope.showClass;

        // 设置不可用
        if($scope.disabled) {
            $scope.disabled = 'disabled';
        }
        /**
         * 获取属性值:数据绑定(通过变量设置|定义常量)|默认值
         * @param {string} attributeValue 标签绑定数据(可解析|定值)
         * @param {string | boolean} defaultValue 默认值
         * @returns {*} 最终值
         */
        function getAttrValue(attributeValue, defaultValue){
            var val = $scope.$parent.$eval(attributeValue);   //变量解析
            return angular.isDefined(val) ? val :  attributeValue ? attributeValue : defaultValue;
        }
    }])
    .directive('fuguButtonGroup', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                ngModel: '@'
            },
            require: '^ngModel',
            templateUrl: 'templates/buttonGroup.html',
            transclude:true,
            controller: 'buttonGroupController',
            link: function (scope, element, attrs, ngModelCtrl) {
                var _scope = scope,
                    o, i;
                if(scope.type === 'radio'){   //radio类型

                    // model的render事件:model->ui
                    ngModelCtrl.$render = function(){   // 重写render方法
                        if(ngModelCtrl.$viewValue){
                            scope.modelObj = ngModelCtrl.$viewValue;  // 获取元素的model
                        }
                        angular.forEach(scope.buttons, function(val){
                            if(!val.btnRadio){  // 没有设置btn-radio,使用元素的text作为默认值
                                val.btnRadio = val.value;
                            }

                            // 判断按钮组是否选中:btn-radio设置model值
                            if(angular.equals(ngModelCtrl.$viewValue, val.btnRadio)){
                                val.active = 'active';
                            }else{
                                val.active = '';
                            }
                        });

                    };

                    // 按钮点击事件:修改model,实现ui->model
                    scope.clickFn = function(btn, event){
                        event.stopPropagation();
                        event.preventDefault();
                        if(_scope.disabled){
                            return;
                        }
                        ngModelCtrl.$setViewValue(btn.btnRadio); // 修改选中对应model值
                        ngModelCtrl.$render();
                    };
                }else{    // checkbox类型
                    // model的render事件:model->ui
                    ngModelCtrl.$render = function(){   // 重写render方法
                        if(ngModelCtrl.$viewValue){
                            scope.modelObj = ngModelCtrl.$viewValue;   // 获取元素的model
                        }
                        angular.forEach(scope.buttons, function(val, idx){
                            i = 0;
                            if(!val.btnCheckbox){  // 没有设置值,则使用对应ng-model的key作为默认值
                                for(o in scope.modelObj){
                                    if(i === idx){
                                        val.btnCheckbox = o;
                                        break;
                                    }else{
                                        i++;
                                    }
                                }
                            }

                            // 判断给定当前checkbox状态是否选中model的值(btn-checkbox对应model中的值是否为true)
                            // btn-checkbox值的设置为ng-model对应对象的key
                            if(angular.equals(scope.modelObj[val.btnCheckbox], scope.checkboxTrue)){
                                val.active = 'active';
                            }else{
                                val.active = '';
                                val.active = '';
                            }
                        });
                    };

                    // 按钮点击事件:修改model,实现ui->model
                    scope.clickFn = function(btn, event){
                        event.stopPropagation();
                        event.preventDefault();
                        if(_scope.disabled){
                            return;
                        }

                        if(btn.active){
                            scope.modelObj[btn.btnCheckbox] = _scope.checkboxFalse; // 修改选中状态:选中->不选,对应model值
                        }else{
                            scope.modelObj[btn.btnCheckbox] = _scope.checkboxTrue; //修改选中状态:不选->选中,对应model值
                        }
                        ngModelCtrl.$setViewValue(scope.modelObj);  // 修改model
                        ngModelCtrl.$render();
                    };
                }
            }
        }
    }]);

/**
 * timepanel
 * timepanel directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-15
 */
angular.module('ui.fugu.timepanel', [])
    .constant('fuguTimepanelConfig', {
        hourStep: 1,
        minuteStep: 1,
        secondStep: 1,
        showSeconds: true,
        mousewheel: true,
        arrowkeys: true
    })
    .filter('smallerValue', function () {
        return function (input, maxValue, step) {
            input = parseInt(input, 10) - parseInt(step, 10);
            if (input < 0) {
                input = maxValue;
            }
            if (input < 10) {
                input = '0' + input;
            }
            return input;
        }
    })
    .filter('largerValue', function () {
        return function (input, maxValue, step) {
            input = parseInt(input, 10) + parseInt(step, 10);
            if (input > maxValue) {
                input = 0;
            }
            if (input < 10) {
                input = '0' + input
            }
            return input;
        }
    })
    .controller('fuguTimepanelCtrl', ['$scope', '$attrs', '$parse','$log', 'fuguTimepanelConfig', 'smallerValueFilter', 'largerValueFilter', function ($scope, $attrs, $parse,$log, timepanelConfig, smallerValueFilter, largerValueFilter) {
        var ngModelCtrl = {$setViewValue: angular.noop};

        this.init = function (_ngModelCtrl, inputs) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            ngModelCtrl.$formatters.unshift(function (modelValue) {
                return modelValue ? new Date(modelValue) : null;
            });
            //$scope.$$postDigest(function(){}); // 如果showSeconds用的是ng-if，此时second还没有插入DOM，无法获取元素和绑定事件
            var hoursInputEl = inputs.eq(0),
                minutesInputEl = inputs.eq(1),
                secondsInputEl = inputs.eq(2);
            hoursInputEl.on('focus', function () {
                hoursInputEl[0].select();
            });
            minutesInputEl.on('focus', function () {
                minutesInputEl[0].select();
            });
            secondsInputEl.on('focus', function () {
                secondsInputEl[0].select();
            });

            var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepanelConfig.mousewheel;
            if (mousewheel) {
                this.setupMousewheelEvents(hoursInputEl, minutesInputEl, secondsInputEl);
            }
            var arrowkeys = angular.isDefined($attrs.arrowkeys) ? $scope.$parent.$eval($attrs.arrowkeys) : timepanelConfig.arrowkeys;
            if (arrowkeys) {
                this.setupArrowkeyEvents(hoursInputEl, minutesInputEl, secondsInputEl);
            }
        };

        $scope.hourStep = angular.isDefined($attrs.hourStep) ? $scope.$parent.$eval($attrs.hourStep) : timepanelConfig.hourStep;
        $scope.minuteStep = angular.isDefined($attrs.minuteStep) ? $scope.$parent.$eval($attrs.minuteStep) : timepanelConfig.minuteStep;
        $scope.secondStep = angular.isDefined($attrs.secondStep) ? $scope.$parent.$eval($attrs.secondStep) : timepanelConfig.secondStep;
        $scope.showSeconds = timepanelConfig.showSeconds;
        if ($attrs.showSeconds) {
            $scope.$parent.$watch($parse($attrs.showSeconds), function (value) {
                $scope.showSeconds = !!value;
            });
        }
        $scope.decrease = function (type, maxValue) {
            $scope[type] = smallerValueFilter($scope[type], maxValue, $scope[type + 'Step']);
            changeHandler();
        };
        $scope.increase = function (type, maxValue) {
            $scope[type] = largerValueFilter($scope[type], maxValue, $scope[type + 'Step']);
            changeHandler();
        };
        $scope.changeInputValue = function (type, maxValue) {
            if (isNaN($scope[type])) {
                return;
            }
            $scope[type] = parseInt($scope[type], 10);
            if ($scope[type] < 0) {
                $scope[type] = 0;
            }
            if ($scope[type] > maxValue) {
                $scope[type] = maxValue;
            }
            $scope[type] = addZero($scope[type]);
            changeHandler();
        };
        this.render = function () {
            var date = ngModelCtrl.$modelValue;

            if (isNaN(date)) {
                $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
            } else {
                $scope.hour = date ? addZero(date.getHours()) : null;
                $scope.minute = date ? addZero(date.getMinutes()) : null;
                $scope.second = date ? addZero(date.getSeconds()) : null;
            }
        };
        this.setupMousewheelEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
            var isScrollingUp = function (e) {
                if (e.originalEvent) {
                    e = e.originalEvent;
                }
                var delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
                return e.detail || delta > 0;
            };

            hoursInputEl.bind('mousewheel wheel', function (e) {
                $scope.$apply(isScrollingUp(e) ? $scope.increase('hour', 23) : $scope.decrease('hour', 23));
                e.preventDefault();
            });

            minutesInputEl.bind('mousewheel wheel', function (e) {
                $scope.$apply(isScrollingUp(e) ? $scope.increase('minute', 59) : $scope.decrease('minute', 59));
                e.preventDefault();
            });

            secondsInputEl.bind('mousewheel wheel', function (e) {
                $scope.$apply(isScrollingUp(e) ? $scope.increase('second', 59) : $scope.decrease('second', 59));
                e.preventDefault();
            });
        };

        this.setupArrowkeyEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
            hoursInputEl.bind('keydown', arrowkeyEventHandler('hour', 23));
            minutesInputEl.bind('keydown', arrowkeyEventHandler('minute', 59));
            secondsInputEl.bind('keydown', arrowkeyEventHandler('second', 59));
        };
        function changeHandler() {
            var dt = angular.copy(ngModelCtrl.$modelValue);
            dt.setHours($scope.hour);
            dt.setMinutes($scope.minute);
            dt.setSeconds($scope.second);
            if ($scope.onChange) {
                var fn = $scope.onChange();
                if (angular.isFunction(fn)) {
                    fn(dt);
                }
            }
            ngModelCtrl.$setViewValue(dt);
            ngModelCtrl.$render();
        }

        function arrowkeyEventHandler(type, maxValue) {
            return function (e) {
                if (e.which === 38) { // up
                    e.preventDefault();
                    $scope.increase(type, maxValue);
                    $scope.$apply();
                } else if (e.which === 40) { // down
                    e.preventDefault();
                    $scope.decrease(type, maxValue);
                    $scope.$apply();
                }
            }
        }

        function addZero(value) {
            return value > 9 ? value : '0' + value;
        }
    }])
    .directive('fuguTimepanel', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/timepanel.html',
            replace: true,
            require: ['fuguTimepanel', 'ngModel'],
            scope: {
                onChange: '&'
            },
            controller: 'fuguTimepanelCtrl',
            link: function (scope, el, attrs, ctrls) {
                var timepanelCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                timepanelCtrl.init(ngModelCtrl, el.find('input'));
            }
        }
    });
/**
 * calendar
 * calendar directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-14
 */
angular.module('ui.fugu.calendar', ['ui.fugu.timepanel'])
    .constant('fuguCalendarConfig',{
        startingDay:0, // 一周的开始天,0-周日,1-周一,以此类推
        showTime:true, // 是否显示时间选择
        minDate: null, // 最小可选日期
        maxDate: null, // 最大可选日期
        exceptions:[]  // 不可选日期中的例外,比如3月份的日期都不可选,但是3月15日却是可选择的
    })
    .provider('fuguCanlendar', function () {
        var FORMATS = {};
        this.setFormats = function (formats,subFormats) {
            if(subFormats){
                FORMATS[formats] = subFormats;
            }else{
                FORMATS = formats;
            }
        };

        this.$get  = ['$locale','$log',function ($locale,$log) {
            return {
                getFormats: function () {
                    FORMATS = angular.extend(angular.copy($locale.DATETIME_FORMATS),FORMATS);
                    if(!angular.isArray(FORMATS.SHORTMONTH) ||
                        FORMATS.SHORTMONTH.length!=12 ||
                        !angular.isArray(FORMATS.MONTH) ||
                        FORMATS.MONTH.length!=12 ||
                        !angular.isArray(FORMATS.SHORTDAY) ||
                        FORMATS.SHORTDAY.length!=7
                    ){
                        $log.warn('invalid date time formats');
                        FORMATS = $locale.DATETIME_FORMATS;
                    }
                    return FORMATS;
                }
            }
        }]
    })
    .controller('fuguCalendarCtrl', ['$scope', '$attrs','$log','fuguCanlendar','fuguCalendarConfig',
        function ($scope, $attrs,$log,fuguCanlendarProvider,calendarConfig) {
        var FORMATS = fuguCanlendarProvider.getFormats();
        var MONTH_DAYS = [31,28,31,30,31,30,31,31,30,31,30,31]; //每个月的天数,2月会根据闰年调整
        var ngModelCtrl = {$setViewValue: angular.noop};

        $scope.FORMATS = FORMATS;
        $scope.panels = {
            year:false,
            month:false,
            day:true,
            time:false
        };
        var self = this;
        angular.forEach(['startingDay','exceptions'], function(key) {
            self[key] = angular.isDefined($attrs[key]) ? angular.copy($scope.$parent.$eval($attrs[key])) : calendarConfig[key];
        });
        $scope.showTime = angular.isDefined($attrs.showTime) ?
            $scope.$parent.$eval($attrs.showTime) : calendarConfig.showTime;


        if(self.startingDay > 6 || self.startingDay <0){
            self.startingDay = calendarConfig.startingDay;
        }

        $scope.dayNames = dayNames(this.startingDay);
        $scope.allDays = [];
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            ngModelCtrl.$formatters.unshift(function (modelValue) {
                return modelValue ? new Date(modelValue) : null;
            });
        };
        this.render = function () {
            var date = ngModelCtrl.$modelValue;
            if (isNaN(date) || !date) {
                $log.warn('Calendar directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
            } else {
                $scope.selectDate = ngModelCtrl.$modelValue;

                $scope.currentYear = $scope.selectDate.getFullYear();
                $scope.currentMonth = $scope.selectDate.getMonth();
                $scope.currentDay = $scope.currentYear+'-'+$scope.currentMonth+'-'+$scope.selectDate.getDate();

                $scope.allDays = getDays($scope.selectDate);
            }
        };
        // 选择某一个面板
        $scope.selectPanel = function (panel) {
            angular.forEach($scope.panels, function (a,i) {
                $scope.panels[i] = false;
            });
            $scope.panels[panel] = true;
        };
        // 切换上一个月
        $scope.prevMonth = function () {
            if($scope.currentMonth === 0){
                $scope.currentYear -= 1;
                $scope.currentMonth = 11;
            }else {
                $scope.currentMonth -= 1;
            }
            buildDayPanel();
        };
        // 切换到下一个月
        $scope.nextMonth = function () {
            if($scope.currentMonth === 11){
                $scope.currentYear += 1;
                $scope.currentMonth = 0;
            }else {
                $scope.currentMonth += 1;
            }
            buildDayPanel();
        };
        // 选择日期
        $scope.selectDayHandler = function (day) {
            if(day.isDisabled){
                return;
            }
            $scope.selectDate.setFullYear(day.year);
            $scope.selectDate.setMonth(day.month);
            $scope.selectDate.setDate(day.day);
            if(!day.inMonth){
                if(day.isNext){
                    $scope.nextMonth();
                }else{
                    $scope.prevMonth();
                }
            }
            $scope.currentDay = $scope.currentYear+'-'+$scope.currentMonth+'-'+$scope.selectDate.getDate();
            fireRender();
        };
        // 选择今天
        $scope.chooseToday = function () {
            var today = splitDate(new Date());

            $scope.selectDate.setFullYear(today.year);
            $scope.selectDate.setMonth(today.month);
            $scope.selectDate.setDate(today.day);

            $scope.currentYear = today.year;
            $scope.currentMonth = today.month;
            $scope.currentDay = $scope.currentYear+'-'+$scope.currentMonth+'-'+$scope.selectDate.getDate();

            buildDayPanel();
            fireRender();
        };
        var cacheTime;
        // 点击时间进入选择时间面板
        $scope.selectTimePanelHandler = function () {
            $scope.selectPanel('time');
            cacheTime = angular.copy($scope.selectDate);
        };

        // 时间面板返回
        $scope.timePanelBack = function () {
            $scope.selectDate = angular.copy(cacheTime);
            $scope.selectPanel('day');
        };
        // 确定选择时间
        $scope.timePanelOk = function () {
            $scope.selectPanel('day');
            fireRender();
        };
        // 选择此刻
        $scope.timePanelSelectNow = function () {
            var dt = new Date();
            var date = angular.copy($scope.selectDate);
            date.setHours(dt.getHours());
            date.setMinutes(dt.getMinutes());
            date.setSeconds(dt.getSeconds());
            $scope.selectDate = date;
        };
        // 获取所有月份,分4列
        $scope.allMonths = (function(){
            var res = [],
                MONTHS  = FORMATS.MONTH,
                temp = [];
            for(var i= 0,len=MONTHS.length;i<len;i++){
                if(temp.length>=3){
                    res.push(temp);
                    temp = [];
                }
                temp.push({
                    name:MONTHS[i],
                    index:i
                });
            }
            res.push(temp);
            return res;
        })();
        // 在月份视图显示某一月份
        $scope.chooseMonthHandler = function (month) {
            $scope.currentMonth = month;
            buildDayPanel();
            $scope.selectPanel('day');
        };

        $scope.allYears = [];
        $scope.selectYearPanelHandler = function () {
            $scope.selectPanel('year');
            var year = $scope.currentYear;
            $scope.allYears = getYears(year);
        };
        // 获取上一个12年
        $scope.prev12Years = function () {
            var year = $scope.allYears[0][0]-8;
            $scope.allYears = getYears(year);
        };
        // 获取下一个12年
        $scope.next12Years = function () {
            var year = $scope.allYears[3][2]+5;
            $scope.allYears = getYears(year);
        };
        // 在月份视图显示某一月份
        $scope.chooseYearHandler = function (year) {
            $scope.currentYear = year;
            buildDayPanel();
            $scope.selectPanel('month');
        };

        function fireRender(){
            var fn = $scope.onChange();
            if(fn && angular.isFunction(fn)){
                fn($scope.selectDate);
            }
            ngModelCtrl.$setViewValue($scope.selectDate);
            ngModelCtrl.$render();
        }

        // 根据年,月构建日视图
        function buildDayPanel(){
            var date = createDate($scope.currentYear,$scope.currentMonth);
            $scope.allDays = getDays(date);
        }
        // 获取所有的最近的12年
        function getYears(year){
            var res = [],temp = [];
            for(var i=-4;i<8;i++){
                if(temp.length>=3){
                    res.push(temp);
                    temp = [];
                }
                temp.push(year + i);
            }
            res.push(temp);
            return res;
        }

        // 获取周一到周日的名字
        function dayNames(startingDay){
            var shortDays = angular.copy(FORMATS.SHORTDAY).map(function (day) {
                return day
            });
            var delDays = shortDays.splice(0,startingDay);
            return shortDays.concat(delDays);
        }
        // 根据日期获取当月的所有日期
        function getDays(date){
            var dayRows = [];
            var currentYear = date.getFullYear();
            var currentMonth = date.getMonth();
            // 添加当月之前的天数
            var firstDayOfMonth = createDate(currentYear,currentMonth,1);
            var day =  firstDayOfMonth.getDay();
            var len = day>=self.startingDay?day-self.startingDay:(7-self.startingDay+day);
            for(var i= 0;i<len;i++){
                pushDay(dayRows,dayBefore(firstDayOfMonth,len-i));
            }
            // 添加本月的天
            var lastDayOfMonth = getLastDayOfMonth(currentYear,currentMonth);
            var tempDay;
            for(var j= 1;j<=lastDayOfMonth;j++){
                tempDay = createDate(currentYear,currentMonth,j);
                pushDay(dayRows,tempDay);
            }
            // 补全本月之后的天
            len = 7 - dayRows[dayRows.length-1].length;
            for(var k=1;k<=len;k++){
                pushDay(dayRows,dayAfter(tempDay,k));
            }
            return dayRows;
        }
        // 存储计算出的日期
        function pushDay(dayRows,date){
            var hasInsert = false;
            angular.forEach(dayRows, function (row) {
                if(row && row.length<7){
                    row.push(formatDate(date));
                    hasInsert = true;
                }
            });
            if(hasInsert){
                return;
            }
            dayRows.push([formatDate(date)]);
        }
        // 根据日期date获取gapDay之后的日期
        function dayAfter(date,gapDay){
            gapDay = gapDay || 1;
            var time = date.getTime();
            time += gapDay * 24 * 60 * 60 * 1000;
            return new Date(time);
        }
        // 根据日期date获取gapDay之前几天的日期
        function dayBefore(date,gapDay){
            gapDay = gapDay || 1;
            var time = date.getTime();
            time -= gapDay * 24 * 60 * 60 * 1000;
            return new Date(time);
        }
        //获取一个月里最后一天是几号
        function getLastDayOfMonth(year,month){
            var months = MONTH_DAYS.slice(0);
            if(year % 100===0 && year % 400===0 || year % 100 !==0&& year % 4===0){
                months[1] = 29;
            }
            return months[month];
        }
        //创建日期
        function createDate(year, month, day){
            var date = new Date();
            date.setFullYear(year);
            date.setMonth(month || 0);
            date.setDate(day || 1);
            return date;
        }
        //对日期进行格式化
        function formatDate(date){
            var tempDate = splitDate(date);
            var selectedDt = splitDate($scope.selectDate);
            var today = splitDate(new Date());
            var isToday =tempDate.year===today.year&&tempDate.month===today.month&&tempDate.day===today.day;
            var isSelected =tempDate.year===selectedDt.year&&tempDate.month===selectedDt.month
                &&tempDate.day===selectedDt.day;
            var isDisabled = ($scope.minDate && date.getTime()<$scope.minDate.getTime() && !isExceptionDay(date))
                || ($scope.maxDate && date.getTime()>$scope.maxDate.getTime() && !isExceptionDay(date));
            var day = date.getDay();
            return {
                date:date,
                year:tempDate.year,
                month:tempDate.month,
                day:tempDate.day,
                isWeekend:day===0||day===6,
                isToday:isToday,
                inMonth:tempDate.month===$scope.currentMonth,
                isNext:tempDate.month>$scope.currentMonth,
                isSelected:isSelected,
                isDisabled:isDisabled,
                index:tempDate.year+'-'+tempDate.month+'-'+tempDate.day
            }
        }
        function isExceptionDay(date){
            self.exceptions = [].concat(self.exceptions);
            var day1,day2 = splitDate(date);
            return self.exceptions.some(function (excepDay) {
                day1 = splitDate(excepDay);
                return day1.year === day2.year&&day1.month === day2.month&&day1.day === day2.day;
            });
        }
        function splitDate(date){
            return {
                year:date.getFullYear(),
                month:date.getMonth(),
                day:date.getDate()
            }
        }
    }])
    .directive('fuguCalendar', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/calendar.html',
            replace: true,
            require: ['fuguCalendar','ngModel'],
            scope: {
                minDate:'=?',
                maxDate:'=?',
                onChange:'&'
            },
            controller: 'fuguCalendarCtrl',
            link: function (scope, el, attrs, ctrls) {
                var calendarCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                calendarCtrl.init(ngModelCtrl);
            }
        }
    });
/**
 * datepicker
 * datepicker directive
 * Author: yjy972080142@gmail.com
 * Date:2016-03-21
 */
angular.module('ui.fugu.datepicker', ['ui.fugu.calendar'])
    .constant('fuguDatepickerConfig',{
        minDate: null, // 最小可选日期
        maxDate: null, // 最大可选日期
        exceptions:[],  // 不可选日期中的例外,比如3月份的日期都不可选,但是3月15日却是可选择的
        format:'yyyy-MM-dd hh:mm:ss a', // 日期格式化
        autoClose:true // 是否自动关闭面板
    })
    // 位置偏移
    .factory('fuguDatepickerOffset', ['$document', '$window', function ($document, $window) {
        return function (element) {
            var boundingClientRect = element[0].getBoundingClientRect();
            return {
                width: boundingClientRect.width || element.prop('offsetWidth'),
                height: boundingClientRect.height || element.prop('offsetHeight'),
                top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
            };
        };
    }])
    .service('fuguDatepickerService', ['$document', function($document) {
        var openScope = null;
        this.open = function(datepickerScope) {
            if (!openScope) {
                $document.on('click', closeDatepicker);
            }
            if (openScope && openScope !== datepickerScope) {
                openScope.showCalendar = false;
            }
            openScope = datepickerScope;
        };

        this.close = function(datepickerScope) {
            if (openScope === datepickerScope) {
                openScope = null;
                $document.off('click', closeDatepicker);
            }
        };

        function closeDatepicker(evt) {
            if (!openScope) { return; }
            var panelElement = openScope.getCanledarElement();
            var toggleElement = openScope.getToggleElement();
            if(panelElement && panelElement[0].contains(evt.target) ||
                toggleElement && toggleElement[0].contains(evt.target) ||
                angular.element(evt.target).hasClass('fugu-cal-day-inner') || // 选择下一个月的时候,会重新绘制日历面板,contains方法无效
                angular.element(evt.target).hasClass('fugu-cal-day')
            ){
                return;
            }
            openScope.showCalendar = false;
            openScope.$apply();
        }

    }])
    .controller('fuguDatepickerCtrl', ['$scope','$window', '$element','$attrs','$log','dateFilter','fuguDatepickerOffset','fuguDatepickerService','fuguDatepickerConfig',
        function ($scope,$window,$element, $attrs,$log,dateFilter,fuguDatepickerOffset,fuguDatepickerService,fuguDatepickerConfig) {
        var ngModelCtrl = {$setViewValue: angular.noop};
        var self = this;
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            ngModelCtrl.$formatters.unshift(function (modelValue) {
                return modelValue ? new Date(modelValue) : null;
            });
        };
        $scope.showCalendar = false;
        this.toggle = function(open) {
            $scope.showCalendar = arguments.length ? !!open : !$scope.showCalendar;
            if($scope.showCalendar){
                $scope.$$postDigest(function () {
                    adjuestPosition();
                });
            }
        };
        function adjuestPosition(){
            var offset = fuguDatepickerOffset($element);

            var left = offset.left + offset.width;
            var top = offset.top;
            var right = window.innerWidth - left;
            var bottom = window.innerHeight - top - offset.height;

            var calendar = angular.element($element[0].querySelector('.fugu-calendar'));

            calendar.removeClass('fugu-datepicker-cal-left ' +
                'fugu-datepicker-cal-right' +
                'fugu-datepicker-cal-top' +
                'fugu-datepicker-cal-bottom');

            if(left < calendar[0].clientWidth && right > calendar[0].clientWidth){
                calendar.addClass('fugu-datepicker-cal-right');
            }else{
                calendar.addClass('fugu-datepicker-cal-left');
            }
            if(top > calendar[0].clientHeight && bottom < calendar[0].clientHeight){
                calendar.addClass('fugu-datepicker-cal-top');
            }else{
                calendar.addClass('fugu-datepicker-cal-bottom');
            }
        }
        this.showCalendar = function() {
            return $scope.showCalendar;
        };
        angular.forEach(['exceptions','clearBtn'], function(key) {
            $scope[key] = angular.isDefined($attrs[key]) ? angular.copy($scope.$parent.$eval($attrs[key])) : fuguDatepickerConfig[key];
        });

        var format = angular.isDefined($attrs.format) ? $scope.$parent.$eval($attrs.format) : fuguDatepickerConfig.format;

        this.render = function () {
            var date = ngModelCtrl.$modelValue;
            if (isNaN(date)) {
                $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
            } else {
                $scope.selectDate = ngModelCtrl.$modelValue;
                $scope.inputValue = dateFilter(date,format);
            }
        };
        // 显示隐藏日历
        $scope.toggleCalendarHandler  = function (evt) {
            $element.find('input')[0].blur();
            if(evt){
                evt.preventDefault();
            }
            if (!$scope.isDisabled) {
                self.toggle();
            }
        };

        // 获取日历面板和被点击的元素
        $scope.getCanledarElement = function () {
            return angular.element($element[0].querySelector('.fugu-calendar'));
        };
        $scope.getToggleElement = function () {
            return angular.element($element[0].querySelector('.input-group'));
        };
        // 清除日期
        $scope.clearDateHandler = function () {
            $scope.inputValue = null;
            $scope.selectDate = null;
            ngModelCtrl.$setViewValue(null);
            ngModelCtrl.$render();
        };
        $scope.$watch('showCalendar', function(showCalendar) {
            if (showCalendar) {
                fuguDatepickerService.open($scope);
            } else {
                fuguDatepickerService.close($scope);
            }
        });

        var autoClose = angular.isDefined($attrs.autoClose) ? $scope.$parent.$eval($attrs.autoClose) : fuguDatepickerConfig.autoClose;
        // 选择日期
        $scope.changeDateHandler = function (date) {
            $scope.inputValue = dateFilter(date,format);
            $scope.selectDate = date;
            if(autoClose){
                self.toggle();
            }
            ngModelCtrl.$setViewValue(date);
            ngModelCtrl.$render();
        };
        $scope.$on('$locationChangeSuccess', function() {
            $scope.showCalendar = false;
        });

    }])
    .directive('fuguDatepicker', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/datepicker.html',
            replace: true,
            require: ['fuguDatepicker','ngModel'],
            scope: {
                minDate:'=?',
                maxDate:'=?',
                placeholder:'@',
                isDisabled:'=?ngDisabled'
            },
            controller: 'fuguDatepickerCtrl',
            link: function (scope, el, attrs, ctrls) {
                var datepickerCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                datepickerCtrl.init(ngModelCtrl);
            }
        }
    });
/**
 * dropdown
 * 多列下拉按钮组指令
 * Author:yangjiyuan@meituan.com
 * Date:2015-12-28
 */
angular.module('ui.fugu.dropdown',[])
.constant('fuguDropdownConfig', {
    eachItemWidth: 120, //每一个项目的宽度
    openClass:'open', //打开dropdown的calss
    multiColClass: 'fugu-dropdown' //控制多列显示的calss
})
.provider('fuguDropdown', function () {
    var _colsNum = 3;
    this.setColsNum = function (num) {
        _colsNum = num || 3;
    };
    this.$get  = function () {
        return {
            getColsNum: function () {
                return _colsNum;
            }
        }
    }
})
.service('fuguDropdownService', ['$document', function($document) {
    var openScope = null;
    this.open = function(dropdownScope) {
        if (!openScope) {
            $document.on('click', closeDropdown);
        }
        if (openScope && openScope !== dropdownScope) {
            openScope.isOpen = false;
        }
        openScope = dropdownScope;
    };

    this.close = function(dropdownScope) {
        if (openScope === dropdownScope) {
            openScope = null;
            $document.off('click', closeDropdown);
        }
    };

    function closeDropdown(evt) {
        if (!openScope) { return; }
        var toggleElement = openScope.getToggleElement();
        if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
            return;
        }
        openScope.isOpen = false;
        openScope.$apply();
    }

}])
.controller('fuguDropdownCtrl',['$scope','$rootScope','$element','fuguDropdownConfig','fuguDropdownService','fuguDropdown', function ($scope,$rootScope,$element,fuguDropdownConfig,fuguDropdownService,fuguDropdownProvider) {
    $scope.colsNum = fuguDropdownProvider.getColsNum();
    $scope.eachItemWidth = fuguDropdownConfig.eachItemWidth;
    $scope.openClass = fuguDropdownConfig.openClass;
    $scope.multiColClass = fuguDropdownConfig.multiColClass;

    var _this = this;

    $scope.toggleDropdown = function (event) {
        event.preventDefault();
        if (!$scope.isDisabled) {
            _this.toggle();
        }
    };
    this.toggle = function(open) {
        var result = $scope.isOpen = arguments.length ? !!open : !$scope.isOpen;
        return result;
    };
    this.isOpen = function() {
        return $scope.isOpen;
    };
    this.init = function () {
        $scope.isDisabled = $scope.isDisabled || !!$element.attr('disabled') || $element.hasClass('disabled');
    };

    $scope.$watch('isOpen', function(isOpen) {
        if (isOpen) {
            fuguDropdownService.open($scope);
        } else {
            fuguDropdownService.close($scope);
        }
    });
    $scope.getToggleElement = function () {
        return $element.find('.dropdown-toggle');
    };
    $scope.count = 0;
    this.addChild = function () {
        $scope.count ++;
        if($scope.count>$scope.colsNum){
            $element.find('.dropdown-menu > li').css('width',100/$scope.colsNum+'%');
        }
    };

    $scope.$on('$locationChangeSuccess', function() {
        $scope.isOpen = false;
    });
}])
.directive('fuguDropdown',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/dropdown.html',
        replace:true,
        require:'^fuguDropdown',
        transclude:true,
        scope:{
            isOpen:'=?',
            isDisabled:'=?ngDisabled',
            btnValue:'@?'
        },
        controller:'fuguDropdownCtrl',
        link: function (scope,el,attrs,fuguDropdownCtrl) {
            fuguDropdownCtrl.init();
        }
    }
})
.directive('fuguDropdownChoices',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/dropdown-choices.html',
        require:'^fuguDropdown',
        replace:true,
        transclude:true,
        scope:true,
        link: function (scope,el,attrs,fuguDropdownCtrl) {
            fuguDropdownCtrl.addChild();
        }
    }
});
/**
 * modal
 * modal directive
 * 不太会写,基本是照搬的 ui-bootstrap v0.12.1 https://github.com/angular-ui/bootstrap/blob/0.12.1/src/modal/modal.js
 * 先抄着,后面再写吧,心好累
 *
 * Author: yjy972080142@gmail.com
 * Date:2016-03-23
 */
angular.module('ui.fugu.modal', [])
    /**
     * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
     */
    .factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

        var $transition = function(element, trigger, options) {
            options = options || {};
            var deferred = $q.defer();
            var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

            function transitionEndHandler(){
                $rootScope.$apply(function() {
                    element.unbind(endEventName, transitionEndHandler);
                    deferred.resolve(element);
                });
            }

            if (endEventName) {
                element.bind(endEventName, transitionEndHandler);
            }

            // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
            $timeout(function() {
                if ( angular.isString(trigger) ) {
                    element.addClass(trigger);
                } else if ( angular.isFunction(trigger) ) {
                    trigger(element);
                } else if ( angular.isObject(trigger) ) {
                    element.css(trigger);
                }
                //If browser does not support transitions, instantly resolve
                if ( !endEventName ) {
                    deferred.resolve(element);
                }
            });

            // Add our custom cancel function to the promise that is returned
            // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
            // i.e. it will therefore never raise a transitionEnd event for that transition
            deferred.promise.cancel = function() {
                if ( endEventName ) {
                    element.unbind(endEventName, transitionEndHandler);
                }
                deferred.reject('Transition cancelled');
            };

            return deferred.promise;
        };

        // Work out the name of the transitionEnd event
        var transElement = document.createElement('trans');
        var transitionEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'transition': 'transitionend'
        };
        var animationEndEventNames = {
            'WebkitTransition': 'webkitAnimationEnd',
            'MozTransition': 'animationend',
            'OTransition': 'oAnimationEnd',
            'transition': 'animationend'
        };
        function findEndEventName(endEventNames) {
            for (var name in endEventNames){
                if (!angular.isUndefined(transElement.style[name])) {
                    return endEventNames[name];
                }
            }
        }
        $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
        $transition.animationEndEventName = findEndEventName(animationEndEventNames);
        return $transition;
    }])
    /**
     * A helper, internal data structure that acts as a map but also allows getting / removing
     * elements in the LIFO order
     */
    .factory('$$stackedMap', function () {
        return {
            createNew: function () {
                var stack = [];

                return {
                    add: function (key, value) {
                        stack.push({
                            key: key,
                            value: value
                        });
                    },
                    get: function (key) {
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                return stack[i];
                            }
                        }
                    },
                    keys: function() {
                        var keys = [];
                        for (var i = 0; i < stack.length; i++) {
                            keys.push(stack[i].key);
                        }
                        return keys;
                    },
                    top: function () {
                        return stack[stack.length - 1];
                    },
                    remove: function (key) {
                        var idx = -1;
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                idx = i;
                                break;
                            }
                        }
                        return stack.splice(idx, 1)[0];
                    },
                    removeTop: function () {
                        return stack.splice(stack.length - 1, 1)[0];
                    },
                    length: function () {
                        return stack.length;
                    }
                };
            }
        };
    })

    /**
     * A helper directive for the $fgModal service. It creates a backdrop element.
     */
    .directive('fuguModalBackdrop', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/backdrop.html',
            link: function (scope, element, attrs) {
                scope.backdropClass = attrs.backdropClass || '';

                scope.animate = false;

                //trigger CSS transitions
                $timeout(function () {
                    scope.animate = true;
                });
            }
        };
    }])

    .directive('fuguModalWindow', ['$fgModalStack', '$timeout', function ($fgModalStack, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                index: '@',
                animate: '='
            },
            replace: true,
            transclude: true,
            templateUrl: 'templates/window.html',
            link: function (scope, element, attrs) {
                element.addClass(attrs.windowClass || '');
                scope.size = attrs.size;

                $timeout(function () {
                    // trigger CSS transitions
                    scope.animate = true;

                    /**
                     * Auto-focusing of a freshly-opened modal element causes any child elements
                     * with the autofocus attribute to lose focus. This is an issue on touch
                     * based devices which will show and then hide the onscreen keyboard.
                     * Attempts to refocus the autofocus element via JavaScript will not reopen
                     * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                     * the modal element if the modal does not contain an autofocus element.
                     */
                    if (!element[0].querySelectorAll('[autofocus]').length) {
                        element[0].focus();
                    }
                });

                scope.close = function (evt) {
                    var modal = $fgModalStack.getTop();
                    if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $fgModalStack.dismiss(modal.key, 'backdrop click');
                    }
                };
            }
        };
    }]) /// TODO 修改变量

    .directive('fuguModalTransclude', function () {
        return {
            link: function($scope, $element, $attrs, controller, $transclude) {
                // TODO 这个$transclude是自动注入的吗?
                $transclude($scope.$parent, function(clone) {
                    $element.empty();
                    $element.append(clone);
                });
            }
        };
    })

    .factory('$fgModalStack', ['$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
        function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {

            var OPENED_MODAL_CLASS = 'modal-open';

            var backdropDomEl, backdropScope;
            var openedWindows = $$stackedMap.createNew();
            var $fgModalStack = {};

            function backdropIndex() {
                var topBackdropIndex = -1;
                var opened = openedWindows.keys();
                for (var i = 0; i < opened.length; i++) {
                    if (openedWindows.get(opened[i]).value.backdrop) {
                        topBackdropIndex = i;
                    }
                }
                return topBackdropIndex;
            }

            $rootScope.$watch(backdropIndex, function(newBackdropIndex){
                if (backdropScope) {
                    backdropScope.index = newBackdropIndex;
                }
            });

            function removeModalWindow(modalInstance) {

                var body = $document.find('body').eq(0);
                var modalWindow = openedWindows.get(modalInstance).value;
                //clean up the stack
                openedWindows.remove(modalInstance);

                //remove window DOM element
                removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function() {
                    modalWindow.modalScope.$destroy();
                    body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
                    checkRemoveBackdrop();
                });
            }

            function checkRemoveBackdrop() {
                //remove backdrop if no longer needed
                if (backdropDomEl && backdropIndex() == -1) {
                    var backdropScopeRef = backdropScope;
                    removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
                        backdropScopeRef.$destroy();
                        backdropScopeRef = null;
                    });
                    backdropDomEl = null;
                    backdropScope = null;
                }
            }

            function removeAfterAnimate(domEl, scope, emulateTime, done) {
                // Closing animation
                scope.animate = false;

                var transitionEndEventName = $transition.transitionEndEventName;
                if (transitionEndEventName) {
                    // transition out
                    var timeout = $timeout(afterAnimating, emulateTime);

                    domEl.bind(transitionEndEventName, function () {
                        $timeout.cancel(timeout);
                        afterAnimating();
                        scope.$apply();
                    });
                } else {
                    // Ensure this call is async
                    $timeout(afterAnimating);
                }

                function afterAnimating() {
                    if (afterAnimating.done) {
                        return;
                    }
                    afterAnimating.done = true;

                    domEl.remove();
                    if (done) {
                        done();
                    }
                }
            }

            $document.bind('keydown', function (evt) {
                var modal;
                // 点击ESC关闭
                if (evt.which === 27) {
                    modal = openedWindows.top();
                    if (modal && modal.value.keyboard) {
                        evt.preventDefault();
                        $rootScope.$apply(function () {
                            $fgModalStack.dismiss(modal.key, 'escape key press');
                        });
                    }
                }
            });

            $fgModalStack.open = function (modalInstance, modal) {

                openedWindows.add(modalInstance, {
                    deferred: modal.deferred,
                    modalScope: modal.scope,
                    backdrop: modal.backdrop,
                    keyboard: modal.keyboard
                });

                var body = $document.find('body').eq(0),
                    currBackdropIndex = backdropIndex();

                // 保证只会插入一次蒙版
                if (currBackdropIndex >= 0 && !backdropDomEl) {
                    backdropScope = $rootScope.$new(true);
                    backdropScope.index = currBackdropIndex;
                    var angularBackgroundDomEl = angular.element('<div fugu-modal-backdrop></div>');
                    angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
                    backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
                    body.append(backdropDomEl);
                }

                var angularDomEl = angular.element('<div fugu-modal-window></div>');
                angularDomEl.attr({
                    'window-class': modal.windowClass,
                    'size': modal.size,
                    'index': openedWindows.length() - 1,
                    'animate': 'animate'
                }).html(modal.content);
                var modalDomEl = $compile(angularDomEl)(modal.scope);
                openedWindows.top().value.modalDomEl = modalDomEl;
                body.append(modalDomEl);
                body.addClass(OPENED_MODAL_CLASS);
            };

            $fgModalStack.close = function (modalInstance, result) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.deferred.resolve(result);
                    removeModalWindow(modalInstance);
                }
            };

            $fgModalStack.dismiss = function (modalInstance, reason) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.deferred.reject(reason);
                    removeModalWindow(modalInstance);
                }
            };

            $fgModalStack.dismissAll = function (reason) {
                var topModal = this.getTop();
                while (topModal) {
                    this.dismiss(topModal.key, reason);
                    topModal = this.getTop();
                }
            };

            $fgModalStack.getTop = function () {
                return openedWindows.top();
            };

            return $fgModalStack;
        }])

    .provider('$fgModal', function () {
        var self = this;
        this.options = {
            backdrop: true, //can be also false or 'static'
            keyboard: true
        };
        this.$get = ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$fgModalStack',
            function ($injector, $rootScope, $q, $http, $templateCache, $controller, $fgModalStack) {
                /**
                 * 获取模板
                 * @param options - 配置信息
                 * @returns {*|Promise}
                 */
                function getTemplatePromise(options) {
                    return options.template ? $q.when(options.template) :
                        $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                            {cache: $templateCache})
                        .then(function (result) {
                                return result.data;
                            });
                }

                /**
                 * TODO 不明白是干啥的,好像是获取modalInstance依赖的
                 * @param resolves
                 * @returns {Array}
                 */
                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    angular.forEach(resolves, function (value) {
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));
                        }
                    });
                    return promisesArr;
                }
                return {
                    open: function (modalOptions) {
                        var modalResultDeferred = $q.defer();
                        var modalOpenedDeferred = $q.defer();

                        //prepare an instance of a modal to be injected into controllers and returned to a caller
                        var modalInstance = {
                            result: modalResultDeferred.promise,
                            opened: modalOpenedDeferred.promise,
                            close: function (result) {
                                $fgModalStack.close(modalInstance, result);
                            },
                            dismiss: function (reason) {
                                $fgModalStack.dismiss(modalInstance, reason);
                            }
                        };

                        //merge and clean up options
                        modalOptions = angular.extend({}, self.options, modalOptions);
                        modalOptions.resolve = modalOptions.resolve || {};

                        //verify options
                        if (!modalOptions.template && !modalOptions.templateUrl) {
                            throw new Error('One of template or templateUrl options is required.');
                        }

                        var templateAndResolvePromise =
                            $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));

                        templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
                            var modalScope = (modalOptions.scope || $rootScope).$new();
                            modalScope.$close = modalInstance.close;
                            modalScope.$dismiss = modalInstance.dismiss;

                            var ctrlInstance, ctrlLocals = {};
                            var resolveIter = 1;

                            //controllers
                            if (modalOptions.controller) {
                                // 使用$controller创建controller并注入$scope,$fgModalInstance和resolve
                                ctrlLocals.$scope = modalScope;
                                ctrlLocals.$fgModalInstance = modalInstance;
                                angular.forEach(modalOptions.resolve, function (value, key) {
                                    ctrlLocals[key] = tplAndVars[resolveIter++];
                                });

                                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                                if (modalOptions.controllerAs) {
                                    modalScope[modalOptions.controllerAs] = ctrlInstance;
                                }
                            }
                            $fgModalStack.open(modalInstance, {
                                scope: modalScope,
                                deferred: modalResultDeferred,
                                content: tplAndVars[0],
                                backdrop: modalOptions.backdrop,
                                keyboard: modalOptions.keyboard,
                                backdropClass: modalOptions.backdropClass,
                                windowClass: modalOptions.windowClass,
                                size: modalOptions.size
                            });

                        }, function resolveError(reason) {
                            modalResultDeferred.reject(reason);
                        });

                        templateAndResolvePromise.then(function () {
                            modalOpenedDeferred.resolve(true);
                        }, function () {
                            modalOpenedDeferred.reject(false);
                        });

                        return modalInstance;
                    }
                };
            }];
    });


/**
 * notification
 * 通知指令
 * Author:penglu02@meituan.com
 * Date:2016-03-22
 */
angular.module('ui.fugu.notification', ['ui.fugu.alert'])
    .service('notificationServices', ['$sce', '$interval', '$interpolate', '$document', '$compile', '$rootScope', function($sce, $interval, $interpolate, $document, $compile, $rootScope){
        var self = this;
        this.directive = {};

        function initNotification(){
            var body = $document.find('body').eq(0),
                noticeScope = $rootScope.$new(true),
                noticeEle = angular.element('<div fugu-notice></div>');
            body.append($compile(noticeEle)(noticeScope));
        }
        initNotification();  // 初始化组件

        this.initDirective = function () {
            this.directive.notifications = [];
            return this.directive;
        };

        this.addNotifications = function(notification){
            var notifications, unique = true, notificationText;

            // 错误类型处理
            if (notification.type === 'error') {
                notification.type = 'danger';
            }
            // 内容处理
            notification.text = $interpolate(notification.text)(notification.variables);  //{{}}插值解析

            // TODO:使用alert不存在ng-bind-html，因此不需要对其进行特殊处理
            //notification.text = $sce.trustAsHtml(String( notification.text));   // html内容处理，用于ng-bind-html等

            notifications = this.directive.notifications;

            // 提示信息是否不重复,this.unique在provider中设置
            if(this.unique){
                angular.forEach(notifications, function(notify){
                    notificationText = notify.text;

                    //// 处理内容获取:trustAsHtml与getTrustedHtml对变量进行了一次包裹
                    //notificationText = $sce.getTrustedHtml(notify.text);

                    // 通过对比:提示内容，提示类型，提示标题来判断两个通知是否相同
                    if(notification.text === notificationText && notification.title === notify.title && notification.type === notify.type){
                        unique = false;
                    }
                });
                if(!unique){
                    return;
                }
            }

            if(notification.duration && notification.duration !== -1){ // 设置持续显示时间,-1表示一直显示
                //  持续时间之后直接删除
                $interval(angular.bind(this, function(){
                    self.deleteNotifications(notification);
                }), notification.duration, 1);
            }

            // 如果有长度限制，则移除超过长度的
            if(this.limitNum !== -1){
                var diff = notifications.length - (this.limitNum - 1);
                if(diff > 0){
                    notifications.splice(0, diff);
                }
            }
            notifications.push(notification); //插入新数值
            return notification;
        };


        /**
         * 删除传入通知对象
         * @param {object} notification
         */
        this.deleteNotifications = function(notification){
            var notifications = this.directive.notifications, //获取所有通知
                index = notifications.indexOf(notification);
            if(index !== -1){
                notifications.splice(index, 1); //删除
            }
        }
    }])
    .controller('notificationController', ['$scope', '$interval', 'notification', 'notificationServices', function($scope, $interval, notification, notificationServices){
        notificationServices.initDirective();
        $scope.notifications = notificationServices.directive.notifications;

        $scope.closeFn = function(notification){
            notificationServices.deleteNotifications(notification);
        }
    }])
    .directive('fuguNotice', [function(){
        return {
            restrict: 'A',
            replace: false,
            scope: {},
            templateUrl: 'templates/notification.html',
            controller: 'notificationController'
        }
    }])
    .provider('notification', [function(){
        // private variables
        var _types = {
                success: null,
                error: null,
                warning: null,
                info: null
            },
            _unique = true,
            _disableCloseBtn = false,
            _disableIcon = false,
            _limitNum = -1; // 默认不限制显示条数


        // this绑定的方法是可以在注入之前进行调用设置
        /**
         * 设置通知全局持续显示时间
         * @param {number} duration 持续时间毫秒,如果为-1则表示一直显示
         */
        this.globalDurationTime = function (duration){
            if(typeof duration === 'object'){
                // 以对象的形式分开设置持续时间
                for (var key in duration){
                    if(duration.hasOwnProperty(key)){
                        _types[key] = duration[key];
                    }
                }
            } else {
                // 统一设置
                for(var type in _types){
                    if(_types.hasOwnProperty(type)) {
                        _types[type] = duration;
                    }
                }
            }
            return this;
        };

        /**
         * 统一配置是否显示关闭按钮
         * @param {boolean} disableCloseBtn
         * @returns {*}
         */
        this.globalDisableCloseBtn = function (disableCloseBtn){
            _disableCloseBtn = disableCloseBtn;
            return this;
        };

        /**
         * 统一配置是否显示图标
         * @param {boolean} disableIcon
         * @returns {*}
         */
        this.globalDisableIcon = function (disableIcon) {
            _disableIcon = disableIcon;
            return this;
        };


        /**
         * 统一配置提示框是否重复显示
         * @param {boolean} unique
         * @returns {*}
         */
        this.globalUnique = function(unique) {
            _unique = unique;
            return this;
        };

        this.globalLimitNum = function(limitNum) {
            if(limitNum > 0){
                _limitNum = limitNum;
            }
            return this;
        };


        // $get方法返回的内容,注入的时候可以获取
        this.$get = [
            '$rootScope',
            '$interpolate',
            '$sce',
            '$filter',
            '$interval',
            'notificationServices',
            function ($rootScope, $interpolate, $sce, $filter, $interval, notificationServices) {
                notificationServices.unique = _unique;  //根据当前配置，设置显示的唯一性(统一)
                notificationServices.limitNum = _limitNum;  //根据当前配置，设置显示条数限制

                function sendNotification(text, config, type) {
                    var _config = config || {}, notification, addNotification;

                    // 组装新添加通知信息
                    notification = {
                        text: text,
                        type: type,
                        duration: _config.duration || _types[type],
                        disableCloseBtn: angular.isDefined(_config.disableCloseBtn) ? _config.disableCloseBtn : _disableCloseBtn,
                        disableIcon: angular.isDefined(_config.disableIcon) ? _config.disableIcon : _disableIcon,
                        variables: _config.variables || {},   // 解析text中{{}}中变量
                        destory: function () {
                            notificationServices.deleteNotifications(notification);
                        },
                        setText: function (newText) {
                            //// 对内容进行包裹用于ng-bind-html显示,后期使用getTrustedHtml获取
                            //this.text = $sce.trustAsHtml(String(newText));

                            this.text = newText;
                        }
                    };

                    addNotification = notificationServices.addNotifications(notification);
                    return addNotification;
                }

                function warning(text, config){
                    return sendNotification(text, config, 'warning');
                }

                function error(text, config){
                    return sendNotification(text, config, 'error');
                }

                function info(text, config){
                    return sendNotification(text, config, 'info');
                }

                function success(text, config){
                    return sendNotification(text, config, 'success');
                }

                function common(text, config, type){
                    var noticeType = type ? type.toLowerCase() : 'error';  // 默认为‘error’提示框
                    return sendNotification(text, config, noticeType);
                }

                return {
                    warning: warning,
                    error: error,
                    info: info,
                    success: success,
                    common: common
                };
            }
        ];
    }]);

angular.module('ui.fugu.pager',[])
.constant('fuguPagerConfig', {
    itemsPerPage: 20, //默认每页数目为20
    maxSize:5, //默认分页最大显示数目为5
    firstText:'首页',
    lastText:'尾页',
    previousText:'上一页',
    nextText:'下一页'
})
.controller('fuguPagerCtrl',['$scope', function ($scope) {

    var pageOffset = 0,
        initialized = false;

    this.init = function (fuguPagerConfig) {
        $scope.itemsPerPage = $scope.itemsPerPage || fuguPagerConfig.itemsPerPage;
        $scope.maxSize = $scope.maxSize || fuguPagerConfig.maxSize;
        $scope.getText = function (key){
            return $scope[key + 'Text'] || fuguPagerConfig[key + 'Text'];
        };
    };

    $scope.pages = [];
    $scope.currentPage = 0;
    $scope.totalPages = 1;

    $scope.$watch('pageNo', function (val) {
        $scope.selectPage(val-1 || 0)
    });
    $scope.$watch("totalItems", function (val) {
        if($scope.currentPage === -1){
            return;
        }
        $scope.totalPages = Math.ceil(val / $scope.itemsPerPage);
        if ($scope.totalPages <= 0 || isNaN($scope.totalPages)) {
            $scope.totalPages = 1;
        }
        if (initialized) {
            if (pageOffset > $scope.totalPages) {
                pageOffset = 0;
                if ($scope.currentPage < pageOffset
                    || $scope.currentPage >= pageOffset + $scope.pages.length) {
                    $scope.currentPage = 0;
                }
            }
        }
        resetPageList();
        initialized = true;
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = true;
        }
        $scope.selectPage($scope.currentPage);
    });

    function getOffset(page) {
        var offset = Math.min(page - Math.floor($scope.maxSize / 2), $scope.totalPages - $scope.maxSize);
        if (offset < 0 || isNaN(offset)) {
            offset = 0;
        }
        return offset;
    }

    function resetPageList() {
        $scope.pages = [];
        var last = Math.min(pageOffset + $scope.maxSize, $scope.totalPages),i;
        for (i = pageOffset; i < last; i++) {
            $scope.pages.push({
                text: i,
                pageIndex: i,
                active: false
            });
        }
    }

    $scope.isFirst = function () {
        return $scope.currentPage <= 0;
    };

    $scope.isLast = function () {
        return $scope.currentPage >= $scope.totalPages - 1;
    };

    $scope.selectPage = function (value) {
        if (value >= $scope.totalPages || value < 0) {
            return;
        }
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = false;
        }
        var offset = getOffset(value),oldPage = $scope.currentPage;
        if (offset != pageOffset) {
            pageOffset = offset;
            resetPageList();
        }
        $scope.currentPage = value;
        $scope.pageNo = value+1;
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = true;
            $scope.$emit("pager:pageIndexChanged", $scope.pages[$scope.currentPage - pageOffset]);
        }
        var fn;
        if(angular.isDefined($scope.pageChanged) && oldPage !== $scope.currentPage){
            fn = $scope.pageChanged();
            if(fn && typeof fn === 'function'){
                fn($scope.currentPage+1);
            }
        }
    };

    $scope.first = function () {
        if ($scope.isFirst()) {
            return;
        }
        this.selectPage(0);
    };

    $scope.last = function () {
        if ($scope.isLast()) {
            return;
        }
        this.selectPage($scope.totalPages - 1);
    };

    $scope.previous = function () {
        if ($scope.isFirst()) {
            return;
        }
        this.selectPage($scope.currentPage - 1);
    };

    $scope.next = function () {
        if ($scope.isLast()) {
            return;
        }
        this.selectPage($scope.currentPage + 1);
    };
}])
.directive('fuguPager', ['fuguPagerConfig', function (fuguPagerConfig) {
    return {
        restrict: 'E',
        templateUrl:'templates/pager.html',
        replace:true,
        require:'fuguPager',
        scope:{
            itemsPerPage:'=?',
            totalItems:'=',
            pageNo:'=',
            maxSize:'=?',
            firstText:'@?',
            lastText:'@?',
            previousText:'@?',
            nextText:'@?',
            pageChanged:'&?'
        },
        controller:'fuguPagerCtrl',
        link: function (scope,el,attrs,fuguPagerCtrl) {
            fuguPagerCtrl.init(fuguPagerConfig);
        }
    }
}]);
/**
 * searchBox
 * 搜索框
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-25
 */
angular.module('ui.fugu.searchBox',[])
.constant('fuguSearchBoxConfig', {
    btnText: '搜索', // 默认搜索按钮文本
    showBtn: true   // 默认显示按钮
})
.controller('fuguSearchBoxCtrl',['$scope','$attrs','fuguSearchBoxConfig', function ($scope,$attrs,fuguSearchBoxConfig) {
    var ngModelCtrl = { $setViewValue: angular.noop };
    $scope.searchBox = {};
    this.init = function (_ngModelCtrl) {
        if(_ngModelCtrl){
            ngModelCtrl = _ngModelCtrl;
        }
        ngModelCtrl.$render = this.render;
        $scope.showBtn = angular.isDefined($attrs.showBtn) ? $scope.$parent.$eval($attrs.showBtn) : fuguSearchBoxConfig.showBtn;
    };
    var btnText;
    $scope.getText = function () {
        if(btnText){
            return btnText;
        }
        btnText = angular.isDefined($attrs.btnText) ? $attrs.btnText : fuguSearchBoxConfig.btnText;
        return btnText;
    };
    $scope.$watch('searchBox.query', function (val) {
        ngModelCtrl.$setViewValue(val);
        ngModelCtrl.$render();
    });
    $scope.keyUpToSearch = function (evt) {
        if (evt && evt.keyCode === 13) {
            evt.preventDefault();
            evt.stopPropagation();
            $scope.doSearch();
        }
    };
    $scope.doSearch = function () {
        if(angular.isDefined($scope.search) && typeof $scope.search === 'function'){
            $scope.search();
        }
    };
    this.render = function() {
        if(ngModelCtrl.$viewValue){
            $scope.searchBox.query = ngModelCtrl.$viewValue;
        }
    };
}])
.directive('fuguSearchBox',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/searchBox.html',
        replace:true,
        require:['fuguSearchBox', '?ngModel'],
        scope:{
            btnText:'@?',
            showBtn:'=?',
            placeholder:'@?',
            search:'&?'
        },
        controller:'fuguSearchBoxCtrl',
        link: function (scope,el,attrs,ctrls) {
            var searchBoxCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            searchBoxCtrl.init(ngModelCtrl);
        }
    }
});
/**
 * select
 * select directive
 * Author: yjy972080142@gmail.com
 * Date:2016-03-29
 */
angular.module('ui.fugu.select', [])
    .constant('fuguSelectConfig', {
        KEY: {
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            HOME: 36,
            END: 35,
            BACKSPACE: 8,
            DELETE: 46,
            COMMAND: 91,
            MAP: {
                91: "COMMAND",
                8: "BACKSPACE",
                9: "TAB",
                13: "ENTER",
                16: "SHIFT",
                17: "CTRL",
                18: "ALT",
                19: "PAUSEBREAK",
                20: "CAPSLOCK",
                27: "ESC",
                32: "SPACE",
                33: "PAGE_UP",
                34: "PAGE_DOWN",
                35: "END",
                36: "HOME",
                37: "LEFT",
                38: "UP",
                39: "RIGHT",
                40: "DOWN",
                43: "+",
                44: "PRINTSCREEN",
                45: "INSERT",
                46: "DELETE",
                48: "0",
                49: "1",
                50: "2",
                51: "3",
                52: "4",
                53: "5",
                54: "6",
                55: "7",
                56: "8",
                57: "9",
                59: ";",
                61: "=",
                65: "A",
                66: "B",
                67: "C",
                68: "D",
                69: "E",
                70: "F",
                71: "G",
                72: "H",
                73: "I",
                74: "J",
                75: "K",
                76: "L",
                77: "M",
                78: "N",
                79: "O",
                80: "P",
                81: "Q",
                82: "R",
                83: "S",
                84: "T",
                85: "U",
                86: "V",
                87: "W",
                88: "X",
                89: "Y",
                90: "Z",
                96: "0",
                97: "1",
                98: "2",
                99: "3",
                100: "4",
                101: "5",
                102: "6",
                103: "7",
                104: "8",
                105: "9",
                106: "*",
                107: "+",
                109: "-",
                110: ".",
                111: "/",
                112: "F1",
                113: "F2",
                114: "F3",
                115: "F4",
                116: "F5",
                117: "F6",
                118: "F7",
                119: "F8",
                120: "F9",
                121: "F10",
                122: "F11",
                123: "F12",
                144: "NUMLOCK",
                145: "SCROLLLOCK",
                186: ";",
                187: "=",
                188: ",",
                189: "-",
                190: ".",
                191: "/",
                192: "`",
                219: "[",
                220: "\\",
                221: "]",
                222: "'"
            },
            isControl: function (e) {
                var k = e.which;
                switch (k) {
                    case this.COMMAND:
                    case this.SHIFT:
                    case this.CTRL:
                    case this.ALT:
                        return true;
                }

                return e.metaKey;
            },
            isFunctionKey: function (k) {
                k = k.which ? k.which : k;
                return k >= 112 && k <= 123;
            },
            isVerticalMovement: function (k) {
                return [this.UP, this.DOWN].indexOf(k) !== -1;
            },
            isHorizontalMovement: function (k) {
                return [this.LEFT, this.RIGHT, this.BACKSPACE, this.DELETE].indexOf(k) !== -1;
            }
        },
        searchEnabled: true,
        sortable: false,
        placeholder: '', // Empty by default, like HTML tag <select>
        refreshDelay: 1000, // In milliseconds
        closeOnSelect: true,
        appendToBody: false
    })
    // 当指令传递参数等发生错误时抛出异常
    .service('fuguSelectMinErr', function () {
        var minErr = angular.$$minErr('ui.fugu.select');
        return function () {
            var error = minErr.apply(this, arguments);
            var str = '\nhttp://errors.angularjs.org/.*';
            var message = error.message.replace(new RegExp(str), '');
            return new Error(message);
        };
    })
    // 添加DOM节点到指定内
    .directive('fuguTranscludeAppend', function () {
        return {
            link: function (scope, element, attrs, ctrl, transclude) {
                transclude(scope, function (clone) {
                    element.append(clone);
                });
            }
        };
    })
    // 高亮文本过滤器
    .filter('highlight', function () {
        function escapeRegexp(queryToEscape) {
            return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        }

        return function (matchItem, query) {
            return query && matchItem ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="fugu-select-highlight">$&</span>') : matchItem;
        };
    })
    // 位置偏移
    .factory('fuguSelectOffset', ['$document', '$window', function ($document, $window) {
        return function (element) {
            var boundingClientRect = element[0].getBoundingClientRect();
            return {
                width: boundingClientRect.width || element.prop('offsetWidth'),
                height: boundingClientRect.height || element.prop('offsetHeight'),
                top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
            };
        };
    }])
    .controller('fuguSelectCtrl', ['$scope', '$element', '$timeout', '$filter', 'fuguSelectRepeatParser', 'fuguSelectMinErr', 'fuguSelectConfig',
        function ($scope, $element, $timeout, $filter, RepeatParser, fuguSelectMinErr, fuguSelectConfig) {
            var KEY = fuguSelectConfig.KEY;
            var ctrl = this;

            var EMPTY_SEARCH = '';

            ctrl.placeholder = fuguSelectConfig.placeholder;
            ctrl.searchEnabled = fuguSelectConfig.searchEnabled;
            ctrl.sortable = fuguSelectConfig.sortable;
            ctrl.refreshDelay = fuguSelectConfig.refreshDelay;

            ctrl.removeSelected = false; //If selected item(s) should be removed from dropdown list
            ctrl.closeOnSelect = true; //Initialized inside fuguSelect directive link function
            ctrl.search = EMPTY_SEARCH;

            ctrl.activeIndex = 0; //Dropdown of choices
            ctrl.items = []; //All available choices

            ctrl.open = false;
            ctrl.focus = false;
            ctrl.disabled = false;
            ctrl.selected = null;

            ctrl.focusser = null; //Reference to input element used to handle focus events
            ctrl.resetSearchInput = true;
            ctrl.multiple = null; // Initialized inside fuguSelect directive link function
            ctrl.disableChoiceExpression = null; // Initialized inside fuguSelectChoices directive link function
            ctrl.tagging = {isActivated: false, fct: null};
            ctrl.taggingTokens = {isActivated: false, tokens: null};
            ctrl.lockChoiceExpression = null; // Initialized inside fuguSelectMatch directive link function
            ctrl.clickTriggeredSelect = false;
            ctrl.$filter = $filter;

            ctrl.searchInput = angular.element($element[0].querySelectorAll('input.fugu-select-search'));
            if (ctrl.searchInput.length !== 1) {
                throw fuguSelectMinErr('searchInput', "Expected 1 input.fugu-select-search but got '{0}'.", ctrl.searchInput.length);
            }

            ctrl.isEmpty = function () {
                return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '';
            };

            // Most of the time the user does not want to empty the search input when in typeahead mode
            function _resetSearchInput() {
                if (ctrl.resetSearchInput || (!ctrl.resetSearchInput && fuguSelectConfig.resetSearchInput)) {
                    ctrl.search = EMPTY_SEARCH;
                    //reset activeIndex
                    if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
                        ctrl.activeIndex = ctrl.items.indexOf(ctrl.selected);
                    }
                }
            }

            function _groupsFilter(groups, groupNames) {
                var i, j, result = [];
                for (i = 0; i < groupNames.length; i++) {
                    for (j = 0; j < groups.length; j++) {
                        if (groups[j].name === [groupNames[i]]) {
                            result.push(groups[j]);
                        }
                    }
                }
                return result;
            }

            // When the user clicks on fugu-select, displays the dropdown list
            ctrl.activate = function (initSearchValue, avoidReset) {
                if (!ctrl.disabled && !ctrl.open) {
                    if (!avoidReset) {
                        _resetSearchInput();
                    }

                    $scope.$broadcast('fugus:activate');

                    ctrl.open = true;

                    ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;

                    // ensure that the index is set to zero for tagging variants
                    // that where first option is auto-selected
                    if (ctrl.activeIndex === -1 && ctrl.taggingLabel !== false) {
                        ctrl.activeIndex = 0;
                    }

                    // Give it time to appear before focus
                    $timeout(function () {
                        ctrl.search = initSearchValue || ctrl.search;
                        ctrl.searchInput[0].focus();
                    });
                }
            };

            ctrl.findGroupByName = function (name) {
                return ctrl.groups && ctrl.groups.filter(function (group) {
                        return group.name === name;
                    })[0];
            };

            ctrl.parseRepeatAttr = function (repeatAttr, groupByExp, groupFilterExp) {
                function updateGroups(items) {
                    var groupFn = $scope.$eval(groupByExp);
                    ctrl.groups = [];
                    angular.forEach(items, function (item) {
                        var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
                        var group = ctrl.findGroupByName(groupName);
                        if (group) {
                            group.items.push(item);
                        }
                        else {
                            ctrl.groups.push({name: groupName, items: [item]});
                        }
                    });
                    if (groupFilterExp) {
                        var groupFilterFn = $scope.$eval(groupFilterExp);
                        if (angular.isFunction(groupFilterFn)) {
                            ctrl.groups = groupFilterFn(ctrl.groups);
                        } else if (angular.isArray(groupFilterFn)) {
                            ctrl.groups = _groupsFilter(ctrl.groups, groupFilterFn);
                        }
                    }
                    ctrl.items = [];
                    ctrl.groups.forEach(function (group) {
                        ctrl.items = ctrl.items.concat(group.items);
                    });
                }

                function setPlainItems(items) {
                    ctrl.items = items;
                }

                ctrl.setItemsFn = groupByExp ? updateGroups : setPlainItems;

                ctrl.parserResult = RepeatParser.parse(repeatAttr);

                ctrl.isGrouped = !!groupByExp;
                ctrl.itemProperty = ctrl.parserResult.itemName;

                ctrl.refreshItems = function (data) {
                    data = data || ctrl.parserResult.source($scope);
                    var selectedItems = ctrl.selected;
                    //TODO should implement for single mode removeSelected
                    if ((angular.isArray(selectedItems) && !selectedItems.length) || !ctrl.removeSelected) {
                        ctrl.setItemsFn(data);
                    } else if (data) {
                        var filteredItems = data.filter(function (i) {
                            return selectedItems.indexOf(i) < 0;
                        });
                        ctrl.setItemsFn(filteredItems);
                    }
                };

                // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
                $scope.$watchCollection(ctrl.parserResult.source, function (items) {
                    if (!items) {
                        // If the user specifies undefined or null => reset the collection
                        // Special case: items can be undefined if the user did not initialized the collection on the scope
                        // i.e $scope.addresses = [] is missing
                        ctrl.items = [];
                    } else {
                        if (!angular.isArray(items)) {
                            throw fuguSelectMinErr('items', "Expected an array but got '{0}'.", items);
                        } else {
                            //Remove already selected items (ex: while searching)
                            //TODO Should add a test
                            ctrl.refreshItems(items);
                            ctrl.ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
                        }
                    }
                });

            };

            var _refreshDelayPromise;

            /**
             * Typeahead mode: lets the user refresh the collection using his own function.
             *
             * See Expose $select.search for external / remote filtering https://github.com/angular-ui/fugu-select/pull/31
             */
            ctrl.refresh = function (refreshAttr) {
                if (!angular.isUndefined(refreshAttr)) {

                    // Debounce
                    // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
                    // FYI AngularStrap typeahead does not have debouncing: https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
                    if (_refreshDelayPromise) {
                        $timeout.cancel(_refreshDelayPromise);
                    }
                    _refreshDelayPromise = $timeout(function () {
                        $scope.$eval(refreshAttr);
                    }, ctrl.refreshDelay);
                }
            };

            ctrl.setActiveItem = function (item) {
                ctrl.activeIndex = ctrl.items.indexOf(item);
            };

            ctrl.isActive = function (itemScope) {
                if (!ctrl.open) {
                    return false;
                }
                var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
                var isActive = itemIndex === ctrl.activeIndex;

                if (!isActive || ( itemIndex < 0 && ctrl.taggingLabel !== false ) || ( itemIndex < 0 && ctrl.taggingLabel === false)) {
                    return false;
                }

                if (isActive && !angular.isUndefined(ctrl.onHighlightCallback)) {
                    itemScope.$eval(ctrl.onHighlightCallback);
                }

                return isActive;
            };

            ctrl.isDisabled = function (itemScope) {

                if (!ctrl.open) {
                    return;
                }

                var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
                var isDisabled = false;
                var item;

                if (itemIndex >= 0 && !angular.isUndefined(ctrl.disableChoiceExpression)) {
                    item = ctrl.items[itemIndex];
                    isDisabled = !!(itemScope.$eval(ctrl.disableChoiceExpression)); // force the boolean value
                    item._fuguSelectChoiceDisabled = isDisabled; // store this for later reference
                }

                return isDisabled;
            };


            // When the user selects an item with ENTER or clicks the dropdown
            ctrl.select = function (item, skipFocusser, $event) {
                if (angular.isUndefined(item) || !item._fuguSelectChoiceDisabled) {

                    if (!ctrl.items && !ctrl.search) {
                        return;
                    }

                    if (!item || !item._fuguSelectChoiceDisabled) {
                        if (ctrl.tagging.isActivated) {
                            // if taggingLabel is disabled, we pull from ctrl.search val
                            if (ctrl.taggingLabel === false) {
                                if (ctrl.activeIndex < 0) {
                                    item = !angular.isUndefined(ctrl.tagging.fct) ? ctrl.tagging.fct(ctrl.search) : ctrl.search;
                                    if (!item || angular.equals(ctrl.items[0], item)) {
                                        return;
                                    }
                                } else {
                                    // keyboard nav happened first, user selected from dropdown
                                    item = ctrl.items[ctrl.activeIndex];
                                }
                            } else {
                                // tagging always operates at index zero, taggingLabel === false pushes
                                // the ctrl.search value without having it injected
                                if (ctrl.activeIndex === 0) {
                                    // ctrl.tagging pushes items to ctrl.items, so we only have empty val
                                    // for `item` if it is a detected duplicate
                                    if (angular.isUndefined(item)) {
                                        return;
                                    }

                                    // create new item on the fly if we don't already have one;
                                    // use tagging function if we have one
                                    if (!angular.isUndefined(ctrl.tagging.fct) && typeof item === 'string') {
                                        item = ctrl.tagging.fct(ctrl.search);
                                        if (!item) {
                                            return;
                                        }
                                        // if item type is 'string', apply the tagging label
                                    } else if (typeof item === 'string') {
                                        // trim the trailing space
                                        item = item.replace(ctrl.taggingLabel, '').trim();
                                    }
                                }
                            }
                            // search ctrl.selected for dupes potentially caused by tagging and return early if found
                            if (ctrl.selected && angular.isArray(ctrl.selected) && ctrl.selected.filter(function (selection) {
                                    return angular.equals(selection, item);
                                }).length > 0) {
                                ctrl.close(skipFocusser);
                                return;
                            }
                        }

                        $scope.$broadcast('fugus:select', item);

                        var locals = {};
                        locals[ctrl.parserResult.itemName] = item;

                        $timeout(function () {
                            ctrl.onSelectCallback($scope, {
                                $item: item,
                                $model: ctrl.parserResult.modelMapper($scope, locals)
                            });
                        });

                        if (ctrl.closeOnSelect) {
                            ctrl.close(skipFocusser);
                        }
                        if ($event && $event.type === 'click') {
                            ctrl.clickTriggeredSelect = true;
                        }
                    }
                }
            };

            // Closes the dropdown
            ctrl.close = function (skipFocusser) {
                if (!ctrl.open) {
                    return;
                }
                if (ctrl.ngModel && ctrl.ngModel.$setTouched) {
                    ctrl.ngModel.$setTouched();
                }
                _resetSearchInput();
                ctrl.open = false;

                $scope.$broadcast('fugus:close', skipFocusser);

            };

            ctrl.setFocus = function () {
                if (!ctrl.focus) {
                    ctrl.focusInput[0].focus();
                }
            };

            ctrl.clear = function ($event) {
                ctrl.select();
                $event.stopPropagation();
                $timeout(function () {
                    ctrl.focusser[0].focus();
                }, 0, false);
            };

            // Toggle dropdown
            ctrl.toggle = function (e) {
                if (ctrl.open) {
                    ctrl.close();
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    ctrl.activate();
                }
            };

            ctrl.isLocked = function (itemScope, itemIndex) {
                var isLocked, item = ctrl.selected[itemIndex];

                if (item && !angular.isUndefined(ctrl.lockChoiceExpression)) {
                    isLocked = !!(itemScope.$eval(ctrl.lockChoiceExpression)); // force the boolean value
                    item._fuguSelectChoiceLocked = isLocked; // store this for later reference
                }

                return isLocked;
            };

            var sizeWatch = null;
            ctrl.sizeSearchInput = function () {

                var input = ctrl.searchInput[0],
                    container = ctrl.searchInput.parent().parent()[0],
                    calculateContainerWidth = function () {
                        // Return the container width only if the search input is visible
                        return container.clientWidth * !!input.offsetParent;
                    },
                    updateIfVisible = function (containerWidth) {
                        if (containerWidth === 0) {
                            return false;
                        }
                        var inputWidth = containerWidth - input.offsetLeft - 10;
                        if (inputWidth < 50) {
                            inputWidth = containerWidth;
                        }
                        ctrl.searchInput.css('width', inputWidth + 'px');
                        return true;
                    };

                ctrl.searchInput.css('width', '10px');
                $timeout(function () { //Give tags time to render correctly
                    if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
                        sizeWatch = $scope.$watch(calculateContainerWidth, function (containerWidth) {
                            if (updateIfVisible(containerWidth)) {
                                sizeWatch();
                                sizeWatch = null;
                            }
                        });
                    }
                });
            };

            function _handleDropDownSelection(key) {
                var processed = true;
                switch (key) {
                    case KEY.DOWN:
                        if (!ctrl.open && ctrl.multiple) {
                            ctrl.activate(false, true);//In case its the search input in 'multiple' mode
                        } else if (ctrl.activeIndex < ctrl.items.length - 1) {
                            ctrl.activeIndex++;
                        }
                        break;
                    case KEY.UP:
                        if (!ctrl.open && ctrl.multiple) {
                            ctrl.activate(false, true);//In case its the search input in 'multiple' mode
                        } else if (ctrl.activeIndex > 0 || (ctrl.search.length === 0 && ctrl.tagging.isActivated && ctrl.activeIndex > -1)) {
                            ctrl.activeIndex--;
                        }
                        break;
                    case KEY.TAB:
                        if (!ctrl.multiple || ctrl.open) {
                            ctrl.select(ctrl.items[ctrl.activeIndex], true);
                        }
                        break;
                    case KEY.ENTER:
                        if (ctrl.open && (ctrl.tagging.isActivated || ctrl.activeIndex >= 0)) {
                            ctrl.select(ctrl.items[ctrl.activeIndex]); // Make sure at least one dropdown item is highlighted before adding if not in tagging mode
                        } else {
                            ctrl.activate(false, true); //In case its the search input in 'multiple' mode
                        }
                        break;
                    case KEY.ESC:
                        ctrl.close();
                        break;
                    default:
                        processed = false;
                }
                return processed;
            }

            // Bind to keyboard shortcuts
            ctrl.searchInput.on('keydown', function (e) {

                var key = e.which;

                // if(~[KEY.ESC,KEY.TAB].indexOf(key)){
                //   //TODO: SEGURO?
                //   ctrl.close();
                // }

                $scope.$apply(function () {

                    var tagged = false;

                    if (ctrl.items.length > 0 || ctrl.tagging.isActivated) {
                        _handleDropDownSelection(key);
                        if (ctrl.taggingTokens.isActivated) {
                            for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
                                if (ctrl.taggingTokens.tokens[i] === KEY.MAP[e.keyCode]) {
                                    // make sure there is a new value to push via tagging
                                    if (ctrl.search.length > 0) {
                                        tagged = true;
                                    }
                                }
                            }
                            if (tagged) {
                                $timeout(function () {
                                    ctrl.searchInput.triggerHandler('tagged');
                                    var newItem = ctrl.search.replace(KEY.MAP[e.keyCode], '').trim();
                                    if (ctrl.tagging.fct) {
                                        newItem = ctrl.tagging.fct(newItem);
                                    }
                                    if (newItem) {
                                        ctrl.select(newItem, true);
                                    }
                                });
                            }
                        }
                    }

                });

                if (KEY.isVerticalMovement(key) && ctrl.items.length > 0) {
                    _ensureHighlightVisible();
                }

                if (key === KEY.ENTER || key === KEY.ESC) {
                    e.preventDefault();
                    e.stopPropagation();
                }

            });

            // If tagging try to split by tokens and add items
            ctrl.searchInput.on('paste', function (e) {
                var data = e.originalEvent.clipboardData.getData('text/plain');
                if (data && data.length > 0 && ctrl.taggingTokens.isActivated && ctrl.tagging.fct) {
                    var items = data.split(ctrl.taggingTokens.tokens[0]); // split by first token only
                    if (items && items.length > 0) {
                        angular.forEach(items, function (item) {
                            var newItem = ctrl.tagging.fct(item);
                            if (newItem) {
                                ctrl.select(newItem, true);
                            }
                        });
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });

            ctrl.searchInput.on('tagged', function () {
                $timeout(function () {
                    _resetSearchInput();
                });
            });

            // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431
            function _ensureHighlightVisible() {
                var container = angular.element($element[0].querySelectorAll('.fugu-select-choices-content'));
                var choices = angular.element(container[0].querySelectorAll('.fugu-select-choices-row'));
                if (choices.length < 1) {
                    throw fuguSelectMinErr('choices', "Expected multiple .fugu-select-choices-row but got '{0}'.", choices.length);
                }

                if (ctrl.activeIndex < 0) {
                    return;
                }

                var highlighted = choices[ctrl.activeIndex];
                var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
                var height = container[0].offsetHeight;

                if (posY > height) {
                    container[0].scrollTop += posY - height;
                } else if (posY < highlighted.clientHeight) {
                    if (ctrl.isGrouped && ctrl.activeIndex === 0) {
                        container[0].scrollTop = 0; //To make group header visible when going all the way up
                    } else {
                        container[0].scrollTop -= highlighted.clientHeight - posY;
                    }
                }
            }

            $scope.$on('$destroy', function () {
                ctrl.searchInput.off('keyup keydown tagged blur paste');
            });
        }])
    .directive('fuguSelect', ['$document', 'fuguSelectConfig', 'fuguSelectMinErr', 'fuguSelectOffset', '$compile', '$parse', '$timeout',
        function ($document, fuguSelectConfig, fuguSelectMinErr, fuguSelectOffset, $compile, $parse, $timeout) {
            return {
                restrict: 'EA',
                templateUrl: function (tElement, tAttrs) {
                    return angular.isDefined(tAttrs.multiple) ? 'templates/select-multiple.html' : 'templates/select.html';
                },
                replace: true,
                transclude: true,
                require: ['fuguSelect', '^ngModel'],
                scope: true,
                controller: 'fuguSelectCtrl',
                controllerAs: '$select',
                compile: function (tElement, tAttrs) {
                    //Multiple or Single depending if multiple attribute presence
                    if (angular.isDefined(tAttrs.multiple)) {
                        tElement.append("<fugu-select-multiple/>").removeAttr('multiple');
                    } else {
                        tElement.append("<fugu-select-single/>");
                    }

                    return function (scope, element, attrs, ctrls, transcludeFn) {

                        var $select = ctrls[0];
                        var ngModel = ctrls[1];

                        $select.baseTitle = attrs.title || 'Select box';
                        $select.focusserTitle = $select.baseTitle + ' focus';

                        $select.closeOnSelect = (function () {
                            if (angular.isDefined(attrs.closeOnSelect)) {
                                return $parse(attrs.closeOnSelect)();
                            } else {
                                return fuguSelectConfig.closeOnSelect;
                            }
                        })();

                        $select.onSelectCallback = $parse(attrs.onSelect);
                        $select.onRemoveCallback = $parse(attrs.onRemove);

                        //Set reference to ngModel from fuguSelectCtrl
                        $select.ngModel = ngModel;

                        $select.choiceGrouped = function (group) {
                            return $select.isGrouped && group && group.name;
                        };

                        if (attrs.tabindex) {
                            attrs.$observe('tabindex', function (value) {
                                $select.focusInput.attr("tabindex", value);
                                element.removeAttr("tabindex");
                            });
                        }

                        scope.$watch('searchEnabled', function () {
                            var searchEnabled = scope.$eval(attrs.searchEnabled);
                            $select.searchEnabled = !angular.isUndefined(searchEnabled) ? searchEnabled : fuguSelectConfig.searchEnabled;
                        });

                        scope.$watch('sortable', function () {
                            var sortable = scope.$eval(attrs.sortable);
                            $select.sortable = !angular.isUndefined(sortable) ? sortable : fuguSelectConfig.sortable;
                        });

                        attrs.$observe('disabled', function () {
                            // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
                            $select.disabled = !angular.isUndefined(attrs.disabled) ? attrs.disabled : false;
                        });

                        attrs.$observe('resetSearchInput', function () {
                            // $eval() is needed otherwise we get a string instead of a boolean
                            var resetSearchInput = scope.$eval(attrs.resetSearchInput);
                            $select.resetSearchInput = angular.isUndefined(resetSearchInput) ? true:resetSearchInput;
                        });

                        attrs.$observe('tagging', function () {
                            if (!angular.isUndefined(attrs.tagging)) {
                                // $eval() is needed otherwise we get a string instead of a boolean
                                var taggingEval = scope.$eval(attrs.tagging);
                                $select.tagging = {isActivated: true, fct: taggingEval !== true ? taggingEval : null};
                            }
                            else {
                                $select.tagging = {isActivated: false, fct: null};
                            }
                        });

                        attrs.$observe('taggingLabel', function () {
                            if (attrs.tagging) {
                                // check eval for FALSE, in this case, we disable the labels
                                // associated with tagging
                                if (attrs.taggingLabel === 'false') {
                                    $select.taggingLabel = false;
                                }
                                else {
                                    $select.taggingLabel = attrs.taggingLabel ? attrs.taggingLabel : '(new)';
                                }
                            }
                        });

                        attrs.$observe('taggingTokens', function () {
                            if (attrs.tagging) {
                                var tokens = attrs.taggingTokens ? attrs.taggingTokens.split('|') : [',', 'ENTER'];
                                $select.taggingTokens = {isActivated: true, tokens: tokens};
                            }
                        });

                        //Automatically gets focus when loaded
                        if (angular.isDefined(attrs.autofocus)) {
                            $timeout(function () {
                                $select.setFocus();
                            });
                        }

                        //Gets focus based on scope event name (e.g. focus-on='SomeEventName')
                        if (angular.isDefined(attrs.focusOn)) {
                            scope.$on(attrs.focusOn, function () {
                                $timeout(function () {
                                    $select.setFocus();
                                });
                            });
                        }

                        function onDocumentClick(e) {
                            if (!$select.open) {
                                return;//Skip it if dropdown is close
                            }

                            var contains = false;

                            if (window.jQuery) {
                                // Firefox 3.6 does not support element.contains()
                                // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
                                contains = window.jQuery.contains(element[0], e.target);
                            } else {
                                contains = element[0].contains(e.target);
                            }

                            if (!contains && !$select.clickTriggeredSelect) {
                                //Will lose focus only with certain targets
                                var focusableControls = ['input', 'button', 'textarea'];
                                var targetScope = angular.element(e.target).scope(); //To check if target is other fugu-select
                                var skipFocusser = targetScope && targetScope.$select && targetScope.$select !== $select; //To check if target is other fugu-select
                                if (!skipFocusser) {//Check if target is input, button or textarea
                                    skipFocusser = focusableControls.indexOf(e.target.tagName.toLowerCase()) !== -1;
                                }
                                $select.close(skipFocusser);
                                scope.$digest();
                            }
                            $select.clickTriggeredSelect = false;
                        }

                        // See Click everywhere but here event http://stackoverflow.com/questions/12931369
                        $document.on('click', onDocumentClick);

                        scope.$on('$destroy', function () {
                            $document.off('click', onDocumentClick);
                        });

                        // Move transcluded elements to their correct position in main template
                        transcludeFn(scope, function (clone) {
                            // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

                            // One day jqLite will be replaced by jQuery and we will be able to write:
                            // var transcludedElement = clone.filter('.my-class')
                            // instead of creating a hackish DOM element:
                            var transcluded = angular.element('<div>').append(clone);
                            var transcludedMatch = angular.element(transcluded[0].querySelectorAll('.fugu-select-match'));
                            transcludedMatch.removeAttr('fugu-select-match'); //To avoid loop in case directive as attr
                            transcludedMatch.removeAttr('data-fugu-select-match'); // Properly handle HTML5 data-attributes
                            if (transcludedMatch.length !== 1) {
                                throw fuguSelectMinErr('transcluded', "Expected 1 .fugu-select-match but got '{0}'.", transcludedMatch.length);
                            }
                            angular.element(element[0].querySelectorAll('.fugu-select-match')).replaceWith(transcludedMatch);

                            var transcludedChoices = angular.element(transcluded[0].querySelectorAll('.fugu-select-choices'));
                            transcludedChoices.removeAttr('fugu-select-choices'); //To avoid loop in case directive as attr
                            transcludedChoices.removeAttr('data-fugu-select-choices'); // Properly handle HTML5 data-attributes
                            if (transcludedChoices.length !== 1) {
                                throw fuguSelectMinErr('transcluded', "Expected 1 .fugu-select-choices but got '{0}'.", transcludedChoices.length);
                            }
                            angular.element(element[0].querySelectorAll('.fugu-select-choices')).replaceWith(transcludedChoices);
                        });

                        // Support for appending the select field to the body when its open
                        var appendToBody = scope.$eval(attrs.appendToBody);
                        if (appendToBody ? appendToBody : fuguSelectConfig.appendToBody) {
                            scope.$watch('$select.open', function (isOpen) {
                                if (isOpen) {
                                    positionDropdown();
                                } else {
                                    resetDropdown();
                                }
                            });
                            // Move the dropdown back to its original location when the scope is destroyed. Otherwise
                            // it might stick around when the user routes away or the select field is otherwise removed
                            scope.$on('$destroy', function () {
                                resetDropdown();
                            });
                        }

                        // Hold on to a reference to the .fugu-select-container element for appendToBody support
                        var placeholder = null,
                            originalWidth = '';

                        function positionDropdown() {
                            // Remember the absolute position of the element
                            var offset = fuguSelectOffset(element);

                            // Clone the element into a placeholder element to take its original place in the DOM
                            placeholder = angular.element('<div class="fugu-select-placeholder"></div>');
                            placeholder[0].style.width = offset.width + 'px';
                            placeholder[0].style.height = offset.height + 'px';
                            element.after(placeholder);

                            // Remember the original value of the element width inline style, so it can be restored
                            // when the dropdown is closed
                            originalWidth = element[0].style.width;

                            // Now move the actual dropdown element to the end of the body
                            $document.find('body').append(element);

                            element[0].style.position = 'absolute';
                            element[0].style.left = offset.left + 'px';
                            element[0].style.top = offset.top + 'px';
                            element[0].style.width = offset.width + 'px';
                        }

                        function resetDropdown() {
                            if (placeholder === null) {
                                // The dropdown has not actually been display yet, so there's nothing to reset
                                return;
                            }

                            // Move the dropdown element back to its original location in the DOM
                            placeholder.replaceWith(element);
                            placeholder = null;

                            element[0].style.position = '';
                            element[0].style.left = '';
                            element[0].style.top = '';
                            element[0].style.width = originalWidth;
                        }

                        // Hold on to a reference to the .fugu-select-dropdown element for direction support.
                        var dropdown = null,
                            directionUpClassName = 'direction-up';

                        // Support changing the direction of the dropdown if there isn't enough space to render it.
                        scope.$watch('$select.open', function (isOpen) {
                            if (isOpen) {
                                dropdown = angular.element(element[0].querySelectorAll('.fugu-select-dropdown'));
                                if (dropdown === null) {
                                    return;
                                }

                                // Hide the dropdown so there is no flicker until $timeout is done executing.
                                dropdown[0].style.opacity = 0;

                                // Delay positioning the dropdown until all choices have been added so its height is correct.
                                $timeout(function () {
                                    var offset = fuguSelectOffset(element);
                                    var offsetDropdown = fuguSelectOffset(dropdown);

                                    // Determine if the direction of the dropdown needs to be changed.
                                    if (offset.top + offset.height + offsetDropdown.height > $document[0].documentElement.scrollTop + $document[0].documentElement.clientHeight) {
                                        dropdown[0].style.position = 'absolute';
                                        dropdown[0].style.top = (offsetDropdown.height * -1) + 'px';
                                        element.addClass(directionUpClassName);
                                    }

                                    // Display the dropdown once it has been positioned.
                                    dropdown[0].style.opacity = 1;
                                });
                            } else {
                                if (dropdown === null) {
                                    return;
                                }

                                // Reset the position of the dropdown.
                                dropdown[0].style.position = '';
                                dropdown[0].style.top = '';
                                element.removeClass(directionUpClassName);
                            }
                        });
                    };
                }
            };
        }])
    .directive('fuguSelectChoices', ['fuguSelectConfig', 'fuguSelectRepeatParser', 'fuguSelectMinErr', '$compile',
        function (fuguSelectConfig, RepeatParser, fuguSelectMinErr, $compile) {

            return {
                restrict: 'EA',
                require: '^fuguSelect',
                replace: true,
                transclude: true,
                templateUrl: 'templates/choices.html',
                compile: function (tElement, tAttrs) {

                    if (!tAttrs.repeat) {
                        throw fuguSelectMinErr('repeat', "Expected 'repeat' expression.");
                    }

                    return function link(scope, element, attrs, $select, transcludeFn) {

                        // var repeat = RepeatParser.parse(attrs.repeat);
                        var groupByExp = attrs.groupBy;
                        var groupFilterExp = attrs.groupFilter;

                        $select.parseRepeatAttr(attrs.repeat, groupByExp, groupFilterExp); //Result ready at $select.parserResult

                        $select.disableChoiceExpression = attrs.disableChoice;
                        $select.onHighlightCallback = attrs.onHighlight;

                        if (groupByExp) {
                            var groups = angular.element(element[0].querySelectorAll('.fugu-select-choices-group'));
                            if (groups.length !== 1) {
                                throw fuguSelectMinErr('rows', "Expected 1 .fugu-select-choices-group but got '{0}'.", groups.length);
                            }
                            groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
                        }

                        var choices = angular.element(element[0].querySelectorAll('.fugu-select-choices-row'));
                        if (choices.length !== 1) {
                            throw fuguSelectMinErr('rows', "Expected 1 .fugu-select-choices-row but got '{0}'.", choices.length);
                        }

                        choices.attr('ng-repeat', RepeatParser.getNgRepeatExpression($select.parserResult.itemName, '$select.items', $select.parserResult.trackByExp, groupByExp))
                            .attr('ng-if', '$select.open') //Prevent unnecessary watches when dropdown is closed
                            .attr('ng-mouseenter', '$select.setActiveItem(' + $select.parserResult.itemName + ')')
                            .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');

                        var rowsInner = angular.element(element[0].querySelectorAll('.fugu-select-choices-row-inner'));
                        if (rowsInner.length !== 1) {
                            throw fuguSelectMinErr('rows', "Expected 1 .fugu-select-choices-row-inner but got '{0}'.", rowsInner.length);
                        }
                        rowsInner.attr('fugu-transclude-append', ''); //Adding fuguTranscludeAppend directive to row element after choices element has ngRepeat
                        $compile(element, transcludeFn)(scope); //Passing current transcludeFn to be able to append elements correctly from fuguTranscludeAppend

                        scope.$watch('$select.search', function (newValue) {
                            if (newValue && !$select.open && $select.multiple) {
                                $select.activate(false, true);
                            }
                            $select.activeIndex = $select.tagging.isActivated ? -1 : 0;
                            $select.refresh(attrs.refresh);
                        });

                        attrs.$observe('refreshDelay', function () {
                            // $eval() is needed otherwise we get a string instead of a number
                            var refreshDelay = scope.$eval(attrs.refreshDelay);
                            $select.refreshDelay = refreshDelay ? refreshDelay : fuguSelectConfig.refreshDelay;
                        });
                    };
                }
            };
        }])
    .directive('fuguSelectMatch', ['fuguSelectConfig', function (fuguSelectConfig) {
        return {
            restrict: 'EA',
            require: '^fuguSelect',
            replace: true,
            transclude: true,
            templateUrl: function (tElement) {
                var multi = tElement.parent().attr('multiple');
                return multi ? 'templates/match-multiple.html' : 'templates/match.html';
            },
            link: function (scope, element, attrs, $select) {
                $select.lockChoiceExpression = attrs.lockChoice;
                attrs.$observe('placeholder', function (placeholder) {
                    $select.placeholder = placeholder? placeholder : fuguSelectConfig.placeholder;
                });

                function setAllowClear(allow) {
                    $select.allowClear = (angular.isDefined(allow)) ? (allow === '') ? true : (allow.toLowerCase() === 'true') : false;
                }

                attrs.$observe('allowClear', setAllowClear);
                setAllowClear(attrs.allowClear);

                if ($select.multiple) {
                    $select.sizeSearchInput();
                }

            }
        };
    }])
    .directive('fuguSelectMultiple', ['fuguSelectConfig', 'fuguSelectMinErr', '$timeout',
        function (fuguSelectConfig, fuguSelectMinErr, $timeout) {
            return {
                restrict: 'EA',
                require: ['^fuguSelect', '^ngModel'],

                controller: ['$scope', '$timeout', function ($scope, $timeout) {

                    var ctrl = this,
                        $select = $scope.$select,
                        ngModel;

                    //Wait for link fn to inject it
                    $scope.$evalAsync(function () {
                        ngModel = $scope.ngModel;
                    });

                    ctrl.activeMatchIndex = -1;

                    ctrl.updateModel = function () {
                        ngModel.$setViewValue(Date.now()); //Set timestamp as a unique string to force changes
                        ctrl.refreshComponent();
                    };

                    ctrl.refreshComponent = function () {
                        //Remove already selected items
                        //e.g. When user clicks on a selection, the selected array changes and
                        //the dropdown should remove that item
                        $select.refreshItems();
                        $select.sizeSearchInput();
                    };

                    // Remove item from multiple select
                    ctrl.removeChoice = function (index) {

                        var removedChoice = $select.selected[index];

                        // if the choice is locked, can't remove it
                        if (removedChoice._fuguSelectChoiceLocked) {
                            return;
                        }

                        var locals = {};
                        locals[$select.parserResult.itemName] = removedChoice;

                        $select.selected.splice(index, 1);
                        ctrl.activeMatchIndex = -1;
                        $select.sizeSearchInput();

                        // Give some time for scope propagation.
                        $timeout(function () {
                            $select.onRemoveCallback($scope, {
                                $item: removedChoice,
                                $model: $select.parserResult.modelMapper($scope, locals)
                            });
                        });

                        ctrl.updateModel();

                    };

                    ctrl.getPlaceholder = function () {
                        //Refactor single?
                        if ($select.selected.length) {
                            return;
                        }
                        return $select.placeholder;
                    };


                }],
                controllerAs: '$selectMultiple',

                link: function (scope, element, attrs, ctrls) {

                    var $select = ctrls[0];
                    var ngModel = scope.ngModel = ctrls[1];
                    var $selectMultiple = scope.$selectMultiple;
                    var KEY = fuguSelectConfig.KEY;
                    //$select.selected = raw selected objects (ignoring any property binding)

                    $select.multiple = true;
                    $select.removeSelected = true;

                    //Input that will handle focus
                    $select.focusInput = $select.searchInput;

                    //From view --> model
                    ngModel.$parsers.unshift(function () {
                        var locals = {},
                            result,
                            resultMultiple = [];
                        for (var j = $select.selected.length - 1; j >= 0; j--) {
                            locals = {};
                            locals[$select.parserResult.itemName] = $select.selected[j];
                            result = $select.parserResult.modelMapper(scope, locals);
                            resultMultiple.unshift(result);
                        }
                        return resultMultiple;
                    });

                    // From model --> view
                    ngModel.$formatters.unshift(function (inputValue) {
                        var data = $select.parserResult.source(scope, {$select: {search: ''}}), //Overwrite $search
                            locals = {},
                            result;
                        if (!data) {
                            return inputValue;
                        }
                        var resultMultiple = [];
                        var checkFnMultiple = function (list, value) {
                            if (!list || !list.length) {
                                return;
                            }
                            for (var p = list.length - 1; p >= 0; p--) {
                                locals[$select.parserResult.itemName] = list[p];
                                result = $select.parserResult.modelMapper(scope, locals);
                                if ($select.parserResult.trackByExp) {
                                    var matches = /\.(.+)/.exec($select.parserResult.trackByExp);
                                    if (matches.length > 0 && result[matches[1]] == value[matches[1]]) {
                                        resultMultiple.unshift(list[p]);
                                        return true;
                                    }
                                }
                                if (angular.equals(result, value)) {
                                    resultMultiple.unshift(list[p]);
                                    return true;
                                }
                            }
                            return false;
                        };
                        if (!inputValue) {
                            return resultMultiple;//If ngModel was undefined
                        }
                        for (var k = inputValue.length - 1; k >= 0; k--) {
                            //Check model array of currently selected items
                            if (!checkFnMultiple($select.selected, inputValue[k])) {
                                //Check model array of all items available
                                if (!checkFnMultiple(data, inputValue[k])) {
                                    //If not found on previous lists, just add it directly to resultMultiple
                                    resultMultiple.unshift(inputValue[k]);
                                }
                            }
                        }
                        return resultMultiple;
                    });

                    //Watch for external model changes
                    scope.$watchCollection(function () {
                        return ngModel.$modelValue;
                    }, function (newValue, oldValue) {
                        if (oldValue != newValue) {
                            ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
                            $selectMultiple.refreshComponent();
                        }
                    });

                    ngModel.$render = function () {
                        // Make sure that model value is array
                        if (!angular.isArray(ngModel.$viewValue)) {
                            // Have tolerance for null or undefined values
                            if (angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null) {
                                $select.selected = [];
                            } else {
                                throw fuguSelectMinErr('multiarr', "Expected model value to be array but got '{0}'", ngModel.$viewValue);
                            }
                        }
                        $select.selected = ngModel.$viewValue;
                        scope.$evalAsync(); //To force $digest
                    };

                    scope.$on('fugus:select', function (event, item) {
                        $select.selected.push(item);
                        $selectMultiple.updateModel();
                    });

                    scope.$on('fugus:activate', function () {
                        $selectMultiple.activeMatchIndex = -1;
                    });

                    scope.$watch('$select.disabled', function (newValue, oldValue) {
                        // As the search input field may now become visible, it may be necessary to recompute its size
                        if (oldValue && !newValue) {
                            $select.sizeSearchInput();
                        }
                    });

                    $select.searchInput.on('keydown', function (e) {
                        var key = e.which;
                        scope.$apply(function () {
                            var processed = false;
                            // var tagged = false; //Checkme
                            if (KEY.isHorizontalMovement(key)) {
                                processed = _handleMatchSelection(key);
                            }
                            if (processed && key != KEY.TAB) {
                                //TODO Check si el tab selecciona aun correctamente
                                //Crear test
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        });
                    });
                    function _getCaretPosition(el) {
                        if (angular.isNumber(el.selectionStart)) {
                            return el.selectionStart;
                            // selectionStart is not supported in IE8 and we don't want hacky workarounds so we compromise
                        } else {
                            return el.value.length;
                        }

                    }

                    // Handles selected options in "multiple" mode
                    function _handleMatchSelection(key) {
                        var caretPosition = _getCaretPosition($select.searchInput[0]),
                            length = $select.selected.length,
                        // none  = -1,
                            first = 0,
                            last = length - 1,
                            curr = $selectMultiple.activeMatchIndex,
                            next = $selectMultiple.activeMatchIndex + 1,
                            prev = $selectMultiple.activeMatchIndex - 1,
                            newIndex = curr;

                        if (caretPosition > 0 || ($select.search.length && key == KEY.RIGHT)) {
                            return false;
                        }

                        $select.close();

                        function getNewActiveMatchIndex() {
                            switch (key) {
                                case KEY.LEFT:
                                    // Select previous/first item
                                    if ($selectMultiple.activeMatchIndex !== -1) {
                                        return prev;
                                    } else {// Select last item
                                        return last;
                                    }
                                    break;
                                case KEY.RIGHT:
                                    // Open drop-down
                                    if ($selectMultiple.activeMatchIndex === -1 || curr === last) {
                                        $select.activate();
                                        return false;
                                    } else {// Select next/last item
                                        return next;
                                    }
                                    break;
                                case KEY.BACKSPACE:
                                    // Remove selected item and select previous/first
                                    if ($selectMultiple.activeMatchIndex !== -1) {
                                        $selectMultiple.removeChoice(curr);
                                        return prev;
                                    }else{
                                        return last;// Select last item
                                    }
                                    break;
                                case KEY.DELETE:
                                    // Remove selected item and select next item
                                    if ($selectMultiple.activeMatchIndex !== -1) {
                                        $selectMultiple.removeChoice($selectMultiple.activeMatchIndex);
                                        return curr;
                                    }
                                    return false;
                            }
                        }

                        newIndex = getNewActiveMatchIndex();

                        if (!$select.selected.length || newIndex === false) {
                            $selectMultiple.activeMatchIndex = -1;
                        } else {
                            $selectMultiple.activeMatchIndex = Math.min(last, Math.max(first, newIndex));
                        }

                        return true;
                    }

                    $select.searchInput.on('keyup', function (e) {

                        if (!KEY.isVerticalMovement(e.which)) {
                            scope.$evalAsync(function () {
                                $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
                            });
                        }
                        // Push a "create new" item into array if there is a search string
                        if ($select.tagging.isActivated && $select.search.length > 0) {

                            // return early with these keys
                            if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || KEY.isVerticalMovement(e.which)) {
                                return;
                            }
                            // always reset the activeIndex to the first item when tagging
                            $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
                            // taggingLabel === false bypasses all of this
                            if ($select.taggingLabel === false) {
                                return;
                            }

                            var items = angular.copy($select.items);
                            var stashArr = angular.copy($select.items);
                            var newItem;
                            var item;
                            var hasTag = false;
                            var dupeIndex = -1;
                            var tagItems;
                            var tagItem;

                            // case for object tagging via transform `$select.tagging.fct` function
                            if ($select.tagging.fct) {
                                tagItems = $select.$filter('filter')(items, {'isTag': true});
                                if (tagItems.length > 0) {
                                    tagItem = tagItems[0];
                                }
                                // remove the first element, if it has the `isTag` prop we generate a new one with each keyup, shaving the previous
                                if (items.length > 0 && tagItem) {
                                    hasTag = true;
                                    items = items.slice(1, items.length);
                                    stashArr = stashArr.slice(1, stashArr.length);
                                }
                                newItem = $select.tagging.fct($select.search);
                                newItem.isTag = true;
                                // verify the the tag doesn't match the value of an existing item
                                if (stashArr.filter(function (origItem) {
                                        return angular.equals(origItem, $select.tagging.fct($select.search));
                                    }).length > 0) {
                                    return;
                                }
                                newItem.isTag = true;
                                // handle newItem string and stripping dupes in tagging string context
                            } else {
                                // find any tagging items already in the $select.items array and store them
                                tagItems = $select.$filter('filter')(items, function (item) {
                                    return item.match($select.taggingLabel);
                                });
                                if (tagItems.length > 0) {
                                    tagItem = tagItems[0];
                                }
                                item = items[0];
                                // remove existing tag item if found (should only ever be one tag item)
                                if (item && items.length > 0 && tagItem) {
                                    hasTag = true;
                                    items = items.slice(1, items.length);
                                    stashArr = stashArr.slice(1, stashArr.length);
                                }
                                newItem = $select.search + ' ' + $select.taggingLabel;
                                if (_findApproxDupe($select.selected, $select.search) > -1) {
                                    return;
                                }
                                // verify the the tag doesn't match the value of an existing item from
                                // the searched data set or the items already selected
                                if (_findCaseInsensitiveDupe(stashArr.concat($select.selected))) {
                                    // if there is a tag from prev iteration, strip it / queue the change
                                    // and return early
                                    if (hasTag) {
                                        items = stashArr;
                                        scope.$evalAsync(function () {
                                            $select.activeIndex = 0;
                                            $select.items = items;
                                        });
                                    }
                                    return;
                                }
                                if (_findCaseInsensitiveDupe(stashArr)) {
                                    // if there is a tag from prev iteration, strip it
                                    if (hasTag) {
                                        $select.items = stashArr.slice(1, stashArr.length);
                                    }
                                    return;
                                }
                            }
                            if (hasTag) {
                                dupeIndex = _findApproxDupe($select.selected, newItem);
                            }
                            // dupe found, shave the first item
                            if (dupeIndex > -1) {
                                items = items.slice(dupeIndex + 1, items.length - 1);
                            } else {
                                items = [];
                                items.push(newItem);
                                items = items.concat(stashArr);
                            }
                            scope.$evalAsync(function () {
                                $select.activeIndex = 0;
                                $select.items = items;
                            });
                        }
                    });
                    function _findCaseInsensitiveDupe(arr) {
                        if (!arr || !$select.search) {
                            return false;
                        }
                        return arr.filter(function (origItem) {
                                if (!$select.search.toUpperCase() || !origItem) {
                                    return false;
                                }
                                return origItem.toUpperCase() === $select.search.toUpperCase();
                            }).length > 0;
                    }

                    function _findApproxDupe(haystack, needle) {
                        var dupeIndex = -1;
                        if (angular.isArray(haystack)) {
                            var tempArr = angular.copy(haystack);
                            for (var i = 0; i < tempArr.length; i++) {
                                // handle the simple string version of tagging
                                // search the array for the match
                                if (!$select.tagging.fct && tempArr[i] + ' ' + $select.taggingLabel === needle) {
                                    dupeIndex = i;
                                    // handle the object tagging implementation
                                } else {
                                    var mockObj = tempArr[i];
                                    mockObj.isTag = true;
                                    if (angular.equals(mockObj, needle)) {
                                        dupeIndex = i;
                                    }
                                }
                            }
                        }
                        return dupeIndex;
                    }

                    $select.searchInput.on('blur', function () {
                        $timeout(function () {
                            $selectMultiple.activeMatchIndex = -1;
                        });
                    });

                }
            };
        }])
    .directive('fuguSelectSingle', ['fuguSelectConfig', '$timeout', '$compile', function (fuguSelectConfig, $timeout, $compile) {
        return {
            restrict: 'EA',
            require: ['^fuguSelect', '^ngModel'],
            link: function (scope, element, attrs, ctrls) {
                var KEY = fuguSelectConfig.KEY;
                var $select = ctrls[0];
                var ngModel = ctrls[1];

                //From view --> model
                ngModel.$parsers.unshift(function (inputValue) {
                    var locals = {},
                        result;
                    locals[$select.parserResult.itemName] = inputValue;
                    result = $select.parserResult.modelMapper(scope, locals);
                    return result;
                });

                //From model --> view
                ngModel.$formatters.unshift(function (inputValue) {
                    var data = $select.parserResult.source(scope, {$select: {search: ''}}), //Overwrite $search
                        locals = {},
                        result;
                    if (data) {
                        var checkFnSingle = function (d) {
                            locals[$select.parserResult.itemName] = d;
                            result = $select.parserResult.modelMapper(scope, locals);
                            return result === inputValue;
                        };
                        //If possible pass same object stored in $select.selected
                        if ($select.selected && checkFnSingle($select.selected)) {
                            return $select.selected;
                        }
                        for (var i = data.length - 1; i >= 0; i--) {
                            if (checkFnSingle(data[i])) {
                                return data[i];
                            }
                        }
                    }
                    return inputValue;
                });

                //Update viewValue if model change
                scope.$watch('$select.selected', function (newValue) {
                    if (ngModel.$viewValue !== newValue) {
                        ngModel.$setViewValue(newValue);
                    }
                });

                ngModel.$render = function () {
                    $select.selected = ngModel.$viewValue;
                };

                scope.$on('fugus:select', function (event, item) {
                    $select.selected = item;
                });

                scope.$on('fugus:close', function (event, skipFocusser) {
                    $timeout(function () {
                        $select.focusser.prop('disabled', false);
                        if (!skipFocusser) {
                            $select.focusser[0].focus();
                        }
                    }, 0, false);
                });

                //Idea from: https://github.com/ivaynberg/select2/blob/79b5bf6db918d7560bdd959109b7bcfb47edaf43/select2.js#L1954
                var focusser = angular.element("<input ng-disabled='$select.disabled' class='fugu-select-focusser fugu-select-offscreen' type='text' aria-label='{{ $select.focusserTitle }}' aria-haspopup='true' role='button' />");

                scope.$on('fugus:activate', function () {
                    focusser.prop('disabled', true); //Will reactivate it on .close()
                });

                $compile(focusser)(scope);
                $select.focusser = focusser;

                //Input that will handle focus
                $select.focusInput = focusser;

                element.parent().append(focusser);
                focusser.bind("focus", function () {
                    scope.$evalAsync(function () {
                        $select.focus = true;
                    });
                });
                focusser.bind("blur", function () {
                    scope.$evalAsync(function () {
                        $select.focus = false;
                    });
                });
                focusser.bind("keydown", function (e) {

                    if (e.which === KEY.BACKSPACE) {
                        e.preventDefault();
                        e.stopPropagation();
                        $select.select();
                        scope.$apply();
                        return;
                    }

                    if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                        return;
                    }

                    if (e.which === KEY.DOWN || e.which === KEY.UP || e.which === KEY.ENTER || e.which === KEY.SPACE) {
                        e.preventDefault();
                        e.stopPropagation();
                        $select.activate();
                    }

                    scope.$digest();
                });

                focusser.bind("keyup input", function (e) {

                    if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || e.which === KEY.ENTER || e.which === KEY.BACKSPACE) {
                        return;
                    }

                    $select.activate(focusser.val()); //User pressed some regular key, so we pass it to the search input
                    focusser.val('');
                    scope.$digest();

                });


            }
        };
    }])
    .directive('fuguSelectSort', ['$timeout', 'fuguSelectConfig', 'fuguSelectMinErr', function ($timeout, fuguSelectConfig, fuguSelectMinErr) {
        return {
            require: '^fuguSelect',
            link: function (scope, element, attrs, $select) {
                if (scope[attrs.fuguSelectSort] === null) {
                    throw fuguSelectMinErr('sort', "Expected a list to sort");
                }

                var options = angular.extend({
                        axis: 'horizontal'
                    },scope.$eval(attrs.fuguSelectSortOptions));

                var axis = options.axis,
                    draggingClassName = 'dragging',
                    droppingClassName = 'dropping',
                    droppingBeforeClassName = 'dropping-before',
                    droppingAfterClassName = 'dropping-after';

                scope.$watch(function () {
                    return $select.sortable;
                }, function (n) {
                    if (n) {
                        element.attr('draggable', true);
                    } else {
                        element.removeAttr('draggable');
                    }
                });

                element.on('dragstart', function (e) {
                    element.addClass(draggingClassName);

                    (e.dataTransfer || e.originalEvent.dataTransfer).setData('text/plain', scope.$index);
                });

                element.on('dragend', function () {
                    element.removeClass(draggingClassName);
                });

                var move = function (from, to) {
                    /*jshint validthis: true */
                    this.splice(to, 0, this.splice(from, 1)[0]);
                };

                var dragOverHandler = function (e) {
                    e.preventDefault();

                    var offset = axis === 'vertical' ? e.offsetY || e.layerY || (e.originalEvent ? e.originalEvent.offsetY : 0) : e.offsetX || e.layerX || (e.originalEvent ? e.originalEvent.offsetX : 0);

                    if (offset < (this[axis === 'vertical' ? 'offsetHeight' : 'offsetWidth'] / 2)) {
                        element.removeClass(droppingAfterClassName);
                        element.addClass(droppingBeforeClassName);

                    } else {
                        element.removeClass(droppingBeforeClassName);
                        element.addClass(droppingAfterClassName);
                    }
                };

                var dropTimeout;

                var dropHandler = function (e) {
                    e.preventDefault();

                    var droppedItemIndex = parseInt((e.dataTransfer || e.originalEvent.dataTransfer).getData('text/plain'), 10);

                    // prevent event firing multiple times in firefox
                    $timeout.cancel(dropTimeout);
                    dropTimeout = $timeout(function () {
                        _dropHandler(droppedItemIndex);
                    }, 20);
                };

                function _dropHandler(droppedItemIndex) {
                    var theList = scope.$eval(attrs.fuguSelectSort),
                        itemToMove = theList[droppedItemIndex],
                        newIndex = null;

                    if (element.hasClass(droppingBeforeClassName)) {
                        if (droppedItemIndex < scope.$index) {
                            newIndex = scope.$index - 1;
                        } else {
                            newIndex = scope.$index;
                        }
                    } else if(droppedItemIndex < scope.$index){
                        newIndex = scope.$index;
                    }else{
                        newIndex = scope.$index + 1;
                    }

                    move.apply(theList, [droppedItemIndex, newIndex]);

                    scope.$apply(function () {
                        scope.$emit('fuguSelectSort:change', {
                            array: theList,
                            item: itemToMove,
                            from: droppedItemIndex,
                            to: newIndex
                        });
                    });

                    element.removeClass(droppingClassName);
                    element.removeClass(droppingBeforeClassName);
                    element.removeClass(droppingAfterClassName);

                    element.off('drop', dropHandler);
                }

                element.on('dragenter', function () {
                    if (element.hasClass(draggingClassName)) {
                        return;
                    }

                    element.addClass(droppingClassName);

                    element.on('dragover', dragOverHandler);
                    element.on('drop', dropHandler);
                });

                element.on('dragleave', function (e) {
                    if (e.target !== element) {
                        return;
                    }
                    element.removeClass(droppingClassName);
                    element.removeClass(droppingBeforeClassName);
                    element.removeClass(droppingAfterClassName);

                    element.off('dragover', dragOverHandler);
                    element.off('drop', dropHandler);
                });
            }
        };
    }])
    .service('fuguSelectRepeatParser', ['fuguSelectMinErr', '$parse', function (fuguSelectMinErr, $parse) {
        var self = this;

        /**
         * Example:
         * expression = "address in addresses | filter: {street: $select.search} track by $index"
         * itemName = "address",
         * source = "addresses | filter: {street: $select.search}",
         * trackByExp = "$index",
         */
        self.parse = function (expression) {

            var match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?([\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

            if (!match) {
                throw fuguSelectMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
                    expression);
            }

            return {
                itemName: match[2], // (lhs) Left-hand side,
                source: $parse(match[3]),
                trackByExp: match[4],
                modelMapper: $parse(match[1] || match[2])
            };

        };

        self.getGroupNgRepeatExpression = function () {
            return '$group in $select.groups';
        };

        self.getNgRepeatExpression = function (itemName, source, trackByExp, grouped) {
            var expression = itemName + ' in ' + (grouped ? '$group.items' : source);
            if (trackByExp) {
                expression += ' track by ' + trackByExp;
            }
            return expression;
        };
    }]);
/**
 * sortable
 * sortable directive
 * Author: yjy972080142@gmail.com
 * Date:2016-03-21
 */
angular.module('ui.fugu.sortable', [])
    .service('fuguSortableService', function () {return {};})
    .directive('fuguSortable', ['$parse', '$timeout', 'fuguSortableService',
        function ($parse, $timeout, fuguSortableService) {
        return {
            restrict: 'AE',
            scope: {
                fuguSortable:'='
            },
            link: function (scope, element) {
                var self = this;
                if(scope.fuguSortable){
                    scope.$watch('fuguSortable.length', function() {
                        // Timeout to let ng-repeat modify the DOM
                        $timeout(function() {
                            self.refresh();
                        }, 0, false);
                    });
                }
                self.refresh = function () {
                    var children = element.children();
                    children.off('dragstart dragend');
                    element.off('dragenter dragover drop dragleave');
                    angular.forEach(children,function (item,i) {
                        var child = angular.element(item);
                        child.attr('draggable', 'true').css({cursor:'move'}).on('dragstart', function (event) {
                                event = event.originalEvent || event;
                                if (element.attr('draggable') == 'false') {
                                    return;
                                }
                                event.dataTransfer.effectAllowed = "move";
                                event.dataTransfer.setDragImage(item,10, 10);

                                $timeout(function() {
                                    //child.hide();
                                    item.originDisplay = item.style.display;
                                    item.style.display = 'none';
                                }, 0);

                                fuguSortableService.isDragging = true;
                                fuguSortableService.dragIndex = i;
                                fuguSortableService.placeholder = getPlaceholder(child);
                                event.stopPropagation();
                            })
                            .on('dragend', function (event) {
                                event = event.originalEvent || event;

                                $timeout(function() {
                                    //child.show();
                                    item.style.display = item.originDisplay;
                                }, 0);
                                fuguSortableService.isDragging = false;
                                fuguSortableService.dragIndex = null;
                                fuguSortableService.placeholder = null;
                                event.stopPropagation();
                                event.preventDefault();
                            });
                    });

                    //父元素绑定drop事件
                    var listNode = element[0],placeholder,placeholderNode;
                    element.on('dragenter', function (event) {
                            event = event.originalEvent || event;
                            if (!fuguSortableService.isDragging) {
                                return false;
                            }
                            placeholder = fuguSortableService.placeholder;
                            placeholderNode = placeholder[0];
                            event.preventDefault();
                        })
                        .on('dragover', function (event) {
                            event = event.originalEvent || event;
                            if (!fuguSortableService.isDragging) {
                                return false;
                            }
                            if (placeholderNode.parentNode != listNode) {
                                element.append(placeholder);
                            }
                            if (event.target !== listNode) {
                                var listItemNode = event.target;
                                while (listItemNode.parentNode !== listNode && listItemNode.parentNode) {
                                    listItemNode = listItemNode.parentNode;
                                }
                                if (listItemNode.parentNode === listNode && listItemNode !== placeholderNode) {
                                    if (isMouseInFirstHalf(event, listItemNode)) {
                                        listNode.insertBefore(placeholderNode, listItemNode);
                                    } else {
                                        listNode.insertBefore(placeholderNode, listItemNode.nextSibling);
                                    }
                                }
                            } else {
                                if (isMouseInFirstHalf(event, placeholderNode, true)) {
                                    while (placeholderNode.previousElementSibling
                                    && (isMouseInFirstHalf(event, placeholderNode.previousElementSibling, true)
                                    || placeholderNode.previousElementSibling.offsetHeight === 0)) {
                                        listNode.insertBefore(placeholderNode, placeholderNode.previousElementSibling);
                                    }
                                } else {
                                    while (placeholderNode.nextElementSibling &&
                                    !isMouseInFirstHalf(event, placeholderNode.nextElementSibling, true)) {
                                        listNode.insertBefore(placeholderNode,
                                            placeholderNode.nextElementSibling.nextElementSibling);
                                    }
                                }
                            }
                            element.addClass("fugu-sortable-dragover");
                            event.preventDefault();
                            event.stopPropagation();
                            return false;
                        })
                        .on('drop', function (event) {
                            event = event.originalEvent || event;

                            if (!fuguSortableService.isDragging) {
                                return true;
                            }
                            var dragIndex = fuguSortableService.dragIndex;
                            var placeholderIndex = getPlaceholderIndex(placeholderNode,listNode,dragIndex);
                            scope.$apply(function() {
                                // 改变数据,由angular进行DOM修改
                                var dragObj = scope.fuguSortable[dragIndex];
                                scope.fuguSortable.splice(dragIndex,1);
                                scope.fuguSortable.splice(placeholderIndex,0,dragObj)
                            });
                            placeholder.remove();
                            element.removeClass("fugu-sortable-dragover");
                            event.stopPropagation();
                            return false;
                        })
                        .on('dragleave', function(event) {
                            event = event.originalEvent || event;
                            element.removeClass("fugu-sortable-dragover");
                            $timeout(function() {
                                if(!element.hasClass('fugu-sortable-dragover')){
                                    placeholder.remove();
                                }
                            }, 0);
                        });
                };
                /**
                 * 获取placeholder的索引
                 * @param placeholderNode - placeholder的节点
                 * @param listNode - 列表节点
                 * @param dragIndex - 被拖拽的节点索引
                 * @returns {number}
                 */
                function getPlaceholderIndex(placeholderNode,listNode,dragIndex) {
                    var index = Array.prototype.indexOf.call(listNode.children, placeholderNode);
                    return index > dragIndex?--index:index;
                }

                /**
                 * 判断鼠标位置是否在targetNode上一半
                 */
                function isMouseInFirstHalf(event, targetNode, relativeToParent) {
                    var mousePointer = event.offsetY || event.layerY;
                    var targetSize = targetNode.offsetHeight;
                    var targetPosition = targetNode.offsetTop;
                    targetPosition = relativeToParent ? targetPosition : 0;
                    return mousePointer < targetPosition + targetSize / 2;
                }

                /**
                 * 获取placeholder元素
                 * @param ele
                 * @returns {*}
                 */
                function getPlaceholder(ele){
                    var placeholder = ele.clone();
                    placeholder.html('');
                    placeholder.css({
                        listStyle: 'none',
                        border: '1px dashed #CCC',
                        minHeight:'10px',
                        height:ele[0].offsetHeight+'px',
                        width:ele[0].offsetWidth+'px',
                        background:'transparent'
                    });
                    return placeholder;
                }
            }
        }
    }]);
/**
 * switch
 * 开关
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-31
 */
angular.module('ui.fugu.switch', [])
    .constant('fuguSwitchConfig', {
        type: 'default',
        size: 'md',
        isDisabled: false,
        trueValue:true,
        falseValue:false
    })
    .controller('fuguSwitchCtrl', ['$scope', '$attrs','fuguSwitchConfig', function ($scope, $attrs,fuguSwitchConfig) {
        var ngModelCtrl = {$setViewValue: angular.noop};
        $scope.switchObj = {};
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            $scope.switchObj.isDisabled = getAttrValue('ngDisabled','isDisabled');
            $scope.switchObj.type = $scope.type || fuguSwitchConfig.type;
            $scope.switchObj.size = $scope.size || fuguSwitchConfig.size;
            $scope.switchObj.trueValue = getAttrValue('trueValue');
            $scope.switchObj.falseValue = getAttrValue('falseValue');
        };
        $scope.$watch('switchObj.query', function (val) {
            ngModelCtrl.$setViewValue(val?$scope.switchObj.trueValue:$scope.switchObj.falseValue);
            ngModelCtrl.$render();
        });
        $scope.changeSwitchHandler = function () {
            if($scope.onChange){
                $scope.onChange();
            }
        };
        this.render = function () {
            $scope.switchObj.query = ngModelCtrl.$viewValue === $scope.switchObj.trueValue;
        };
        function getAttrValue(attributeValue,defaultValue) {
            var val = $scope.$parent.$eval($attrs[attributeValue]);   //变量解析
            return angular.isDefined(val) ? val : fuguSwitchConfig[defaultValue||attributeValue];
        }
    }])
    .directive('fuguSwitch', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/switch.html',
            replace: true,
            require: ['fuguSwitch', 'ngModel'],
            scope: {
                type:'@?',
                size:'@?',
                onChange:'&?'
            },
            controller: 'fuguSwitchCtrl',
            link: function (scope, el, attrs, ctrls) {
                var switchCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                switchCtrl.init(ngModelCtrl);
            }
        }
    });
/**
 * timepicker
 * timepicker directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-15
 */
angular.module('ui.fugu.timepicker', ['ui.fugu.timepanel'])
    .constant('fuguTimepickerConfig', {
        hourStep: 1,
        minuteStep: 1,
        secondStep: 1,
        format:'HH:mm:ss'
    })
    .service('fuguTimepickerService', ['$document', function($document) {
        var openScope = null;
        this.open = function(timepickerScope) {
            if (!openScope) {
                $document.on('click', closeTimepicker);
            }
            if (openScope && openScope !== timepickerScope) {
                openScope.showTimepanel = false;
            }
            openScope = timepickerScope;
        };

        this.close = function(timepickerScope) {
            if (openScope === timepickerScope) {
                openScope = null;
                $document.off('click', closeTimepicker);
            }
        };

        function closeTimepicker(evt) {
            if (!openScope) { return; }
            var panelElement = openScope.getTimepanelElement();
            var toggleElement = openScope.getToggleElement();
            if(panelElement && panelElement[0].contains(evt.target) ||
                toggleElement && toggleElement[0].contains(evt.target)){
                return;
            }
            openScope.showTimepanel = false;
            openScope.$apply();
        }

    }])
    .controller('fuguTimepickerCtrl', ['$scope', '$element', '$attrs', '$parse', '$log', 'fuguTimepickerService', 'fuguTimepickerConfig','dateFilter', function($scope, $element, $attrs, $parse, $log, fuguTimepickerService, timepickerConfig,dateFilter) {
        var ngModelCtrl = { $setViewValue: angular.noop };
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            ngModelCtrl.$formatters.unshift(function(modelValue) {
                return modelValue ? new Date(modelValue) : null;
            });
            $scope.hourStep = angular.isDefined($attrs.hourStep) ? $scope.$parent.$eval($attrs.hourStep) : timepickerConfig.hourStep;
            $scope.minuteStep = angular.isDefined($attrs.minuteStep) ? $scope.$parent.$eval($attrs.minuteStep) : timepickerConfig.minuteStep;
            $scope.secondStep = angular.isDefined($attrs.secondStep) ? $scope.$parent.$eval($attrs.secondStep) : timepickerConfig.secondStep;
        };
        var _this = this;
        $scope.showTimepanel = false;
        this.toggle = function(open) {
            $scope.showTimepanel = arguments.length ? !!open : !$scope.showTimepanel;
        };
        this.showTimepanel = function() {
            return $scope.showTimepanel;
        };
        var format = angular.isDefined($attrs.format) ? $scope.$parent.$eval($attrs.format) : timepickerConfig.format;
        this.render = function () {
            var date = ngModelCtrl.$viewValue;
            if (isNaN(date)) {
                $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
            } else if(date){
                $scope.selectedTime = date;
                $scope.inputValue = dateFilter(date,format);
            }
        };
        // 这里使用onChange，而不是watch selectedTime属性，因为watch的话，会出现循环赋值，待解决
        $scope.changeTime = function (time) {
            ngModelCtrl.$setViewValue(time);
            ngModelCtrl.$render();
        };
        $scope.toggleTimepanel = function (evt) {
            $element.find('input')[0].blur();
            evt.preventDefault();
            if (!$scope.isDisabled) {
                _this.toggle();
            }
        };
        $scope.getTimepanelElement = function () {
            return $element.find('.fugu-timepanel');
        };
        $scope.getToggleElement = function () {
            return $element.find('.input-group');
        };
        $scope.$watch('showTimepanel', function(showTimepanel) {
            if (showTimepanel) {
                fuguTimepickerService.open($scope);
            } else {
                fuguTimepickerService.close($scope);
            }
        });
        $scope.$on('$locationChangeSuccess', function() {
            $scope.showTimepanel = false;
        });
    }])
    .directive('fuguTimepicker', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/timepicker.html',
            replace: true,
            require: ['fuguTimepicker','ngModel'],
            scope: {
                isDisabled:'=?ngDisabled',
                placeholder:'@'
            },
            controller: 'fuguTimepickerCtrl',
            link: function (scope, el, attrs, ctrls) {
                var timepickerCtrl = ctrls[0],ngModelCtrl = ctrls[1];
                timepickerCtrl.init(ngModelCtrl);
            }
        }
    });
/**
 * tooltip
 * 提示指令
 * Author:heqingyang@meituan.com
 * Date:2016-02-18
 */
angular.module('ui.fugu.tooltip',[])

.factory('$$stackedMap', function() {
    return {
        createNew: function() {
            var stack = [];

            return {
                add: function(key, value) {
                    stack.push({
                        key: key,
                        value: value
                    });
                },
                get: function(key) {
                    for (var i = 0; i < stack.length; i++) {
                        if (key === stack[i].key) {
                            return stack[i];
                        }
                    }
                },
                keys: function() {
                    var keys = [];
                    for (var i = 0; i < stack.length; i++) {
                        keys.push(stack[i].key);
                    }
                    return keys;
                },
                top: function() {
                    return stack[stack.length - 1];
                },
                remove: function(key) {
                    var idx = -1;
                    for (var i = 0; i < stack.length; i++) {
                        if (key === stack[i].key) {
                            idx = i;
                            break;
                        }
                    }
                    return stack.splice(idx, 1)[0];
                },
                removeTop: function() {
                    return stack.splice(stack.length - 1, 1)[0];
                },
                length: function() {
                    return stack.length;
                }
            };
        }
    };
})
.factory('$uibPosition', ['$document', '$window', function($document, $window) {
        /**
         * Used by scrollbarWidth() function to cache scrollbar's width.
         * Do not access this variable directly, use scrollbarWidth() instead.
         */
        var SCROLLBAR_WIDTH;
        var OVERFLOW_REGEX = {
            normal: /(auto|scroll)/,
            hidden: /(auto|scroll|hidden)/
        };
        var PLACEMENT_REGEX = {
            auto: /\s?auto?\s?/i,
            primary: /^(top|bottom|left|right)$/,
            secondary: /^(top|bottom|left|right|center)$/,
            vertical: /^(top|bottom)$/
        };

        return {

            /**
             * Provides a raw DOM element from a jQuery/jQLite element.
             *
             * @param {element} elem - The element to convert.
             *
             * @returns {element} A HTML element.
             */
            getRawNode: function(elem) {
                return elem.nodeName ? elem : elem[0] || elem;
            },

            /**
             * Provides a parsed number for a style property.  Strips
             * units and casts invalid numbers to 0.
             *
             * @param {string} value - The style value to parse.
             *
             * @returns {number} A valid number.
             */
            parseStyle: function(value) {
                value = parseFloat(value);
                return isFinite(value) ? value : 0;
            },

            /**
             * Provides the closest positioned ancestor.
             *
             * @param {element} element - The element to get the offest parent for.
             *
             * @returns {element} The closest positioned ancestor.
             */
            offsetParent: function(elem) {
                elem = this.getRawNode(elem);

                var offsetParent = elem.offsetParent || $document[0].documentElement;

                function isStaticPositioned(el) {
                    return ($window.getComputedStyle(el).position || 'static') === 'static';
                }

                while (offsetParent && offsetParent !== $document[0].documentElement && isStaticPositioned(offsetParent)) {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || $document[0].documentElement;
            },

            /**
             * Provides the scrollbar width, concept from TWBS measureScrollbar()
             * function in https://github.com/twbs/bootstrap/blob/master/js/modal.js
             *
             * @returns {number} The width of the browser scollbar.
             */
            scrollbarWidth: function() {
                if (angular.isUndefined(SCROLLBAR_WIDTH)) {
                    var scrollElem = angular.element('<div style="position: absolute; top: -9999px; width: 50px; height: 50px; overflow: scroll;"></div>');
                    $document.find('body').append(scrollElem);
                    SCROLLBAR_WIDTH = scrollElem[0].offsetWidth - scrollElem[0].clientWidth;
                    SCROLLBAR_WIDTH = isFinite(SCROLLBAR_WIDTH) ? SCROLLBAR_WIDTH : 0;
                    scrollElem.remove();
                }

                return SCROLLBAR_WIDTH;
            },

            /**
             * Provides the closest scrollable ancestor.
             * A port of the jQuery UI scrollParent method:
             * https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
             *
             * @param {element} elem - The element to find the scroll parent of.
             * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
             *   default is false.
             *
             * @returns {element} A HTML element.
             */
            scrollParent: function(elem, includeHidden) {
                elem = this.getRawNode(elem);

                var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
                var documentEl = $document[0].documentElement;
                var elemStyle = $window.getComputedStyle(elem);
                var excludeStatic = elemStyle.position === 'absolute';
                var scrollParent = elem.parentElement || documentEl;

                if (scrollParent === documentEl || elemStyle.position === 'fixed') {
                    return documentEl;
                }

                while (scrollParent.parentElement && scrollParent !== documentEl) {
                    var spStyle = $window.getComputedStyle(scrollParent);
                    if (excludeStatic && spStyle.position !== 'static') {
                        excludeStatic = false;
                    }

                    if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
                        break;
                    }
                    scrollParent = scrollParent.parentElement;
                }

                return scrollParent;
            },

            /**
             * Provides read-only equivalent of jQuery's position function:
             * http://api.jquery.com/position/ - distance to closest positioned
             * ancestor.  Does not account for margins by default like jQuery position.
             *
             * @param {element} elem - The element to caclulate the position on.
             * @param {boolean=} [includeMargins=false] - Should margins be accounted
             * for, default is false.
             *
             * @returns {object} An object with the following properties:
             *   <ul>
             *     <li>**width**: the width of the element</li>
             *     <li>**height**: the height of the element</li>
             *     <li>**top**: distance to top edge of offset parent</li>
             *     <li>**left**: distance to left edge of offset parent</li>
             *   </ul>
             */
            position: function(elem, includeMagins) {
                elem = this.getRawNode(elem);

                var elemOffset = this.offset(elem);
                if (includeMagins) {
                    var elemStyle = $window.getComputedStyle(elem);
                    elemOffset.top -= this.parseStyle(elemStyle.marginTop);
                    elemOffset.left -= this.parseStyle(elemStyle.marginLeft);
                }
                var parent = this.offsetParent(elem);
                var parentOffset = {top: 0, left: 0};

                if (parent !== $document[0].documentElement) {
                    parentOffset = this.offset(parent);
                    parentOffset.top += parent.clientTop - parent.scrollTop;
                    parentOffset.left += parent.clientLeft - parent.scrollLeft;
                }

                return {
                    width: Math.round(angular.isNumber(elemOffset.width) ? elemOffset.width : elem.offsetWidth),
                    height: Math.round(angular.isNumber(elemOffset.height) ? elemOffset.height : elem.offsetHeight),
                    top: Math.round(elemOffset.top - parentOffset.top),
                    left: Math.round(elemOffset.left - parentOffset.left)
                };
            },

            /**
             * Provides read-only equivalent of jQuery's offset function:
             * http://api.jquery.com/offset/ - distance to viewport.  Does
             * not account for borders, margins, or padding on the body
             * element.
             *
             * @param {element} elem - The element to calculate the offset on.
             *
             * @returns {object} An object with the following properties:
             *   <ul>
             *     <li>**width**: the width of the element</li>
             *     <li>**height**: the height of the element</li>
             *     <li>**top**: distance to top edge of viewport</li>
             *     <li>**right**: distance to bottom edge of viewport</li>
             *   </ul>
             */
            offset: function(elem) {
                elem = this.getRawNode(elem);

                var elemBCR = elem.getBoundingClientRect();
                return {
                    width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
                    height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
                    top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
                    left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
                };
            },

            /**
             * Provides offset distance to the closest scrollable ancestor
             * or viewport.  Accounts for border and scrollbar width.
             *
             * Right and bottom dimensions represent the distance to the
             * respective edge of the viewport element.  If the element
             * edge extends beyond the viewport, a negative value will be
             * reported.
             *
             * @param {element} elem - The element to get the viewport offset for.
             * @param {boolean=} [useDocument=false] - Should the viewport be the document element instead
             * of the first scrollable element, default is false.
             * @param {boolean=} [includePadding=true] - Should the padding on the offset parent element
             * be accounted for, default is true.
             *
             * @returns {object} An object with the following properties:
             *   <ul>
             *     <li>**top**: distance to the top content edge of viewport element</li>
             *     <li>**bottom**: distance to the bottom content edge of viewport element</li>
             *     <li>**left**: distance to the left content edge of viewport element</li>
             *     <li>**right**: distance to the right content edge of viewport element</li>
             *   </ul>
             */
            viewportOffset: function(elem, useDocument, includePadding) {
                elem = this.getRawNode(elem);
                includePadding = includePadding !== false ? true : false;

                var elemBCR = elem.getBoundingClientRect();
                var offsetBCR = {top: 0, left: 0, bottom: 0, right: 0};

                var offsetParent = useDocument ? $document[0].documentElement : this.scrollParent(elem);
                var offsetParentBCR = offsetParent.getBoundingClientRect();

                offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
                offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;
                if (offsetParent === $document[0].documentElement) {
                    offsetBCR.top += $window.pageYOffset;
                    offsetBCR.left += $window.pageXOffset;
                }
                offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
                offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

                if (includePadding) {
                    var offsetParentStyle = $window.getComputedStyle(offsetParent);
                    offsetBCR.top += this.parseStyle(offsetParentStyle.paddingTop);
                    offsetBCR.bottom -= this.parseStyle(offsetParentStyle.paddingBottom);
                    offsetBCR.left += this.parseStyle(offsetParentStyle.paddingLeft);
                    offsetBCR.right -= this.parseStyle(offsetParentStyle.paddingRight);
                }

                return {
                    top: Math.round(elemBCR.top - offsetBCR.top),
                    bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
                    left: Math.round(elemBCR.left - offsetBCR.left),
                    right: Math.round(offsetBCR.right - elemBCR.right)
                };
            },

            /**
             * Provides an array of placement values parsed from a placement string.
             * Along with the 'auto' indicator, supported placement strings are:
             *   <ul>
             *     <li>top: element on top, horizontally centered on host element.</li>
             *     <li>top-left: element on top, left edge aligned with host element left edge.</li>
             *     <li>top-right: element on top, lerightft edge aligned with host element right edge.</li>
             *     <li>bottom: element on bottom, horizontally centered on host element.</li>
             *     <li>bottom-left: element on bottom, left edge aligned with host element left edge.</li>
             *     <li>bottom-right: element on bottom, right edge aligned with host element right edge.</li>
             *     <li>left: element on left, vertically centered on host element.</li>
             *     <li>left-top: element on left, top edge aligned with host element top edge.</li>
             *     <li>left-bottom: element on left, bottom edge aligned with host element bottom edge.</li>
             *     <li>right: element on right, vertically centered on host element.</li>
             *     <li>right-top: element on right, top edge aligned with host element top edge.</li>
             *     <li>right-bottom: element on right, bottom edge aligned with host element bottom edge.</li>
             *   </ul>
             * A placement string with an 'auto' indicator is expected to be
             * space separated from the placement, i.e: 'auto bottom-left'  If
             * the primary and secondary placement values do not match 'top,
             * bottom, left, right' then 'top' will be the primary placement and
             * 'center' will be the secondary placement.  If 'auto' is passed, true
             * will be returned as the 3rd value of the array.
             *
             * @param {string} placement - The placement string to parse.
             *
             * @returns {array} An array with the following values
             * <ul>
             *   <li>**[0]**: The primary placement.</li>
             *   <li>**[1]**: The secondary placement.</li>
             *   <li>**[2]**: If auto is passed: true, else undefined.</li>
             * </ul>
             */
            parsePlacement: function(placement) {
                var autoPlace = PLACEMENT_REGEX.auto.test(placement);
                if (autoPlace) {
                    placement = placement.replace(PLACEMENT_REGEX.auto, '');
                }

                placement = placement.split('-');

                placement[0] = placement[0] || 'top';
                if (!PLACEMENT_REGEX.primary.test(placement[0])) {
                    placement[0] = 'top';
                }

                placement[1] = placement[1] || 'center';
                if (!PLACEMENT_REGEX.secondary.test(placement[1])) {
                    placement[1] = 'center';
                }

                if (autoPlace) {
                    placement[2] = true;
                } else {
                    placement[2] = false;
                }

                return placement;
            },

            /**
             * Provides coordinates for an element to be positioned relative to
             * another element.  Passing 'auto' as part of the placement parameter
             * will enable smart placement - where the element fits. i.e:
             * 'auto left-top' will check to see if there is enough space to the left
             * of the hostElem to fit the targetElem, if not place right (same for secondary
             * top placement).  Available space is calculated using the viewportOffset
             * function.
             *
             * @param {element} hostElem - The element to position against.
             * @param {element} targetElem - The element to position.
             * @param {string=} [placement=top] - The placement for the targetElem,
             *   default is 'top'. 'center' is assumed as secondary placement for
             *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
             *   <ul>
             *     <li>top</li>
             *     <li>top-right</li>
             *     <li>top-left</li>
             *     <li>bottom</li>
             *     <li>bottom-left</li>
             *     <li>bottom-right</li>
             *     <li>left</li>
             *     <li>left-top</li>
             *     <li>left-bottom</li>
             *     <li>right</li>
             *     <li>right-top</li>
             *     <li>right-bottom</li>
             *   </ul>
             * @param {boolean=} [appendToBody=false] - Should the top and left values returned
             *   be calculated from the body element, default is false.
             *
             * @returns {object} An object with the following properties:
             *   <ul>
             *     <li>**top**: Value for targetElem top.</li>
             *     <li>**left**: Value for targetElem left.</li>
             *     <li>**placement**: The resolved placement.</li>
             *   </ul>
             */
            positionElements: function(hostElem, targetElem, placement, appendToBody) {
                hostElem = this.getRawNode(hostElem);
                targetElem = this.getRawNode(targetElem);

                // need to read from prop to support tests.
                var targetWidth = angular.isDefined(targetElem.offsetWidth) ? targetElem.offsetWidth : targetElem.prop('offsetWidth');
                var targetHeight = angular.isDefined(targetElem.offsetHeight) ? targetElem.offsetHeight : targetElem.prop('offsetHeight');

                placement = this.parsePlacement(placement);

                var hostElemPos = appendToBody ? this.offset(hostElem) : this.position(hostElem);
                var targetElemPos = {top: 0, left: 0, placement: ''};

                if (placement[2]) {
                    var viewportOffset = this.viewportOffset(hostElem);

                    var targetElemStyle = $window.getComputedStyle(targetElem);
                    var adjustedSize = {
                        width: targetWidth + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft) + this.parseStyle(targetElemStyle.marginRight))),
                        height: targetHeight + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginTop) + this.parseStyle(targetElemStyle.marginBottom)))
                    };

                    placement[0] = placement[0] === 'top' && adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom ? 'bottom' :
                        placement[0] === 'bottom' && adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top ? 'top' :
                            placement[0] === 'left' && adjustedSize.width > viewportOffset.left && adjustedSize.width <= viewportOffset.right ? 'right' :
                                placement[0] === 'right' && adjustedSize.width > viewportOffset.right && adjustedSize.width <= viewportOffset.left ? 'left' :
                                    placement[0];

                    placement[1] = placement[1] === 'top' && adjustedSize.height - hostElemPos.height > viewportOffset.bottom && adjustedSize.height - hostElemPos.height <= viewportOffset.top ? 'bottom' :
                        placement[1] === 'bottom' && adjustedSize.height - hostElemPos.height > viewportOffset.top && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom ? 'top' :
                            placement[1] === 'left' && adjustedSize.width - hostElemPos.width > viewportOffset.right && adjustedSize.width - hostElemPos.width <= viewportOffset.left ? 'right' :
                                placement[1] === 'right' && adjustedSize.width - hostElemPos.width > viewportOffset.left && adjustedSize.width - hostElemPos.width <= viewportOffset.right ? 'left' :
                                    placement[1];

                    if (placement[1] === 'center') {
                        if (PLACEMENT_REGEX.vertical.test(placement[0])) {
                            var xOverflow = hostElemPos.width / 2 - targetWidth / 2;
                            if (viewportOffset.left + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.right) {
                                placement[1] = 'left';
                            } else if (viewportOffset.right + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.left) {
                                placement[1] = 'right';
                            }
                        } else {
                            var yOverflow = hostElemPos.height / 2 - adjustedSize.height / 2;
                            if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
                                placement[1] = 'top';
                            } else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
                                placement[1] = 'bottom';
                            }
                        }
                    }
                }

                switch (placement[0]) {
                    case 'top':
                        targetElemPos.top = hostElemPos.top - targetHeight;
                        break;
                    case 'bottom':
                        targetElemPos.top = hostElemPos.top + hostElemPos.height;
                        break;
                    case 'left':
                        targetElemPos.left = hostElemPos.left - targetWidth;
                        break;
                    case 'right':
                        targetElemPos.left = hostElemPos.left + hostElemPos.width;
                        break;
                }

                switch (placement[1]) {
                    case 'top':
                        targetElemPos.top = hostElemPos.top;
                        break;
                    case 'bottom':
                        targetElemPos.top = hostElemPos.top + hostElemPos.height - targetHeight;
                        break;
                    case 'left':
                        targetElemPos.left = hostElemPos.left;
                        break;
                    case 'right':
                        targetElemPos.left = hostElemPos.left + hostElemPos.width - targetWidth;
                        break;
                    case 'center':
                        if (PLACEMENT_REGEX.vertical.test(placement[0])) {
                            targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
                        } else {
                            targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
                        }
                        break;
                }

                targetElemPos.top = Math.round(targetElemPos.top);
                targetElemPos.left = Math.round(targetElemPos.left);
                targetElemPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];

                return targetElemPos;
            },

            /**
             * Provides a way for positioning tooltip & dropdown
             * arrows when using placement options beyond the standard
             * left, right, top, or bottom.
             *
             * @param {element} elem - The tooltip/dropdown element.
             * @param {string} placement - The placement for the elem.
             */
            positionArrow: function(elem, placement) {
                elem = this.getRawNode(elem);

                var innerElem = elem.querySelector('.tooltip-inner, .popover-inner');
                if (!innerElem) {
                    return;
                }

                var isTooltip = angular.element(innerElem).hasClass('tooltip-inner');

                var arrowElem = isTooltip ? elem.querySelector('.tooltip-arrow') : elem.querySelector('.arrow');
                if (!arrowElem) {
                    return;
                }

                placement = this.parsePlacement(placement);
                if (placement[1] === 'center') {
                    // no adjustment necessary - just reset styles
                    angular.element(arrowElem).css({top: '', bottom: '', right: '', left: '', margin: ''});
                    return;
                }

                var borderProp = 'border-' + placement[0] + '-width';
                var borderWidth = $window.getComputedStyle(arrowElem)[borderProp];

                var borderRadiusProp = 'border-';
                if (PLACEMENT_REGEX.vertical.test(placement[0])) {
                    borderRadiusProp += placement[0] + '-' + placement[1];
                } else {
                    borderRadiusProp += placement[1] + '-' + placement[0];
                }
                borderRadiusProp += '-radius';
                var borderRadius = $window.getComputedStyle(isTooltip ? innerElem : elem)[borderRadiusProp];

                var arrowCss = {
                    top: 'auto',
                    bottom: 'auto',
                    left: 'auto',
                    right: 'auto',
                    margin: 0
                };

                switch (placement[0]) {
                    case 'top':
                        arrowCss.bottom = isTooltip ? '0' : '-' + borderWidth;
                        break;
                    case 'bottom':
                        arrowCss.top = isTooltip ? '0' : '-' + borderWidth;
                        break;
                    case 'left':
                        arrowCss.right = isTooltip ? '0' : '-' + borderWidth;
                        break;
                    case 'right':
                        arrowCss.left = isTooltip ? '0' : '-' + borderWidth;
                        break;
                }

                arrowCss[placement[1]] = borderRadius;

                angular.element(arrowElem).css(arrowCss);
            }
        };
    }])

.controller('fuguTooltipCtrl',['$scope','$element','$compile', '$attrs', '$timeout','$interpolate','$uibPosition',
        function ($scope,$element,$compile,$attrs,$timeout,$interpolate,$position) {

            //指令初始化
            function initConfig() {
                $scope.trigger = ($scope.trigger&&($scope.trigger==="hover"))?"hover":"click";
                $scope.content = $scope.content||"请设置提示文字";
                // 设置初始值
                $attrs.content = $scope.content;
                $scope.isHover = false;
                $scope.tooltipIsOpen = $scope.tooltipIsOpen||false;
            }
            initConfig();

            //tooltip模板
            var elementTemplate =
                '<div class="tooltip fugu-tooltip"'+
                'tooltip-animation-class="fade" '+
                'uib-tooltip-classes '+
                'ng-class="{in:tooltipIsOpen||isHover}">'+
                '<div class="tooltip-arrow"></div>'+
                '<div class="tooltip-inner" ng-bind="content"></div>'+
                '</div>';
            var element = angular.element(elementTemplate);
            element = $compile(element)($scope);

            //判断触发方式
            if($scope.trigger==="hover") {
                $element.on('mouseenter',function(){
                    addDom();
                    $scope.isHover = true;
                    $scope.$digest();
                })
                $element.on('mouseleave',function(){
                    addDom();
                    $scope.isHover = false;
                    $scope.$digest();
                })
            }

            //计算位移并添加至DOM中
            function addDom() {

                //将计算的偏移量进行填充
                var elePosition = $position.positionElements($element,element,'bottom','false');
                $position.positionArrow(element, elePosition.placement);
                element.addClass("bottom");
                element.css({ top: elePosition.top + 'px', left: elePosition.left + 'px', visibility: 'visible' })
                $element.after(element);
            }

            $scope.$watch('tooltipIsOpen',function(){
                addDom();
            })
}])
.directive('fuguTooltip',function () {
    return {
        restrict: 'AE',
        scope:{
            content:'@?',
            trigger:'@',
            tooltipIsOpen:'=?'
        },
        controller:'fuguTooltipCtrl',
        controllerAs: 'tooltip'
    }
});
/**
 * tree
 * 树形菜单指令
 * Author:penglu02@meituan.com
 * Date:2016-01-28
 */
angular.module('ui.fugu.tree', [])
    .constant('fuguTreeConfig', {
        showIcon: true,
        checkable: true,
        collapsedAll: false,
        editable: false
    })
    .controller('treeController', ['$scope', '$element', '$attrs', 'fuguTreeConfig', function ($scope, $element, $attrs, fuguTreeConfig) {
        var flag = true;
        this.checkedNodes = {}; // 选中节点集合
        // 变量初始化,如果没有设置,则使用默认值
        this.showIcon = angular.isDefined($scope.showIcon) ? $scope.showIcon : fuguTreeConfig.showIcon;
        this.checkable = angular.isDefined($scope.checkable) ? $scope.checkable : fuguTreeConfig.checkable;
        this.expandAll = angular.isDefined($scope.expandAll) ? !$scope.expandAll : fuguTreeConfig.collapsedAll;
        this.editable = angular.isDefined($scope.editable) ? $scope.editable : fuguTreeConfig.editable;
        $scope.nodes = checkNodesStyle($scope.$parent.$eval($attrs.ngModel)) ? $scope.$parent.$eval($attrs.ngModel) : [];  // 获取ng-model绑定节点对象

        /**
         *  检查传递的树结构数组是否正确,如果结构正确返回true否则返回false
         * @param {array} nodes ngModel绑定树结构数组对象
         */
        function checkNodesStyle(nodes){
            var i = 0;
            if(nodes instanceof Array){
                for(i=0; i<nodes.length; i++){
                    if(!nodes[i].label){
                        flag = false;
                    }else{
                        if(nodes[i].children && nodes[i].children.length > 0){
                            return checkNodesStyle(nodes[i].children);
                        }else{
                            if(Object.getOwnPropertyNames(nodes[i]).length > 1){
                                flag = false;
                            }
                         }
                    }
                }
                return flag;
            }else{
                return false;  // 非对象格式
            }
        }
    }])
    .directive('fuguTree', ['fuguTreeConfig', '$parse', function () {
        return {
            restrict: 'AE',
            scope: {
                showIcon: '=?',
                checkable: '=?',
                expandAll: '=?',
                editable: '=?',
                onClick: '&?',
                onCheckChange: '&?'
            },
            replace: true,
            require: ['ngModel'],
            templateUrl: 'templates/tree.html',
            controller: 'treeController',
            link: function (scope) {
                var clickFn = scope.onClick(),  //获取绑定在tree上的click事件回调
                    checkFn = scope.onCheckChange();  //获取绑定在tree上的check事件回调
                /**
                 * 捕获click事件，进行绑定事件处理
                 */
                scope.$on('on-click', function (e, data) {
                    if (angular.isDefined(clickFn)) {
                        clickFn(data);
                    }
                });

                /**
                 * 捕获check改变事件，绑定事件处理
                 */
                scope.$on('on-check', function(e, data){
                    if (angular.isDefined(checkFn)) {
                        checkFn(data);
                    }
                });
            }
        }
    }])
    .controller('treeNodeController', ['$scope', function ($scope) {


        /**
         * 阻止事件传播
         * @param {object} event 事件对象
         */
        $scope.preventClick = function (event) {
            event.stopPropagation();
        };

        /**
         * 向上派发单击事件,传递当前单击对象节点信息以及其子节点
         * @param {object} e 事件对象
         */
        $scope.clickFn = function (e) {
            $scope.$emit('on-click', e.node); // 向上派发事件,同时暴露出当前点击节点信息
        };

        $scope.toggleCollapsed = function(e, scope){
            e.stopPropagation();
            if(scope.node.children && scope.node.children.length > 0){
                $scope.collapsed = !$scope.collapsed;  // 闭合元素
            }
        };

        /**
         * 向上|向下派发事件(注意节点自身派发出去的事件，会被自身先捕获一次)
         * @param {boolean} selected checkbox选中|取消状态
         * @param self 选中|取消checkbox自己
         */
        $scope.checkFn = function (selected) {
            // 派发的先后顺序对代码执行会有影响
            $scope.$broadcast('check-change', selected);   // 向下派发事件
            $scope.$emit('check-change', selected);  // 向上派发事件
            $scope.$emit('on-check', $scope.treeCtrl.checkedNodes);  // 向上派发事件,同时向上暴露选中节点集合
        };

        /**
         * 捕获勾选状态修改事件,执行勾选|取消勾选操作,修改勾选集合
         */
        $scope.$on('check-change', function (event, selected) {
            var currentScope = event.currentScope,    //当前事件节点scope
                targetScope = event.targetScope,    // 原始触发选中|取消节点scope
                leafFlag = !(currentScope.node.children && currentScope.node.children.length > 0),  // 叶子节点标识
                parentFlag = false,   //子节点触发父节点(true)｜父节点触发子节点(false)标识
                selfFlag = true,    //节点本身勾选|不选标识
                targetParentScope = targetScope.$parent.$parent,  // 获取当前节点的父节点scope
                checkNodes = currentScope.treeCtrl.checkedNodes,  // 选中节点集合
                i = 0,
                childrensEle = null,   //当前节点非叶子节点时的孩子节点
                selectFlag = true,    // 孩子节点是否全部勾选标识
                childrenScope = null,  //遍历孩子节点的scope
                subElements = null;   //子节点对象集合

            // 判断是父节点触发还是子节点触发,还是自身触发
            if (targetScope.$id === currentScope.$id) {  //通过勾选|取消勾选触发
                parentFlag = false;
                selfFlag = true;
            } else {
                selfFlag = false;

                // 判断是否为子节点触发父节点:向上触发
                while (targetParentScope) {
                    if (targetParentScope.$id === currentScope.$id) {  // 目标触发节点是父节点
                        parentFlag = true;
                        break;
                    } else {
                        targetParentScope = targetParentScope.$parent ? targetParentScope.$parent.$parent : targetParentScope.$parent;   //获取父scope
                    }
                }
            }

            // 节点分为叶子节点和非叶子节点进行处理
            if (!leafFlag) {  // 非叶子节点

                if (selected) {   // 选中

                    // 判断是够为向上触发:子触发父
                    if (parentFlag) {
                        childrensEle = currentScope.ele.children('ol').children('li');  // 获取子节点
                        for (i = 0; i < childrensEle.length; i++) {
                            childrenScope = childrensEle.eq(i).children('div').children('div').children('input').scope();  // 获取当前遍历节点勾选框的scope
                            if (childrenScope.selected !== selected) { //判断孩子节点是否为选中状态
                                selectFlag = false;   //存在未否选孩子节点
                                break;
                            }
                        }
                        // 子选父:子节点全部勾选,则选中父节点
                        if (selectFlag) {
                            reselect(childrensEle, checkNodes);  //重新保存选中集合(父加入集合，则需要移除原有的子孙集合)
                            currentScope.selected = selected;
                            currentScope.ele.children('div').children('input').checked = selected;  // 实现勾选
                            checkNodes[currentScope.$id] = currentScope.node;  // 保存节点信息到集合
                        }
                    }

                    //判断是否为向下触发:父选择触发子选择
                    if (!parentFlag && !selfFlag) { //触发子非叶子节点
                        // 只需要修改勾选状态
                        event.currentScope.selected = selected;
                        event.currentScope.ele.children('div').children('input').checked = selected;
                    }

                    // 自己勾选触发事件
                    if (selfFlag) {
                        event.currentScope.selected = selected;  //修改勾选状态
                        event.currentScope.ele.children('div').children('input').checked = selected;
                        checkNodes[event.currentScope.$id] = event.currentScope.node;   // 保存节点信息
                        reselect(event.currentScope.ele.children('ol').children('li'), checkNodes);  //重新保存选中集合(父加入集合，则需要移除原有的子孙集合)
                    }

                } else {
                    // 修改勾选状态
                    currentScope.selected = selected;
                    currentScope.ele.children('div').children('input').checked = selected;
                    if (angular.isDefined(checkNodes[currentScope.$id])) {  // 判断当前节点是否再勾选集合中
                        delete  checkNodes[event.currentScope.$id];  // 删除勾选集合中当前元素
                    }

                    // 取消勾选子触发父节点也不选中
                    if (parentFlag) {
                        childrensEle = event.currentScope.ele.children('ol').children('li'); // 获取当前节点的孩子节点
                        for (i = 0; i < childrensEle.length; i++) {
                            subElements = childrensEle.eq(i).children('div').children('div').children('input');
                            if (subElements.scope().selected) {  // 判断子节点是否为选中
                                // 选中子节点的节点信息存入选中集合
                                checkNodes[subElements.scope().$id] = subElements.scope().node;
                            }
                        }
                    }
                }

            } else {   // 叶子节点

                // 父选子:向下触发,只需改变勾选状态,不用修改节点集合
                if (!parentFlag && !selfFlag) {
                    event.currentScope.selected = selected;
                    event.currentScope.ele.children('div').children('input').checked = selected;
                }

                // 自己选自己:修改勾选状态
                if (selfFlag) {
                    event.currentScope.selected = selected;
                    event.currentScope.ele.children('div').children('input').checked = selected;
                    if (selected) {  // 勾选的保存信息到节点集合
                        checkNodes[event.currentScope.$id] = event.currentScope.node;  // 保存节点信息
                    }
                }

                // 取消勾选时,从勾选节点集合中移除
                if (!selected) {
                    if (angular.isDefined(checkNodes[event.currentScope.$id])) {
                        delete  checkNodes[event.currentScope.$id];
                    }
                }
            }
        });

        /**
         * 选中父节点时,需要对选中节点数组进行重新选择，保证数组中出现的节点不重复(添加父亲node，则无需添加子node)
         * @param {array} ele:子元素对象数组
         * @param {array} checkNodes:tree选中节点数组集合
         */
        function reselect(ele, checkNodes) {
            var i = 0,
                subElements = null,
                subScope = null,
                innerEle = null;
            for (; i < ele.length; i++) {
                subElements = ele.eq(i).children('div').children('div').children('input');  // 获取子节点选择框
                subScope = subElements.scope(); //获取子节点
                if (subElements.length > 0 && angular.isDefined(checkNodes[subScope.$id])) {  // 判断取消节点是否为当前节点
                    delete checkNodes[subScope.$id]; // 如果当前子节点选中，则存入
                } else {
                    innerEle = ele.eq(i).children('div').children('ol').children('li');
                    if (innerEle.length > 0) {
                        reselect(innerEle, checkNodes);
                    }
                }
            }
        }
    }])
    .directive('treeNode', ['$parse', '$compile', function ($parse, $compile) {
        return {
            restrict: 'AE',
            scope: {
                node: '='
            },
            replace: true,
            require: ['^fuguTree'],
            templateUrl: 'templates/tree-node.html',
            controller: 'treeNodeController',
            link: function (scope, element, attrs, ctrls) {
                var tpl = null,
                    htmlTpl = null;
                scope.treeCtrl = ctrls[0];  // 保存树ctrl
                scope.ele = element;  // 保存节点元素
                scope.collapsed = scope.treeCtrl.expandAll;  // 文件夹展开|收起标识
                scope.showIcon = scope.treeCtrl.showIcon;  // 是否显示图标标识
                scope.checkable = scope.treeCtrl.checkable;  // 是否勾选标识

                // 动态插入子节点
                if (scope.node.children && scope.node.children.length > 0) {
                    tpl = '<li ng-repeat="node in  node.children"><tree-node data-node="node"></tree-node><ol></ol></li>';
                    htmlTpl = $compile(tpl)(scope);
                    element.find('ol').append(htmlTpl);
                }
            }
        }
    }]);
angular.module("alert/templates/alert.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/alert.html",
    "<div ng-show=\"!defaultclose\" class=\"alert fugu-alert\" ng-class=\"['alert-' + (type || 'warning'), closeable ? 'alert-dismissible' : null]\" role=\"alert\">"+
    "    <div ng-show=\"hasIcon\" class=\"alert-icon\">"+
    "        <span class=\"alert-icon-span glyphicon\" ng-class=\"'glyphicon-'+iconClass\"></span>"+
    "    </div>"+
    "    <button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"closeFunc({$event: $event})\">"+
    "        <span ng-if=\"!closeText\">&times;</span>"+
    "        <span class=\"cancel-text\" ng-if=\"closeText\">{{closeText}}</span>"+
    "    </button>"+
    "    <!--<div ng-class=\"[hasIcon?'show-icon' : null]\" ng-transclude></div>-->"+
    "    <div ng-class=\"{true:'show-icon' ,false: null}[hasIcon]\" ng-transclude></div>"+
    ""+
    "</div>");
}]);
angular.module("button/templates/button.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/button.html",
    "<button class=\"btn\" type=\"{{type}}\" ng-class=\"{'btn-addon': iconFlag}\"><i class=\"glyphicon\" ng-class=\"icon\" ng-show=\"iconFlag\"></i>{{text}}</button>");
}]);
angular.module("buttonGroup/templates/buttonGroup.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/buttonGroup.html",
    "<div class=\"btn-group\">"+
    "    <label class=\"btn  btn-default\"  ng-class=\"[showClass, size, disabled, btn.active]\" ng-repeat=\"btn in buttons\" ng-click=\"clickFn(btn, $event)\">{{btn.value}}</label>"+
    "</div>");
}]);
angular.module("calendar/templates/calendar.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/calendar.html",
    "<div class=\"fugu-calendar\">"+
    "    <div class=\"fugu-cal-panel-day\" ng-show=\"panels.day\">"+
    "        <div class=\"fugu-cal-month\">"+
    "            <i class=\"fugu-cal-pre-button glyphicon glyphicon-chevron-left\" ng-click=\"prevMonth()\"></i>"+
    "            <span class=\"fugu-cal-month-name\">"+
    "                <a href=\"javascript:;\" ng-click=\"selectPanel('month')\">{{FORMATS.SHORTMONTH[currentMonth]}}</a>"+
    "                <a href=\"javascript:;\" ng-click=\"selectYearPanelHandler()\">{{currentYear}}</a>"+
    "            </span>"+
    "            <i class=\"fugu-cal-next-button glyphicon glyphicon-chevron-right\" ng-click=\"nextMonth()\"></i>"+
    "        </div>"+
    "        <div class=\"fugu-cal-header clearfix\">"+
    "            <div ng-repeat=\"day in dayNames track by $index\">{{day}}</div>"+
    "        </div>"+
    "        <div class=\"fugu-cal-body\">"+
    "            <div class=\"fugu-cal-row\" ng-repeat=\"row in allDays\">"+
    "                <div ng-class=\"{'fugu-cal-select':day.index===currentDay,'fugu-cal-outside':!day.inMonth,'fugu-cal-weekday':day.isWeekend,'fugu-cal-day-today':day.isToday,'fugu-cal-day-disabled':day.isDisabled}\""+
    "                     class=\"fugu-cal-day\" ng-repeat=\"day in row\" ng-click=\"selectDayHandler(day)\">"+
    "                    <span class=\"fugu-cal-day-inner\">{{day.day}}</span>"+
    "                </div>"+
    "            </div>"+
    "        </div>"+
    "        <div class=\"fugu-cal-footer\">"+
    "            <div class=\"fugu-cal-time\" ng-click=\"selectTimePanelHandler()\" ng-if=\"showTime\">"+
    "                <span class=\"glyphicon glyphicon-time\"></span>"+
    "                {{selectDate | date:'shortTime'}}"+
    "            </div>"+
    "            <div class=\"fugu-cal-today-btn\" ng-click=\"chooseToday()\">Today</div>"+
    "        </div>"+
    "    </div>"+
    "    <div class=\"fugu-cal-panel-time\" ng-show=\"panels.time\"> <!--这里要用ng-show,不能用ng-if-->"+
    "        <fugu-timepanel ng-model=\"selectDate\"></fugu-timepanel>"+
    "        <div class=\"btn-group clearfix\">"+
    "            <button class=\"btn btn-sm btn-default fugu-cal-time-cancal\" ng-click=\"timePanelBack()\">返回</button>"+
    "            <button class=\"btn btn-sm btn-default fugu-cal-time-now\" ng-click=\"timePanelSelectNow()\">此刻</button>"+
    "            <button class=\"btn btn-sm btn-default fugu-cal-time-ok\" ng-click=\"timePanelOk()\">确定 </button>"+
    "        </div>"+
    "    </div>"+
    "    <div class=\"fugu-cal-panel-month\" ng-show=\"panels.month\">"+
    "        <div class=\"fugu-cal-month\">"+
    "            <span class=\"fugu-cal-month-name\">"+
    "                <a href=\"javascript:;\" ng-click=\"selectYearPanelHandler()\">{{currentYear}}</a>"+
    "            </span>"+
    "        </div>"+
    "        <div class=\"fugu-cal-body\">"+
    "            <table class=\"fugu-cal-month-table\">"+
    "                <tr ng-repeat=\"monthRow in allMonths\">"+
    "                    <td class=\"fugu-cal-month-item\""+
    "                        ng-repeat=\"month in monthRow\""+
    "                        ng-click=\"chooseMonthHandler(month.index)\""+
    "                        ng-class=\"{'fugu-cal-month-select':month.index === currentMonth}\">"+
    "                        <span class=\"fugu-cal-month-inner\">{{month.name}}</span>"+
    "                    </td>"+
    "                </tr>"+
    "            </table>"+
    "        </div>"+
    "    </div>"+
    "    <div class=\"fugu-cal-panel-year\" ng-show=\"panels.year\">"+
    "        <div class=\"fugu-cal-month\">"+
    "            <i class=\"fugu-cal-pre-button glyphicon glyphicon-chevron-left\" ng-click=\"prev12Years()\"></i>"+
    "            <span class=\"fugu-cal-month-name\">"+
    "                <a href=\"javascript:;\">{{allYears[0][0]}}-{{allYears[3][2]}}</a>"+
    "            </span>"+
    "            <i class=\"fugu-cal-next-button glyphicon glyphicon-chevron-right\" ng-click=\"next12Years()\"></i>"+
    "        </div>"+
    "        <div class=\"fugu-cal-body\">"+
    "            <table class=\"fugu-cal-month-table\">"+
    "                <tr ng-repeat=\"yearRow in allYears track by $index\">"+
    "                    <td class=\"fugu-cal-month-item fugu-cal-year-item\""+
    "                        ng-repeat=\"year in yearRow track by $index\""+
    "                        ng-click=\"chooseYearHandler(year)\""+
    "                        ng-class=\"{'fugu-cal-month-select':year === currentYear}\">"+
    "                        <span class=\"fugu-cal-month-inner\">{{year}}</span>"+
    "                    </td>"+
    "                </tr>"+
    "            </table>"+
    "        </div>"+
    "    </div>"+
    "</div>");
}]);
angular.module("datepicker/templates/datepicker.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/datepicker.html",
    "<div class=\"fugu-datepicker\">"+
    "    <div class=\"input-group\">"+
    "        <input type=\"text\" ng-disabled=\"isDisabled\" class=\"input-sm form-control fugu-datepicker-input\" ng-click=\"toggleCalendarHandler($event)\" placeholder=\"{{placeholder}}\" ng-model=\"inputValue\">"+
    "        <span class=\"input-group-btn\" ng-if=\"clearBtn\">"+
    "            <button ng-disabled=\"isDisabled\" class=\"btn btn-sm btn-default fugu-datepicker-remove\" type=\"button\" ng-click=\"clearDateHandler($event)\">"+
    "                <i class=\"glyphicon glyphicon-remove\"></i>"+
    "            </button>"+
    "        </span>"+
    "        <span class=\"input-group-btn\">"+
    "            <button ng-disabled=\"isDisabled\" class=\"btn btn-sm btn-default\" type=\"button\" ng-click=\"toggleCalendarHandler($event)\">"+
    "                <i class=\"glyphicon glyphicon-calendar\"></i>"+
    "            </button>"+
    "        </span>"+
    "    </div>"+
    "    <fugu-calendar ng-model=\"selectDate\" ng-if=\"showCalendar\" on-change=\"changeDateHandler\""+
    "                   exceptions=\"exceptions\" min-date=\"minDate\" max-date=\"maxDate\"></fugu-calendar>"+
    "</div>"+
    "");
}]);
angular.module("dropdown/templates/dropdown-choices.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/dropdown-choices.html",
    "<li>"+
    "    <a href=\"javascript:;\" ng-transclude></a>"+
    "</li>");
}]);
angular.module("dropdown/templates/dropdown.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/dropdown.html",
    "<div class=\"btn-group dropdown\" ng-class=\"[{true:multiColClass}[count>colsNum],{true:openClass}[isOpen]]\">"+
    "    <button type=\"button\" ng-click=\"toggleDropdown($event)\" ng-disabled=\"isDisabled\" class=\"btn btn-sm btn-primary dropdown-toggle\">"+
    "        {{btnValue}}&nbsp;<span class=\"caret\"></span>"+
    "    </button>"+
    "    <ul class=\"dropdown-menu\" ng-style=\"{width:count>colsNum?colsNum*eachItemWidth:'auto'}\" ng-transclude></ul>"+
    "</div>");
}]);
angular.module("modal/templates/backdrop.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/backdrop.html",
    "<div class=\"modal-backdrop fade {{ backdropClass }}\""+
    "     ng-class=\"{in: animate}\""+
    "     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\""+
    "></div>"+
    "");
}]);
angular.module("modal/templates/window.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/window.html",
    "<div tabindex=\"-1\" role=\"dialog\" class=\"modal fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">"+
    "    <div class=\"modal-dialog\" ng-class=\"{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}\">"+
    "        <div class=\"modal-content\" fugu-modal-transclude></div>"+
    "    </div>"+
    "</div>");
}]);
angular.module("notification/templates/notification.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/notification.html",
    "<div class=\"notice-container\">"+
    "    <div class=\"notice-item\" ng-repeat=\"notification in notifications\">"+
    "        <!--<fugu-alert type=\"{{notification.type}}\" has-icon=\"{{notification.disableIcon}}\" close=\"{{!notification.disableCloseBtn}}\" close-func=\"closeFn(notification)\" class=\"media-heading\">{{notification.text}}</fugu-alert>-->"+
    "        <fugu-alert type=\"{{notification.type}}\" has-icon=\"true\" close=\"{{!notification.disableCloseBtn}}\" close-func=\"closeFn(notification)\" class=\"media-heading\">{{notification.text}}</fugu-alert>"+
    "    </div>"+
    "</div>");
}]);
angular.module("pager/templates/pager.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/pager.html",
    "<ul class=\"pagination pagination-sm m-t-none m-b-none\">"+
    "    <li ng-class=\"{disabled: isFirst()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"first()\">{{getText('first')}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isFirst()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"previous()\">{{getText('previous')}}</a>"+
    "    </li>"+
    "    <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"selectPage(page.pageIndex)\">{{page.pageIndex + 1}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isLast()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"next()\">{{getText('next')}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isLast()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"last()\">{{getText('last')}}</a>"+
    "    </li>"+
    "    <li class=\"disabled\">"+
    "        <a href=\"javascript:void(0)\">共{{totalPages}}页 / {{totalItems}}条</a>"+
    "    </li>"+
    "</ul>");
}]);
angular.module("searchBox/templates/searchBox.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/searchBox.html",
    "<div ng-class=\"{'input-group':showBtn}\">"+
    "    <input type=\"text\" class=\"input-sm form-control\" ng-keyup=\"keyUpToSearch($event)\" placeholder=\"{{placeholder}}\" ng-model=\"searchBox.query\">"+
    "    <span class=\"input-group-btn\" ng-if=\"showBtn\">"+
    "        <button class=\"btn btn-sm btn-default\" type=\"button\" ng-click=\"doSearch()\">{{getText()}}</button>"+
    "    </span>"+
    "</div>"+
    "");
}]);
angular.module("select/templates/choices.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/choices.html",
    "<ul class=\"fugu-select-choices fugu-select-choices-content fugu-select-dropdown dropdown-menu\""+
    "    role=\"listbox\""+
    "    ng-show=\"$select.items.length > 0\">"+
    "  <li class=\"fugu-select-choices-group\">"+
    "    <div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div>"+
    "    <div ng-show=\"$select.isGrouped\" class=\"fugu-select-choices-group-label dropdown-header\" ng-bind=\"$group.name\"></div>"+
    "    <div class=\"fugu-select-choices-row\""+
    "    ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\" role=\"option\">"+
    "      <a href=\"javascript:void(0)\" class=\"fugu-select-choices-row-inner\"></a>"+
    "    </div>"+
    "  </li>"+
    "</ul>"+
    "");
}]);
angular.module("select/templates/match-multiple.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/match-multiple.html",
    "<span class=\"fugu-select-match\">"+
    "  <span ng-repeat=\"$item in $select.selected\">"+
    "    <span"+
    "      class=\"fugu-select-match-item btn btn-default btn-xs\""+
    "      tabindex=\"-1\""+
    "      type=\"button\""+
    "      ng-disabled=\"$select.disabled\""+
    "      ng-click=\"$selectMultiple.activeMatchIndex = $index;\""+
    "      ng-class=\"{'btn-primary':$selectMultiple.activeMatchIndex === $index, 'select-locked':$select.isLocked(this, $index)}\""+
    "      fugu-select-sort=\"$select.selected\">"+
    "        <span class=\"close fugu-select-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$selectMultiple.removeChoice($index)\">&nbsp;&times;</span>"+
    "        <span fugu-transclude-append></span>"+
    "    </span>"+
    "  </span>"+
    "</span>"+
    "");
}]);
angular.module("select/templates/match.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/match.html",
    "<div class=\"fugu-select-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{'fugu-select-focus':$select.focus}\">"+
    "  <span tabindex=\"-1\""+
    "      class=\"btn btn-default form-control fugu-select-toggle\""+
    "      aria-label=\"{{ $select.baseTitle }} activate\""+
    "      ng-disabled=\"$select.disabled\""+
    "      ng-click=\"$select.activate()\">"+
    "    <span ng-show=\"$select.isEmpty()\" class=\"fugu-select-placeholder text-muted\">{{$select.placeholder}}</span>"+
    "    <span ng-hide=\"$select.isEmpty()\" class=\"fugu-select-match-text pull-left\" ng-class=\"{'fugu-select-allow-clear': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span>"+
    "    <i class=\"caret pull-right\" ng-click=\"$select.toggle($event)\"></i>"+
    "    <a ng-show=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\""+
    "      ng-click=\"$select.clear($event)\" class=\"fugu-select-allowclear btn btn-xs btn-link pull-right\">"+
    "      <i class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></i>"+
    "    </a>"+
    "  </span>"+
    "</div>"+
    "");
}]);
angular.module("select/templates/select-multiple.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/select-multiple.html",
    "<div class=\"fugu-select-container fugu-select-multiple fugu-select dropdown form-control\" ng-class=\"{open: $select.open}\">"+
    "  <div>"+
    "    <div class=\"fugu-select-match\"></div>"+
    "    <input type=\"text\""+
    "           autocomplete=\"off\""+
    "           autocorrect=\"off\""+
    "           autocapitalize=\"off\""+
    "           spellcheck=\"false\""+
    "           class=\"fugu-select-search input-xs\""+
    "           placeholder=\"{{$selectMultiple.getPlaceholder()}}\""+
    "           ng-disabled=\"$select.disabled\""+
    "           ng-hide=\"$select.disabled\""+
    "           ng-click=\"$select.activate()\""+
    "           ng-model=\"$select.search\""+
    "           role=\"combobox\""+
    "           aria-label=\"{{ $select.baseTitle }}\""+
    "           ondrop=\"return false;\">"+
    "  </div>"+
    "  <div class=\"fugu-select-choices\"></div>"+
    "</div>"+
    "");
}]);
angular.module("select/templates/select.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/select.html",
    "<div class=\"fugu-select-container fugu-select dropdown\" ng-class=\"{open: $select.open}\">"+
    "  <div class=\"fugu-select-match\"></div>"+
    "  <input type=\"text\" autocomplete=\"off\" tabindex=\"-1\""+
    "         aria-expanded=\"true\""+
    "         aria-label=\"{{ $select.baseTitle }}\""+
    "         class=\"form-control fugu-select-search\""+
    "         placeholder=\"{{$select.placeholder}}\""+
    "         ng-model=\"$select.search\""+
    "         ng-show=\"$select.searchEnabled && $select.open\">"+
    "  <div class=\"fugu-select-choices\"></div>"+
    "</div>"+
    "");
}]);
angular.module("switch/templates/switch.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/switch.html",
    "<label class=\"fugu-switch\" ng-class=\"['fugu-switch-'+switchObj.type,'fugu-switch-'+switchObj.size]\">"+
    "    <input type=\"checkbox\" ng-change=\"changeSwitchHandler()\" ng-disabled=\"switchObj.isDisabled\" ng-model=\"switchObj.query\"/>"+
    "    <i></i>"+
    "</label>");
}]);
angular.module("timepanel/templates/timepanel.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/timepanel.html",
    "<div class=\"fugu-timepanel\">"+
    "    <div class=\"fugu-timepanel-col\">"+
    "        <div class=\"fugu-timepanel-top\" ng-click=\"decrease('hour',23)\">{{hour | smallerValue:23:hourStep}}</div>"+
    "        <div class=\"fugu-timepanel-middle clearfix\">"+
    "            <input class=\"fugu-timepanel-input\" type=\"text\" ng-change=\"changeInputValue('hour',23)\" ng-model=\"hour\" placeholder=\"HH\"/>"+
    "            <span class=\"fugu-timepanel-label\">时</span>"+
    "        </div>"+
    "        <div class=\"fugu-timepanel-bottom\" ng-click=\"increase('hour',23)\">{{hour | largerValue:23:hourStep}}</div>"+
    "    </div>"+
    "    <div class=\"fugu-timepanel-col\">"+
    "        <div class=\"fugu-timepanel-top\" ng-click=\"decrease('minute',59)\">{{minute | smallerValue:59:minuteStep}}</div>"+
    "        <div class=\"fugu-timepanel-middle clearfix\">"+
    "            <input class=\"fugu-timepanel-input\" type=\"text\" ng-change=\"changeInputValue('minute',59)\" ng-model=\"minute\" placeholder=\"MM\"/>"+
    "            <span class=\"fugu-timepanel-label\">分</span>"+
    "        </div>"+
    "        <div class=\"fugu-timepanel-bottom\" ng-click=\"increase('minute',59)\">{{minute | largerValue:59:minuteStep}}</div>"+
    "    </div>"+
    "    <div class=\"fugu-timepanel-col\" ng-show=\"showSeconds\">"+
    "        <div class=\"fugu-timepanel-top\" ng-click=\"decrease('second',59)\">{{second | smallerValue:59:secondStep}}</div>"+
    "        <div class=\"fugu-timepanel-middle clearfix\">"+
    "            <input class=\"fugu-timepanel-input\" type=\"text\" ng-change=\"changeInputValue('second',59)\" ng-model=\"second\" placeholder=\"SS\"/>"+
    "            <span class=\"fugu-timepanel-label\">秒</span>"+
    "        </div>"+
    "        <div class=\"fugu-timepanel-bottom\" ng-click=\"increase('second',59)\">{{second | largerValue:59:secondStep}}</div>"+
    "    </div>"+
    "</div>"+
    "");
}]);
angular.module("timepicker/templates/timepicker.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/timepicker.html",
    "<div class=\"fugu-timepicker\">"+
    "    <div class=\"input-group\">"+
    "        <input type=\"text\" ng-disabled=\"isDisabled\" class=\"input-sm form-control fugu-timepicker-input\" ng-click=\"toggleTimepanel($event)\" placeholder=\"{{placeholder}}\" ng-model=\"inputValue\">"+
    "        <span class=\"input-group-btn\">"+
    "            <button ng-disabled=\"isDisabled\" class=\"btn btn-sm btn-default\" type=\"button\" ng-click=\"toggleTimepanel($event)\">"+
    "                <i class=\"glyphicon glyphicon-time\"></i>"+
    "            </button>"+
    "        </span>"+
    "    </div>"+
    "    <fugu-timepanel hour-step=\"hourStep\" minute-step=\"minuteStep\" second-step=\"secondStep\" class=\"fugu-timepicker-timepanel-bottom\" ng-model=\"selectedTime\" on-change=\"changeTime\" ng-show=\"showTimepanel\"></fugu-timepanel>"+
    "</div>"+
    "");
}]);
angular.module("tree/templates/tree-node.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/tree-node.html",
    "<div>"+
    "    <div class=\"cur\" ng-click=\"clickFn(this)\">"+
    "        <input type=\"checkbox\" ng-model=\"selected\" ng-change=\"checkFn(selected)\" ng-click=\"preventClick($event)\" ng-show=\"checkable\"/>"+
    "        <span ng-if=\"node.children && node.children.length > 0\" ng-click=\"toggleCollapsed($event, this)\">"+
    "            <i class=\"glyphicon\" ng-class=\"{'glyphicon-folder-close': collapsed&&showIcon, 'glyphicon-folder-open': !collapsed&&showIcon}\" ></i>"+
    "        </span>"+
    "        <span ng-if=\"!node.children || node.children.length == 0\" ng-click=\"preventClick($event)\">"+
    "            <i class=\"glyphicon glyphicon-file\" ng-show=\"showIcon\"></i>"+
    "        </span>"+
    "        {{node.label}}"+
    "        <span ng-show=\"editable\">"+
    "            <span class=\"btn btn-xs m-10-neg\" ng-click=\"add($event, this)\">"+
    "                <i class=\"glyphicon glyphicon-plus-sign\"></i>"+
    "            </span>"+
    "            <span class=\"btn btn-xs m-10-neg\" ng-click=\"delete($event, this)\">"+
    "                <i class=\"glyphicon glyphicon-trash\"></i>"+
    "            </span>"+
    "             <span class=\"btn btn-xs\" ng-click=\"edit($event, this)\">"+
    "                <i class=\"glyphicon glyphicon-edit\"></i>"+
    "            </span>"+
    "        </span>"+
    "    </div>"+
    "    <ol ng-show=\"!collapsed\">"+
    "    </ol>"+
    "</div>");
}]);
angular.module("tree/templates/tree.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/tree.html",
    "<div class=\"tree\">"+
    "    <ol ng-show=\"nodes && nodes.length > 0 && !collapsedAll\" class=\"tree-content\">"+
    "        <li ng-repeat=\"node in nodes\">"+
    "            <tree-node  data-node=\"node\" ng-if=\"node.children && node.children.length > 0\"></tree-node>"+
    "            <tree-node data-node=\"node\" ng-if=\"!node.children || node.children.length == 0\"></tree-node>"+
    "        </li>"+
    "    </ol>"+
    "</div>");
}]);