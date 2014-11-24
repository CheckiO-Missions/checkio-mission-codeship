//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var ends = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]

            options = options || {};
            var is_new_record = options.is_new_record || false;
            var place_rating = String(options.place_rating || 0);
            var best_points = options.best_points || 0;
            var current_points = options.current_points || 0;
            var $div = $("<div></div>");
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div class="result"></div></div>'));
            var $resultDiv = $h.find(".result");
            var $table = $("<table></table>").addClass("numbers");
            if (is_new_record) {
                $resultDiv.addClass("win-sign");
                $resultDiv.append($("<div></div>").text("You beat your best results!"));
                var $tr = $("<tr></tr>");
                $tr.append($("<th></th>").text(best_points));
                $tr.append($("<th></th>").text(place_rating).append($("<span></span>").addClass(".ends").text(ends[Number(place_rating[place_rating.length - 1])])));

                $table.append($tr);
                $tr = $("<tr></tr>");
                $tr.append($("<td></td>").text("Personal best"));
                $tr.append($("<td></td>").text("Place"));
                $table.append($tr);
            }
            else {
                $resultDiv.addClass("norm-sign");
                $resultDiv.append($("<div></div>").text("Your results"));
                $tr = $("<tr></tr>");
                $tr.append($("<th></th>").text(current_points));
                $tr.append($("<th></th>").text(best_points));
                $tr.append($("<th></th>").text(place_rating).append($("<span></span>").addClass(".ends").text(ends[Number(place_rating[place_rating.length - 1])])));

                $table.append($tr);
                $tr = $("<tr></tr>");
                $tr.append($("<td></td>").text("Points"));
                $tr.append($("<td></td>").text("Personal best"));
                $tr.append($("<td></td>").text("Place"));
                $table.append($tr);
            }
            $resultDiv.append($table);
            this_e.setAnimationHeight(255);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'move_ship';

            var checkioInput = data.in || [
                [
                    "S....",
                    ".XXX.",
                    "..TX.",
                    ".XXX.",
                    "....."
                ],
                100
            ];
            var checkioInputStr = fname + '(' + JSON.stringify(checkioInput[0]).replace("(", "[").replace(")", "]") +
                ", " + checkioInput[1] + ')';

            var failError = function (dError) {
                $content.find('.call').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call').html(checkioInputStr);
            $content.find('.output').html('Working...');


            if (data.ext) {
                var userResult = data.out;
                var result = data.ext["result"];
                var result_text = data.ext["result_addon"];
                var fuel = data.ext["fuel"];
                var tornadoes = data.ext["old_tornadoes"];
                var tornadoMoves = data.ext["tornado_moves"];
                var seaMap = data.ext["map"];
                var ship = data.ext["ship"];

                var svg = new SVG($content.find(".explanation")[0]);
                svg.draw(seaMap, ship, tornadoes);
                svg.move(userResult, tornadoMoves);

                //if you need additional info from tests (if exists)
                var explanation = data.ext["explanation"];
                $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult) +
                    "<br>Remaining fuel: " + fuel);
                if (!result) {
                    $content.find('.answer').html(result_text);
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }


            //Your code here about test explanation animation
            //$content.find(".explanation").html("Something text for example");
            //
            //
            //
            //
            //


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });


        function drawShip(rsr, x, y) {

            var Layer_1 = rsr.set();
            var path_a = rsr.path("M19.858,2.714 C29.31,2.714 37,10.409 37,19.866 C36.966,28.854 29.629,36.769 20.533,37 L19.183,37 C9.859,36.75 2.944,28.949 2.714,19.866 C2.714,10.409 10.405,2.714 19.858,2.714 z M19.858,4.454 C11.363,4.454 4.453,11.368 4.453,19.866 C4.453,28.364 11.363,35.278 19.858,35.278 C28.351,35.278 35.261,28.364 35.261,19.866 C35.261,11.368 28.351,4.454 19.858,4.454 z").attr({fill: '#294270', parent: 'Layer_1', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'path_a');
            var path_b = rsr.path("M17.18,10.26 L17.18,7.484 C17.18,7.084 18.754,6.638 19.821,6.638 C20.888,6.638 22.518,7.084 22.518,7.484 L22.518,10.255 C21.618,10.084 20.655,9.966 19.847,9.966 C19.029,9.966 18.07,10.087 17.18,10.26").attr({fill: '#006CA9', parent: 'Layer_1', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'path_b');
            var path_c = rsr.path("M16.05,27.176 C13.695,27.176 11.774,26.446 11.059,26.372 C9.997,26.262 8.87,25.221 7.847,25.221 C7.677,25.221 7.51,25.25 7.347,25.316 C7.119,24.781 6.923,24.23 6.763,23.663 C8.434,22.138 10.021,21.637 11.384,21.637 C13.976,21.637 15.757,23.449 15.765,23.474 C15.904,23.604 18.459,25.492 19.831,25.798 L20.877,25.931 C19.224,26.88 17.549,27.176 16.05,27.176").attr({fill: '#006CA9', parent: 'Layer_1', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'path_c');
            var path_d = rsr.path("M7.372,25.379 L7.374,25.378 L7.351,25.327 L7.372,25.379").attr({fill: '#A54389', parent: 'Layer_1', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'path_d');
            var path_e = rsr.path("M25.549,15.457 C25.549,15.093 25.549,12.561 25.549,12.561 C25.549,12.161 22.102,11.241 19.847,11.241 C17.591,11.241 14.265,12.161 14.265,12.561 C14.265,12.561 14.265,15.317 14.265,15.421 C16.905,13.532 19.8,12.691 19.8,12.691 C19.809,12.688 22.887,13.538 25.549,15.457").attr({fill: '#294270', parent: 'Layer_1', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'path_e');
            var path_f = rsr.path("M26.939,21.163 C26.085,21.326 25.084,22.553 23.79,23.794 C24.3,21.965 25.228,19.915 26.908,18.147 C26.456,17.737 25.994,17.363 25.536,17.024 L25.536,17.016 C23.848,15.77 21.895,14.7 19.87,14.112 L19.868,14.113 C19.031,14.331 18.206,14.723 17.429,15.093 C15.756,15.889 14.183,16.898 12.809,18.145 L12.806,18.147 C14.303,19.666 15.194,21.574 15.728,23.357 C15.739,23.396 15.753,23.435 15.765,23.474 C15.904,23.604 16.048,23.732 16.192,23.855 C17.244,24.75 18.433,25.488 19.805,25.794 L19.8,25.752 L19.261,21.393 L19.124,18.459 L19.861,15.1 L20.537,18.459 L20.376,21.401 L19.894,25.773 L19.89,25.812 L20.877,25.931 C19.278,26.667 16.781,27.067 14.193,25.828 C13.148,25.327 12.136,24.851 10.967,24.73 C9.727,24.602 8.494,24.849 7.347,25.316 L7.346,25.316 L7.351,25.327 L7.374,25.378 C9.589,30.419 14.77,33.708 20.276,33.54 C25.675,33.375 30.584,29.895 32.55,24.864 C32.657,24.59 32.755,24.314 32.844,24.034 C30.986,22.666 28.067,20.946 26.939,21.163").attr({fill: '#294270', parent: 'Layer_1', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'path_f');
            var path_g = rsr.path("M26.939,21.163 C28.067,20.946 26.085,21.326 26.939,21.163").attr({fill: '#323D46', parent: 'Layer_1', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'path_g');
            Layer_1.attr({'id': 'Layer_1', 'name': 'Layer_1'});


            var rsrGroups = [Layer_1];
            Layer_1.push(
                path_a,
                path_b,
                path_c,
                path_d,
                path_e,
                path_f,
                path_g
            );
            Layer_1.transform("T" + x + "," + y);
            return Layer_1;

        }

        function drawTornado(rsr, x, y) {
            var Layer_1 = rsr.set();
            Layer_1.attr({'id': 'Layer_1', 'name': 'Layer_1'});
            var group_a = rsr.set();
            var path_b = rsr.path("M8.51,8.502 C14.41,1.502 26.41,1.502 32.51,8.303 C37.21,14.202 36.01,23.002 31.41,28.603 C27.11,32.103 21.01,33.903 16.01,30.903 C10.91,28.403 8.811,21.603 11.811,16.803 C14.111,12.603 20.411,11.702 23.71,15.103 C26.21,17.303 26.01,21.502 23.61,23.603 C21.91,24.203 20.11,24.303 18.31,24.502 C20.709,23.402 24.81,22.502 23.81,18.902 C22.81,14.402 16.009,14.502 14.709,18.802 C12.909,23.201 17.409,27.802 21.909,26.902 C27.609,26.002 29.909,17.902 26.009,13.802 C22.31,9.201 14.61,9.402 11.009,13.902 C6.509,18.802 7.11,27.302 12.31,31.402 C18.209,36.602 27.91,35.802 33.009,29.902 C33.409,29.502 34.209,28.902 34.61,28.502 C30.009,37.502 16.61,39.103 9.509,32.303 C2.611,26.502 2.111,14.803 8.51,8.502 L8.51,8.502 z").attr({fill: '#F0801A', parent: 'Layer_1', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'path_b');
            var path_c = rsr.path("M8.51,8.502 C14.41,1.502 26.41,1.502 32.51,8.303 C37.21,14.202 36.01,23.002 31.41,28.603 C27.11,32.103 21.01,33.903 16.01,30.903 C10.91,28.403 8.811,21.603 11.811,16.803 C14.111,12.603 20.411,11.702 23.71,15.103 C26.21,17.303 26.01,21.502 23.61,23.603 C21.91,24.203 20.11,24.303 18.31,24.502 C20.709,23.402 24.81,22.502 23.81,18.902 C22.81,14.402 16.009,14.502 14.709,18.802 C12.909,23.201 17.409,27.802 21.909,26.902 C27.609,26.002 29.909,17.902 26.009,13.802 C22.31,9.201 14.61,9.402 11.009,13.902 C6.509,18.802 7.11,27.302 12.31,31.402 C18.209,36.602 27.91,35.802 33.009,29.902 C33.409,29.502 34.209,28.902 34.61,28.502 C30.009,37.502 16.61,39.103 9.509,32.303 C2.611,26.502 2.111,14.803 8.51,8.502 L8.51,8.502 z").attr({"fill-opacity": '0', stroke: '#294270', "stroke-width": '1', parent: 'Layer_1', 'stroke-opacity': '1', 'fill': '#000000'}).data('id', 'path_c');
            group_a.attr({'parent': 'Layer_1', 'name': 'group_a'});


            var rsrGroups = [Layer_1, group_a];
            Layer_1.push(
            );
            group_a.push(
                path_b,
                path_c
            );

            group_a.transform("T" + x + "," + y);
            return group_a;
        }


        function SVG(dom) {
            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var pad = 10;

            var cellSize = 40;

            var sizeX, sizeY;

            var paper;

            var shipObj;
            var tornadoesObj = [];

            var aCell = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue1};
            var aRock = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue4};

            this.draw = function (seaMap, ship, tornadoes) {
                sizeX = seaMap[0].length * cellSize + 2 * pad;
                sizeY = seaMap.length * cellSize + 2 * pad;
                paper = Raphael(dom, sizeX, sizeY);

                for (var r = 0; r < seaMap.length; r++) {
                    for (var c = 0; c < seaMap[0].length; c++) {
                        var el = paper.rect(pad + c * cellSize, pad + r * cellSize, cellSize, cellSize).attr(
                                seaMap[r][c] == "X" ? aRock : aCell);
                        if (r == seaMap.length - 1 && c == seaMap[0].length - 1){
                            el.attr("fill", colorGrey2);
                        }
                    }
                }

                shipObj = drawShip(paper, pad + ship[1] * cellSize, pad + ship[0] * cellSize);
                for (var t = 0; t < tornadoes.length; t++) {
                    tornadoesObj.push(drawTornado(paper, pad + tornadoes[t][1] * cellSize, pad + tornadoes[t][0] * cellSize))
                }



            };

            var DIRS = {
                "N": [-1, 0],
                "S": [1, 0],
                "W": [0, -1],
                "E": [0, 1],
                ".": [0, 0]};


            this.move = function (shipMove, tornadoMoves) {
                var shipDir = DIRS[shipMove];
                var moveTime = 300;
                if (shipDir) {
                    setTimeout(function () {
                        shipObj.animate({"transform": "...T" + (shipDir[1] * cellSize) + "," + (shipDir[0] * cellSize)},
                            moveTime);
                    }, 200);


                }
                for (var t = 0; t < tornadoMoves.length; t++) {
                    var tMove = tornadoMoves[t];
                    var tObj = tornadoesObj[t];
                    if (tMove && tObj) {
                        var tDir = DIRS[tMove];
                        setTimeout(function (o, d) {
                            return function () {
                                o.animate({"transform": "...T" + (d[1] * cellSize) + "," + (d[0] * cellSize)},
                                    moveTime)
                            }
                        }(tObj, tDir), 200);
                    }
                }

            }

            ;

        }


        //Your Additional functions or objects inside scope
        //
        //
        //


    }
)
;
