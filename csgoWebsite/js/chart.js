function createWholeChart(gameObjectsArrayInput) {

    var gameObjectArray = gameObjectsArrayInput;

    var ctxMap = document.getElementById('mapChart').getContext('2d');
    var ctxDate = document.getElementById('dateChart').getContext('2d');

    var mapDataArray = getMapDataArray();
    var dateDataArray = getDateDataArray();
    var dateLabelsArray = dateDataArray[0];
    var countsArray = dateDataArray[1];
    //map pie chart//
    Chart.defaults.global.defaultFontColor = "#fff";
    var myMapChart = new Chart(ctxMap, {
        type: 'pie',
        data: {
            labels: ['Cache', 'Dust', 'Mirage', 'Inferno', 'Overpass', 'Train', 'Cobblestone', 'Nuke', 'Other'], //Cache, Dust, Mirage, Inferno, Overpass, Train, Cobblestone, Nuke
            datasets: [{
                label: 'Map',
                data: mapDataArray,
                backgroundColor: [
                    '#3a1d18',
                    '#c42034',
                    '#dedbe6',
                    '#283043',
                    '#141213',
                    '#b3e1ee',
                    '#cf8051',
                    '#84a02b',
                    '#395112'
                ],
                borderColor: [
                    '#3a1d18',
                    '#c42034',
                    '#dedbe6',
                    '#283043',
                    '#141213',
                    '#b3e1ee',
                    '#383d1f',
                    '#84a02b',
                    '#395112'

                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false
        }
    });
    /////////////date chart////////////////////////////////
    var myDateChart = new Chart(ctxDate, {
        type: 'line',
        data: {
            labels: dateLabelsArray,
            datasets: [{
                label: 'Games Played:',
                data: countsArray,
                borderColor: "#ff0000",
                fill: true,
                backgroundcolor: "rgba(255,0,0,0.7)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scaleFontColor: "#FFFFFF"
        }
    });

    function getMapDataArray() {
        let dataArray = [0, 0, 0, 0, 0, 0, 0, 0, 0] //9 long (extra for other)
        for (let i = 0; i < gameObjectArray.length; i++) {     //Cache, Dust, Mirage, Inferno, Overpass, Train, Cobblestone, Nuke
            let _map = gameObjectArray[i].map;


            if (_map.includes("Cache")) {
                dataArray[0] = dataArray[0] + 1;
            } else if (_map.includes("Dust")) {
                dataArray[1] = dataArray[1] + 1;
            } else if (_map.includes("Mirage")) {
                dataArray[2] = dataArray[2] + 1;
            } else if (_map.includes("Inferno")) {
                dataArray[3] = dataArray[3] + 1;
            } else if (_map.includes("Overpass")) {
                dataArray[4] = dataArray[4] + 1;
            } else if (_map.includes("Train")) {
                dataArray[5] = dataArray[5] + 1;
            } else if (_map.includes("Cobblestone")) {
                dataArray[6] = dataArray[6] + 1;
            } else if (_map.includes("Nuke")) {
                dataArray[7] = dataArray[7] + 1;
            } else {
                dataArray[8] = dataArray[8] + 1;
            }
        }
        return dataArray;
    }
    function getDateDataArray() {
        // let dataArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        const _monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        let _yearArray = new Set();
        let _formattedArray = [];
        let _countArray = [];

        for (let i = 0; i < gameObjectArray.length; i++) {

            let dt = new Date(gameObjectArray[i].date)
            let _year = dt.getFullYear().toString();
            _yearArray.add(_year);


            // dataArray[_month]++;
        }
        _yearArray = Array.from(_yearArray);
        _yearArray.reverse();
        for (let i = 0; i < _yearArray.length; i++) {
            for (let j = 0; j < _monthArray.length; j++) {
                _formattedArray.push(new formattedDate(_monthArray[j] + "-" + _yearArray[i]));
            }
        }


        for (let i = 0; i < gameObjectArray.length; i++) {
            let dt = new Date(gameObjectArray[i].date)
            let _year = dt.getFullYear().toString();
            let _month = _monthArray[dt.getMonth()];
            for (let j = 0; j < _formattedArray.length; j++) {
                if (_formattedArray[j].monthYear.includes(_year) && _formattedArray[j].monthYear.includes(_month)) {
                    _formattedArray[j].count++;
                }
            }
        }
        for (let i = 0; i < _formattedArray.length; i++) {
            _countArray[i] = _formattedArray[i].count;
        }


        function formattedDate(monthYear) {
            this.monthYear = monthYear;
            this.count = 0;
        }
        var finalFormatArray = [];
        for (let i = 0; i < _formattedArray.length; i++) {
            finalFormatArray[i] = _formattedArray[i].monthYear;
        }

        return [finalFormatArray, _countArray];
    }
}
