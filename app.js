var myApp = angular.module("myApp", ['ui.router', 'infinite-scroll', 'mgcrea.pullToRefresh']);

myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	if(!$httpProvider.defaults.headers.get) $httpProvider.defaults.headers.get = {};

	// IE 9 浏览器中ajax呼叫时，文件缓存的问题（modify配置文件的时间调制。）
	$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
	$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

	// 初始化路由默认页面
	$urlRouterProvider.when("", "/history");

	// 设置页面路由指向
	$stateProvider.state("history", {
		url: "/history",
		templateUrl: "./view/history.html"
	});
});

myApp.controller('DemoController', function($scope, $timeout, Reddit) {
	$scope.reddit = new Reddit();

	$(document).ready(function() {
		$timeout((function() {
			var globalHeaderH = parseInt($('.global-header').css('height'));
			var historyFilterH = parseInt($('.history-filter').css('height'));
			var docH = parseInt($(document).outerHeight());
			$('.history-top').css('height', (docH - globalHeaderH - historyFilterH));
		}), 0);
	});

});

// Reddit 获取分页数据信息和逻辑处理。
myApp.factory('Reddit', function($http, $timeout, $q) {
	var Reddit = function() {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.pageNum = 0;
		this.m = 10;
	};

	Reddit.prototype.onReload = function() {
		console.warn('reload start');
		var deferred = $q.defer();
		
		// 请根据自己的情况请求数据和输出数据。
		$timeout(function() {
			this.items = [];
			this.pageNum = 0;
			this.m = 10;
			for(this.pageNum; this.pageNum < this.m; this.pageNum++) {
				this.items.push({
					_dt: this.pageNum,
					_mm: '10:11:' + this.pageNum,
					_money: 1000 + this.pageNum,
					_type: 'carson',
					_state: 'active',
					_posname: 'posname-' + this.pageNum
				});
			}
			deferred.resolve(true);
			this.m += 10;
		}.bind(this), 1000);
		console.warn('reload end');
		return deferred.promise;
	};

	Reddit.prototype.nextPage = function() {
		if(this.busy) return;
		this.busy = true;
		var start = +new Date();
		var elapsed = +new Date() - start;
		console.warn('nextPage');

		var deferred = $q.defer();
		
		// 定时器做的是假数据，实际使用请删除
		$timeout(function() {
			for(this.pageNum; this.pageNum < this.m; this.pageNum++) {
				this.items.push({
					_dt: this.pageNum,
					_mm: '10:11:' + (0 + this.pageNum),
					_money: 1000 + this.pageNum,
					_type: 'carson',
					_state: 'active',
					_posname: 'posname-' + this.pageNum
				});
			}
			this.m += 10;
			this.busy = false;
			deferred.resolve(true);
		}.bind(this), elapsed < 1000 ? 1000 - elapsed : 0);

		// 请根据自己的情况请求数据和输出数据。
		//		var url = "https://api.orzhtml.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
		//		$http.jsonp(url).success(function(data) {
		//			var items = data.data.children;
		//			for(var i = 0; i < items.length; i++) {
		//				this.items.push(items[i].data);
		//			}
		//			this.after = "t3_" + this.items[this.items.length - 1].id;
		
		//			this.busy = false;
		
		//			deferred.resolve(true);
		//		}.bind(this));

		return deferred.promise;
	};

	return Reddit;
});