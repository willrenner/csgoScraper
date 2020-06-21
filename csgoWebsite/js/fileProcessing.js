
function loadFileAsText() {
    var gameObjectArray = [];
    var textFromFileLoaded = "default";
    var file = document.getElementById("input-file").files[0];
    var fileReader = new FileReader();


    fileReader.onloadstart = function (progressEvent) {
        var msg = "File Name: " + file.name + "\\n" +
            "File Size: " + file.size + "\\n" +
            "File Type: " + file.type;
        console.log(msg);
    }

    fileReader.onload = async function (fileLoadedEvent) {
        textFromFileLoaded = fileLoadedEvent.target.result;
        gameObjectArray = await process(textFromFileLoaded);
        let totalKills = 0;
        let totalAssists = 0;
        let totalDeaths = 0;
        let totalHSP = 0;
        let totalPing = 0;
        let gameTimeInMinutes = 0;
        let waitTimeInSeconds = 0;

        //console.log(gameObjectArray);
        for (let i = 0; i < gameObjectArray.length; i++) {
            totalKills += parseInt(gameObjectArray[i].kills);
            totalDeaths += parseInt(gameObjectArray[i].deaths);
            totalAssists += parseInt(gameObjectArray[i].assists);


            let gameTime = gameObjectArray[i].duration.split(": ")[1];
            gameTime = gameTime.split(":");
            if (gameTime.length == 2) {
                gameTimeInMinutes += parseInt(gameTime[0]);
            } else if (gameTime.length == 3) {
                gameTimeInMinutes += parseInt(gameTime[0]) * 60 + parseInt(gameTime[1]);
            }


            let gameWaitTime = gameObjectArray[i].wait.split(": ")[1];
            gameWaitTime = gameWaitTime.split(":");
            if (gameWaitTime.length == 2) {
                waitTimeInSeconds += parseInt(gameWaitTime[0]) * 60 + parseInt(gameWaitTime[1]);
            }


            if (gameObjectArray[i].hsp != "") {
                let hsp = gameObjectArray[i].hsp.split("%").join("");
                totalHSP += parseInt(hsp);
                //console.log(totalHSP);
            }
            if (parseInt(gameObjectArray[i].ping) != 0) {
                totalPing += parseInt(gameObjectArray[i].ping);
            }
        }

        let averageKills = Math.floor(totalKills / gameObjectArray.length);
        let averageAssists = Math.floor(totalAssists / gameObjectArray.length);
        let averageDeaths = Math.floor(totalDeaths / gameObjectArray.length);
        let averagePing = Math.floor(totalPing / gameObjectArray.length);
        let averageHSP = Math.floor(totalHSP / gameObjectArray.length);
        let averageInGameTime = Math.floor(gameTimeInMinutes / gameObjectArray.length); //minutes
        let averageWaitTime = Math.floor(waitTimeInSeconds / gameObjectArray.length);//seconds

        $("#stats-div").append(
            "Total kills: " + totalKills + "<br>" +
            "Average kills: " + averageKills + "<br><br>" +

            "Total deaths: " + totalDeaths + "<br>" +
            "Average deaths: " + averageDeaths + "<br><br>" +

            "Total assists: " + totalAssists + "<br>" +
            "Average assists: " + averageAssists + "<br><br>" +

            "Average HSP: " + averageHSP + "%" + "<br><br>" +

            "Total in game time: " + Math.floor(gameTimeInMinutes / 60) + " hours (" + Math.floor(gameTimeInMinutes / 60 / 24) + " days)" + "<br>" +
            "Average in game time: " + averageInGameTime + " minutes" + "<br><br>" +

            "Total wait time: " + Math.floor(waitTimeInSeconds / 3600) + " hours" + "<br>" +
            "Average wait time: " + averageWaitTime + " seconds" + "<br><br>"
        );





        createWholeChart(gameObjectArray);
    };
    fileReader.onerror = function (progressEvent) {
        console.log("Has Error!");
    }
    fileReader.readAsText(file, "UTF-8");


}

function process(text) {
    let _gameObjectArray = [];
    var htmlString = $($.parseHTML(text));
    var allBodys = htmlString.find(".csgo_scoreboard_inner_left tbody");
    var all1 = allBodys.find("tr:nth-of-type(1)");
    var all2 = allBodys.find("tr:nth-of-type(2)");
    var all3 = allBodys.find("tr:nth-of-type(3)");
    var all4 = allBodys.find("tr:nth-of-type(4)");
    //map, date, waitTime, durationTime---------------------
    var mapArray = SelectorToArray(all1);
    var dateArray = SelectorToArray(all2);
    var waitArray = SelectorToArray(all3);
    var durationArray = SelectorToArray(all4);
    //--------------------------------------------------------
    var _scores = htmlString.find(".csgo_scoreboard_score");
    var scoreboardArray = SelectorToArray(_scores);

    var _nameData = htmlString.find("td.inner_name:contains('TheWillderness')");
    var _pingData = _nameData.find("+ td");
    var pingArray = SelectorToArray(_pingData);
    var _killData = _nameData.find("+ td + td");
    var killArray = SelectorToArray(_killData);
    var _assistData = _nameData.find("+ td + td + td");
    var assistsArray = SelectorToArray(_assistData);
    var _deathData = _nameData.find("+ td + td + td + td");
    var deathArray = SelectorToArray(_deathData);
    var _hspData = _nameData.find("+ td + td + td + td + td + td");
    var hspArray = SelectorToArray(_hspData);





    function createGameObjectArray(
        _mapArray, _dateArray, _waitArray,
        _durationArray, _scoreArray,
        _pingArray, _killsArray,
        _assistsArray, _deathsArray, _hspArray) {
        let gameObjectArray2 = []
        for (let i = 0; i < _mapArray.length; i++) {
            let gameObj = new GameObject(
                _mapArray[i], _dateArray[i], _waitArray[i],
                _durationArray[i], _scoreArray[i],
                _pingArray[i], _killsArray[i],
                _assistsArray[i], _deathsArray[i], _hspArray[i])
            gameObjectArray2.push(gameObj);
        }
        return gameObjectArray2;
    }

    function GameObject(
        map, date, wait,
        duration, score,
        ping, kills,
        assists, deaths, hsp) {
        this.map = map;
        this.date = date;
        this.wait = wait;
        this.duration = duration;
        this.score = score;
        this.ping = ping;
        this.kills = kills;
        this.assists = assists;
        this.deaths = deaths;
        this.hsp = hsp;
    }
    function SelectorToArray(inputSelector) {
        var outputArray = [];
        for (let i = 0; i < inputSelector.length; i++) {
            outputArray.push(inputSelector.get(i).innerText.trim());
        }
        return outputArray;
    }
    _gameObjectArray =
        createGameObjectArray(
            mapArray, dateArray, waitArray,
            durationArray, scoreboardArray,
            pingArray, killArray,
            assistsArray, deathArray, hspArray);
    return _gameObjectArray;
}





