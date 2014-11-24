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
                var tornadoes = data.ext["tornadoes"];
                var tornadoMoves = data.ext["tornado_moves"];
                var seaMap = data.ext["map"];
                var ship = data.ext["ship"];

                var svg = new SVG($content.find(".explanation")[0]);
                svg.draw(seaMap, ship, tornadoes);

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


        function drawShip(p, x, y) {
            var s = p.set();
            s.push(p.path("M19.858,2.714C29.31,2.71437,10.40937,19.866C36.966,28.85429.629,36.76920.533,37L19.183,37C9.859,36.752.944,28.9492.714,19.866C2.714,10.40910.405,2.71419.858,2.714zM19.858,4.454C11.363,4.4544.453,11.3684.453,19.866C4.453,28.36411.363,35.27819.858,35.278C28.351,35.27835.261,28.36435.261,19.866C35.261,11.36828.351,4.45419.858,4.454z").attr("fill", "#294270"));
            s.push(p.path("M17.18,10.26L17.18,7.484C17.18,7.08418.754,6.63819.821,6.638C20.888,6.63822.518,7.08422.518,7.484L22.518,10.255C21.618,10.08420.655,9.96619.847,9.966C19.029,9.96618.07,10.08717.18,10.26").attr("fill", "#006CA9"));
            s.transform("t" + x + "," + y);
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

            var aCell = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue1};
            var aRock = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue4};

            this.draw = function (seaMap, ship, tornadoes) {
                sizeX = seaMap[0].length * cellSize + 2 * pad;
                sizeY = seaMap.length * cellSize + 2 * pad;
                paper = Raphael(dom, sizeX, sizeY);

                for (var r = 0; r < seaMap.length; r++) {
                    for (var c = 0; c < seaMap[0].length; c++) {
                        paper.rect(pad + c * cellSize, pad + r * cellSize, cellSize, cellSize).attr(
                                seaMap[r][c] == "X" ? aRock : aCell);
                    }
                }

            }

        }

        //Your Additional functions or objects inside scope
        //
        //
        //


    }
);
