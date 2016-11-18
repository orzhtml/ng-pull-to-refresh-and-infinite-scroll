/* ng-infinite-scroll - v1.0.1 - 2016-11-16 */

angular.module('infinite-scroll', [])
.directive('infiniteScroll', [
	'$rootScope', '$timeout',
	function($rootScope, $timeout) {
		return {
			link: function(scope, iElement, iAttrs) {
				var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
				scrollDistance = 0;
				if(iAttrs.infiniteScrollDistance != null) {
					scope.$watch(iAttrs.infiniteScrollDistance, function(value) {
						return scrollDistance = parseInt(value, 10);
					});
				}
				scrollEnabled = true;
				checkWhenEnabled = false;
				if(iAttrs.infiniteScrollDisabled != null) {
					scope.$watch(iAttrs.infiniteScrollDisabled, function(value) {
						scrollEnabled = !value;
						if(scrollEnabled && checkWhenEnabled) {
							checkWhenEnabled = false;
							return handler();
						}
					});
				}

				handler = function() {
					var shouldScroll;
					var raw = iElement[0];
					shouldScroll = raw.scrollTop + raw.offsetHeight >= raw.scrollHeight;
					if(shouldScroll && scrollEnabled) {
						if($rootScope.$$phase) {
							return scope.$eval(iAttrs.infiniteScroll);
						} else {
							return scope.$apply(iAttrs.infiniteScroll);
						}
					} else if(shouldScroll) {
						return checkWhenEnabled = true;
					}
				};
				iElement.bind('scroll', handler);
				scope.$on('$destroy', function() {
					return iElement.unbind('scroll', handler);
				});
				return $timeout((function() {
					if(iAttrs.infiniteScrollImmediateCheck) {
						if(scope.$eval(iAttrs.infiniteScrollImmediateCheck)) {
							return handler();
						}
					} else {
						return handler();
					}
				}), 0);
			}
		};
	}
]);