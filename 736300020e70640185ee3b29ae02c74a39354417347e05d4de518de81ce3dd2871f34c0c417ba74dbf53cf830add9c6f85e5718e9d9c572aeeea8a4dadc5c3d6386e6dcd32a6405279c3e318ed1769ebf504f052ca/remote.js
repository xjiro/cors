jQuery(function () {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const remap = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '1', '2*', '3', '4', '5', '6', '7', '8', '9', '2', '2', '3', '4*', '5', '6', '7', '8']

    function last_int(s) {
        s = s.toString().split('=');
        return parseInt(s[s.length - 1]);
    }

    function today() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        return yyyy + '-' + mm + '-' + dd;
    }

    function getFrequency(s) {
        s = s.split('=')[0]
        s = s.split('+').filter((e) => { return e != "" && e != null; });
        s = s.map((e) => { return parseInt(e).toString(); });

        var freq = {};
        for (var i = 0; i < s.length; i++) {
            var character = s[i];
            if (freq[character]) {
                freq[character]++;
            } else {
                freq[character] = 1;
            }
        }
        var arr = [];
        for (var key in freq) {
            if (freq.hasOwnProperty(key)) {
                arr.push([key, freq[key]]);
            }
        }
        arr.sort((a, b) => { return b[1] - a[1]; });
        arr = arr.filter((e) => { return e[1] > 1 });

        return arr;
    }

    function i_reduce(n) {
        do {
            var sum = 0;
            n = n.toString();
            for (var i = 0; i < n.length; i++) {
                sum += parseInt(n[i]);
            }
            n = sum;
        } while (n > 9);

        return n;
    }

    function s_reduce(s) {
        var output = [];
        for (var i = 0, len = s.length; i < len; i++) {
            var l = s[i];
            var idx = letters.indexOf(l);
            if (-1 != idx) {
                output.push((remap[idx]).toString());
            }
        }

        return output.join(' + ') + ' = ' + (output.reduce((a, b) => { return parseInt(a) + parseInt(b); }, 0)).toString();
    }

    function is_done_reducing(s) {
        s = s.toString();
        if (s.indexOf('=') != -1)
            return parseInt(s.split('=')[s.split('=').length - 1]) < 10;
        return parseInt(s) < 10;
    }

    function n_reduce(s) {
        var num = s.split('=')[s.split('=').length - 1].trim();

        var output = [];
        for (var i = 0; i < num.length; i++) {
            output.push(num[i])
        }

        return output.join(' + ') + ' = ' + (output.reduce((a, b) => { return parseInt(a) + parseInt(b); }, 0)).toString();
    }

    function report(name, daily_value, race_number, total_number) {
        var orig_name = name;
        name = name.toLowerCase().trim();

        // name vibration
        var name_vibration = s_reduce(name);
        while (!is_done_reducing(name_vibration)) {
            name_vibration += ' = ' + n_reduce(name_vibration);
        }

        var name_vowels = '';
        for (var i = 0; i < name.length; i++) {
            if (-1 != vowels.indexOf(name[i])) {
                name_vowels += name[i];
            }
        }

        // vowel vibration
        var vowel_vibration = s_reduce(name_vowels);
        while (!is_done_reducing(vowel_vibration)) {
            vowel_vibration += ' = ' + n_reduce(vowel_vibration);
        }

        // initial vibration
        var initial_vibration = name.split(' ');
        if (initial_vibration.length > 1) {
            var initials = '';
            for (var i = 0; i < initial_vibration.length; i++) {
                initials += initial_vibration[i][0];
            }
            initial_vibration = initials;
        } else {
            initial_vibration = name[0] + name[name.length - 1];
        }

        initial_vibration = s_reduce(initial_vibration);
        while (!is_done_reducing(initial_vibration)) {
            initial_vibration += ' = ' + n_reduce(initial_vibration);
        }

        // word breakdown
        var word_breakdown = name.split(' ');
        if (word_breakdown.length > 1) {
            var words = [];
            for (var i = 0; i < word_breakdown.length; i++) {
                var out = ''
                out = word_breakdown[i].toUpperCase() + ': ' + s_reduce(word_breakdown[i]);
                while (!is_done_reducing(out)) {
                    out += ' = ' + n_reduce(out);
                }
                words.push(out);
            }
            word_breakdown = words.join('<br>');
        } else {
            word_breakdown = null;
        }

        // figure frequency
        var figure_frequency = getFrequency(s_reduce(name));
        var num_max = 0;
        var max = 0;
        for (var i = 0; i < figure_frequency.length; i++) {
            if (figure_frequency[i][1] >= max) {
                num_max++;
                max = figure_frequency[i][1];
            }
        }

        figure_frequency = figure_frequency.map((e) => { return e[0].toString() + ' <sup>x' + e[1].toString() + '</sup>' });
        figure_frequency = figure_frequency.join('  ');
        if (figure_frequency.trim() != '') {
            if (num_max == 1) {
                figure_frequency += ' = ' + figure_frequency.split('<')[0];
            }
            else {
                figure_frequency += ' = 0';
            }
        } else {
            figure_frequency = '0';
        }

        var weighted_values = [];
        var weighted_total = 0;

        if (last_int(name_vibration) == parseInt(daily_value)) {
            weighted_total += 10;
            weighted_values.push("Name Vibration same as Day's Number = 10");
        }

        if (last_int(name_vibration) == parseInt(race_number)) {
            weighted_total += 8;
            weighted_values.push("Name Vibration same as Race's Number = 8");
        }

        if (last_int(name_vibration) == parseInt(total_number)) {
            weighted_total += 6;
            weighted_values.push("Name Vibration same as Total Number = 6");
        }

        if (last_int(vowel_vibration) == parseInt(daily_value)) {
            weighted_total += 7;
            weighted_values.push("Vowel Vibration same as Day's Number = 7");
        }

        if (last_int(vowel_vibration) == parseInt(race_number)) {
            weighted_total += 5;
            weighted_values.push("Vowel Vibration same as Race's Number = 5");
        }

        if (last_int(vowel_vibration) == parseInt(total_number)) {
            weighted_total += 3;
            weighted_values.push("Vowel Vibration same as Total Number = 3");
        }

        if (last_int(initial_vibration) == parseInt(daily_value)) {
            weighted_total += 4;
            weighted_values.push("Initial Vibration same as Day's Number = 4");
        }

        if (last_int(initial_vibration) == parseInt(race_number)) {
            weighted_total += 3;
            weighted_values.push("Initial Vibration same as Race's Number = 3");
        }

        if (last_int(initial_vibration) == parseInt(total_number)) {
            weighted_total += 2;
            weighted_values.push("Initial Vibration same as Total Number = 2");
        }

        if (last_int(figure_frequency) == parseInt(daily_value)) {
            weighted_total += 2;
            weighted_values.push("Figure Frequency same as Day's Number = 2");
        }

        if (last_int(figure_frequency) == parseInt(race_number)) {
            weighted_total += 1;
            weighted_values.push("Figure Frequency same as Race's Number = 1");
        }

        if (last_int(figure_frequency) == parseInt(total_number)) {
            weighted_total += 1;
            weighted_values.push("Figure Frequency same as Total Number = 1");
        }

        var score = weighted_total;

        return {
            name: orig_name,
            name_vibration: name_vibration,
            word_breakdown: word_breakdown,
            vowel_vibration: vowel_vibration,
            initial_vibration: initial_vibration,
            figure_frequency: figure_frequency,
            weighted_values: weighted_values,
            weighted_total: weighted_total,
            manual_adjust: 0,
            score: score
        };
    }

    // config
    const prefix = '//xjiro.github.io/736300020e70640185ee3b29ae02c74a39354417347e05d4de518de81ce3dd2871f34c0c417ba74dbf53cf830add9c6f85e5718e9d9c572aeeea8a4dadc5c3d6386e6dcd32a6405279c3e318ed1769ebf504f052ca/';

    // load dependencies
    $.getScript(prefix + 'jspdf.umd.min.js', function () {
        // $.getScript(prefix + 'jspdf.min.js', function () {
        $.getScript(prefix + 'inject.handlebars.min.js', function () {
            // load form template
            $.ajax(prefix + 'inject.form.html', {
                accepts: { html: 'text/html' },
                dataType: 'html'
            }).done(function (data) {
                // receive templates
                var data = $($.parseHTML(data));
                var container = data.filter('#container');
                var container_template = Handlebars.compile(container.html());
                var output_template = Handlebars.compile(data.filter('#output-template').html());
                var pdf_template = Handlebars.compile(data.filter('#pdf-template').html());

                // inject over LOADING element
                var load_target = $("font:contains('LOADING')").parent().parent();
                load_target.html(container_template({ today: today() }));

                $('body').on('click', '#hn-calculate', function () {
                    var names = $('#hn-input').val().trim().split('\n');
                    names = names.filter((e) => { return e != "" && e != null; });

                    var race_number = i_reduce($('#race-number').val());
                    var date = $('#race-date').val().split('-');
                    var daily_value = i_reduce(i_reduce(date[1]) + i_reduce(date[2]));
                    var total_number = i_reduce(parseInt(race_number) + parseInt(daily_value));
                    var final_number = i_reduce(parseInt(names.length) + parseInt(total_number));

                    reports = names.map((e) => { return report(e, daily_value, race_number, total_number); });

                    $.reports = reports;
                    $.race_number = race_number;
                    $.daily_value = daily_value;
                    $.total_number = total_number;
                    $.final_number = final_number;

                    $('#container-output').html(output_template({
                        horse: reports,
                        race_number: race_number,
                        daily_value: daily_value,
                        total_number: total_number,
                        final_number: final_number,
                    }));

                    $('#container-output').css('display', 'block');
                    $('#container-input').css('display', 'none');
                });

                $('body').on('change', '.manual-adjust', function (e) {
                    var id = $(this).attr('id').split('_')[1];
                    $('#score_' + id).html(parseInt($('#score_' + id).attr('data-prescore')) + parseInt($(this).val()));
                });


                $('body').on('click', '#hn-return', function () {
                    $('#container-output').css('display', 'none');
                    $('#container-input').css('display', 'block');
                });

                $('body').on('click', '#hn-pdf', function () {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();

                    doc.setFontSize(24);
                    doc.text("Beat the Races by Numerology\n\n", 10, 20);

                    doc.setFontSize(8);
                    doc.setLineHeightFactor(1.4);

                    $.pdftext = [];

                    doc.text(`Race Number: ${$.race_number}    Daily Value: ${$.daily_value}     Total Number: ${$.total_number}     Final Number: ${$.final_number}`, 10, 30);

                    $('.manual-adjust').each(function () {
                        var idx = parseInt($(this).attr('id').split('_')[1]);
                        reports[idx].manual_adjust = parseInt($(this).val());
                        reports[idx].score += reports[idx].manual_adjust;
                    });

                    for (var i = 0; i < reports.length; i++) {
                        reports[i].figure_frequency = reports[i].figure_frequency.replaceAll().replaceAll('<sup>', '').replaceAll('</sup>', '').replace('&#x3D;', '');
                        if (reports[i].word_breakdown) {
                            reports[i].word_breakdown = reports[i].word_breakdown.replaceAll('<br>', "\n");
                        }
                    }

                    const max_lines = 80;
                    var current_lines = 0;
                    var pageno = 0;

                    for (var i = 0; i < reports.length; i++) {
                        var r = pdf_template(reports[i], { noEscape: true });

                        var r_lines = r.split("\n").length;

                        if (current_lines + r_lines > (pageno == 0 ? max_lines - 8 : max_lines)) {
                            doc.addPage();
                            pageno++;
                            current_lines = 0;
                        }

                        doc.text(r, 10, current_lines * 4 + (i == 0 ? 40 : 10));

                        current_lines += r_lines + (i == 0 ? 8 : 0);
                    }

                    doc.save("report.pdf");
                });

            });
        });
    });

    $("head").append("<link>");
    var css = $("head").children(":last");
    css.attr({
        rel: "stylesheet",
        type: "text/css",
        href: prefix + "inject.bootstrap.min.css"
    });

    $("head").append("<link>");
    var css = $("head").children(":last");
    css.attr({
        rel: "stylesheet",
        type: "text/css",
        href: prefix + "inject.style.css"
    });

});
