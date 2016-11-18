/* ng-pull-to-refresh - v1.0.1 - 2016-11-16 */

angular.module('mgcrea.pullToRefresh', []).constant('pullToRefreshConfig', {
	treshold: 60,
	debounce: 400,
	text: {
		pull: 'pull to refresh',
		release: 'release to refresh',
		loading: 'refreshing...'
	},
	icon: {
		pull: 'icon icon-arrow-down',
		release: 'icon icon-arrow-up',
		loading: 'icon icon-refresh fa-spin'
	}
}).directive('pullToRefresh', [
	'$compile',
	'$timeout',
	'$q',
	'pullToRefreshConfig',
	function($compile, $timeout, $q, pullToRefreshConfig) {
		return {
			scope: true,
			restrict: 'A',
			transclude: true,
			templateUrl: 'angular-pull-to-refresh.tpl.html',
			compile: function compile(tElement, tAttrs, transclude) {
				return function postLink(scope, iElement, iAttrs) {
					var config = angular.extend({}, pullToRefreshConfig, iAttrs);
					var scrollElement = iElement.parent();
					var ptrElement = window.ptr = iElement.children()[0];
					scope.text = config.text;
					scope.icon = config.icon;
					scope.status = 'pull';
					var setStatus = function(status) {
						shouldReload = status === 'release';
						scope.$apply(function() {
							scope.status = status;
						});
					};
					var shouldReload = false;
					iElement.bind('touchmove', function(ev) {
						var top = scrollElement[0].scrollTop;
						if(top < -config.treshold && !shouldReload) {
							setStatus('release');
						} else if(top > -config.treshold && shouldReload) {
							setStatus('pull');
						}
					});
					iElement.bind('touchend', function(ev) {
						if(!shouldReload) {
							return;
						}
						ptrElement.style.webkitTransitionDuration = 0;
						ptrElement.style.margin = '0 auto';
						setStatus('loading');
						var start = +new Date();
						$q.when(scope.$eval(iAttrs.pullToRefresh)).then(function() {
							var elapsed = +new Date() - start;
							$timeout(function() {
								ptrElement.style.margin = '';
								ptrElement.style.webkitTransitionDuration = '';
								scope.status = 'pull';
							}, elapsed < config.debounce ? config.debounce - elapsed : 0);
						});
					});
					scope.$on('$destroy', function() {
						iElement.unbind('touchmove');
						iElement.unbind('touchend');
					});
				};
			}
		};
	}
]);
angular.module('mgcrea.pullToRefresh').run([
	'$templateCache',
	function($templateCache) {
		$templateCache.put('angular-pull-to-refresh.tpl.html', '<div class="pull-to-refresh">\n' + '  <i ng-class="icon[status]"></i>&nbsp;\n' + '  <span ng-bind="text[status]"></span>\n' + '</div>\n' + '<div ng-transclude></div>\n');
	}
]);