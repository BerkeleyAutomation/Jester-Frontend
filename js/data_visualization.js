/**
 * Created by Viraj.
 */

//BASE_URL = 'http://127.0.0.1:8000/data_visualization/';
BASE_URL = 'http://automation.berkeley.edu/jester_backend/data_visualization';

String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

$(document).ready(function () {

});

angular.module('data_visualization', ['ngMaterial'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('amber')
            .accentPalette('blue', {
                'default': '400',
                'hue-1': '100',
                'hue-2': '600',
                'hue-3': '800'
            });
    })
    .controller('ratings_histogram_controller', function ($scope) {
        $scope.filter_null = false;
        $scope.start_date = $('#ratings_hist_start_date');
        $scope.end_date = $('#ratings_hist_end_date');

        $('.input-daterange').datepicker({
            inputs: $('ratings_hist_actual').toArray()
        });
        $scope.start_date.datepicker({
            format: 'mm/dd/yyyy',
            startDate: "04/01/2015"
        }).on('changeDate', function (e) {
            var end_date = $scope.end_date.datepicker('getDate');
            if (e.date > end_date) {
                $scope.end_date.datepicker('update', e.date);
            }
        });
        $scope.end_date.datepicker({
            format: 'mm/dd/yyyy',
            startDate: '04/01/2015'
        }).on('changeDate', function (e) {
            var start_date = $scope.start_date.datepicker('getDate');
            if (e.date < start_date) {
                $scope.start_date.datepicker('update', e.date);
            }
        });
        $scope.start_date.datepicker('update', '04/01/2015');
        $scope.end_date.datepicker('update', (new Date()).toDateString());
        $scope.get_histogram = function () {
            data = {
                start_date: $scope.start_date.val(),
                end_date: $scope.end_date.val(),
                filter_null: $scope.filter_null
            };
            $.getJSON(BASE_URL + 'rating_histogram', data, function (data) {
                // Request succeeded
                $scope.bins = data.stats.bins;
                $scope.bin_width = data.stats.bin_width;
                $scope.num_ratings = data.stats.num_ratings;
                $scope.mean_rating = data.stats.mean_rating;
                $scope.median_rating = data.stats.median_rating;

                $scope.$apply();
                $('#ratings_histogram').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        min: data.xAxis.min,
                        max: data.xAxis.max,
                        tickPositions: data.xAxis.tickPositions,
                    },
                    legend: {
                        enabled: false
                    },
                    yAxis: {
                        min: data.yAxis.min,
                        max: data.yAxis.max,
                        title: {
                            text: 'Number of Ratings'
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            var range = [this.x - data.stats.bin_width / 2, this.x + data.stats.bin_width / 2];
                            return '<b>Range</b>: [{0}) <br /> <b>Ratings</b>: {1}'.format(range, this.y);
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.0,
                            borderWidth: 0.1,
                            groupPadding: 0
                        }
                    },
                    series: [{
                        name: 'Ratings',
                        data: data.heights,
                        color: '#0277bd'
                    }]
                });
            });
        };
        $scope.get_histogram();
    })
    .controller('num_ratings_histogram_controller', function ($scope) {

    });