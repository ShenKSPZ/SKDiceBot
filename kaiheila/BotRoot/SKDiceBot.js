const Bot = require('kaiheila-bot-root').KaiheilaBot
var fs = require('fs');
const types_1 = require("kaiheila-bot-root/dist/types")
const NumPatt = /^[0-9]*$/;
var cmsg;
var bot;

let BotConfig = {
    mode: "",
    port: 0,
    key: "",
    token: "",
    verifyToken: "",
    BotName: "",
}

fs.readFile("./config.json", (error, data) => {
    if (error) {
        console.log("未能成功读取到配置文件:\n");
        console.log(error);
    }
    else {
        BotConfig = JSON.parse(data.toString());
        bot = new Bot({
            mode: BotConfig.mode,
            port: BotConfig.port,
            key: BotConfig.key,
            token: BotConfig.token,
            verifyToken: BotConfig.verifyToken
        });
        bot.listen();
        bot.on('textmessage', (e) => {
            //console.log(e.content);
            cmsg = new types_1.TextMessage(e);
            Process(cmsg.content);
        });
        global.botInstance = bot
        console.log('DiceBot Start!');
    }
});

function Process(i) {
    var input = new String(i).toLowerCase();
    if (new String(input).search(`@${BotConfig.BotName} `) != -1){
        var temp = new String(input).replace(`@${BotConfig.BotName} `, "");
		if(temp != ""){
			input = temp;
		}
		else{
			Send('请输入"-help"或"-帮助"来查看骰子娘的使用方法。');
		}
    }
    else if (new String(input).search(`@${BotConfig.BotName}`) != -1){
        var temp = new String(input).replace(`@${BotConfig.BotName}`, "");
        if(temp != ""){
                input = temp;
        }
        else{
                Send('请输入"-help"或"-帮助"来查看骰子娘的使用方法。');
        }
    }
    if (input[0] == '-') {
        var Comm = new String(input).substring(1, input.length);
        console.log(`Receive Commend: ${Comm} From ${cmsg.channelName}(${cmsg.channelId}) Sent by: ${cmsg.author.username}(${cmsg.author.id})`);
        if (Comm == 'help' || Comm == '帮助') {
            //帮助
            Help();
        }
        else if (Comm == 'about' || Comm == '关于') {
            //关于
            About();
        }
        else if (Comm[0] == 'r' && Comm[1] == 'h'){
            //暗骰
            SecretDice();
        }
        else if (Comm[0] == 'r'){
            //正常投点
            Roll(new String(Comm).substring(1, Comm.length));
        }
        else if (Comm == 'coc7人物卡' || Comm == '获取coc7人物卡') {
            Send("COC7版人物卡下载地址：https://www.jianguoyun.com/p/DeMhdv4Ql5e1BxiahboB");
            }
            else if (Comm == 'coc7') {
            COC7();
            }
            else if (Comm == 'coc') {
            Send('目前只支持随机生成COC 7版的人物卡，请输入 -COC7 来生成，想要帮忙开发这个功能请添加“深空#4088”为好友来一起让素包子变得更好');
            }
            else if (Comm == 'dnd') {
            Send('目前只支持随机生成COC 7版的人物卡，素包子暂时还没有玩过DND，想要帮忙开发这个功能请添加“深空#4088”为好友来一起让素包子变得更好');
            }
        else if (Comm[0] == "s" && Comm[1] == "c"){
            SanCheck(new String(Comm).substring(2, Comm.length));
        }
    }
}

function SanCheck(i){
	//sc[sl0]/[sl1]
	var sl = new String(i).split("/");
	if(sl.length == 2 && sl[0] != ""){ //sc[sl0]/[sl1]
		var sp = sl[1].split(" ");
		if(sp.length == 2 && sp[0] != ""){ //sc[sl0]/[sp0][/s][sp1]
			if(NumPatt.test(sp[1])){
				var skill = parseInt(sp[1]);
				var ran = Math.floor(Math.random() * 100 + 1);
                var Text = `${cmsg.author.username}投掷出了：${ran.toString()}`;
                //深空投掷出了：45 成功
                //SanCheck检定：1d3 = 1
                //最终San值：45 - 1 = 44
				if(ran >= 96 && ran > skill){ //大失败
                    Text += " 巨大失败\nSanCheck检定：";
                    if (NumPatt.test(sp[0])) {
                        var Int = parseInt(sp[0]);
                        var skill = parseInt(sp[1]);
                        Text += `最大值 ${sp[0]}\n最终San值：${sp[1]} - ${sp[0]} = ${(skill - Int).toString()}`;
                        Send(Text);
                    }
                    else {
                        var ft = sp[0].split("d");
                        if (ft.length == 2) {
                            if (NumPatt.test(ft[0]) && NumPatt.test(ft[1])) { //sc[sl0]/[ft0]d[ft1][/s][sp1]
                                var Int = parseInt(ft[0]) * parseInt(ft[1]);
                                var skill = parseInt(sp[1]);
                                Text += `最大值 ${ft[0]}\n最终San值：${sp[1]} - ${ft[1]} = ${(skill - Int).toString()}`;
                                Send(Text);
                            }
                        }
                    }
				}
				else if(ran <= 5 && ran <= skill){ //大成功
                    Text += " 巨大成功\nSanCheck检定：";
                    if (NumPatt.test(scm[0])) {
                        var Int = parseInt(sc[0]);
                        var skill = parseInt(sc[1]);
                        Text += `最小值 ${sp[0]}\n最终San值：${sp[1]} - ${sp[0]} = ${(skill - Int).toString()}`;
                        Send(Text);
                    }
                    else {
                        var ft = sp[0].split("d");
                        if (ft.length == 2) {
                            if (NumPatt.test(ft[0]) && NumPatt.test(ft[1])) {
                                var Int = parseInt(ft[0]);
                                var skill = parseInt(sp[1]);
                                Text += `最小值 ${ft[0]}\n最终San值：${sp[1]} - ${ft[0]} = ${(skill - Int).toString()}`;
                                Send(Text);
                            }
                        }
                    }
				}
                else if (ran > skill) { //失败 
                    Text += " 失败\nSanCheck检定：";
                    if (NumPatt.test(sp[0])) { //sc[sl0]/[sp0][/s][sp1]
                        var Int = parseInt(sp[0]);
                        var skill = parseInt(sp[1]);
                        Text += sp[0] + `\n最终San值：${sp[1]} - ${sp[0]} = ${(skill - Int).toString()}`;
                        Send(Text);
                    }
                    else {
                        var ft = sp[0].split("d");
                        if (ft.length == 2) { //sc[sl0]/[ft0]d[ft1][/s][sp1]
                            if (NumPatt.test(ft[0]) && NumPatt.test(ft[1])) {
                                Text += sp[0] + " = (";
                                var diceNum = parseInt(ft[0]);
                                var diceMax = parseInt(ft[1]);
                                var Sum = 0;
                                var skill = parseInt(sp[1]);
                                for (let index = 0; index < diceNum; index++) {
                                    var ran = Math.floor(Math.random() * diceMax + 1);
                                    Sum += ran;
                                    if (index < diceNum - 1) {
                                        Text += `${ran.toString()} + `;
                                    }
                                    else if (index == diceNum - 1) {
                                        Text += ran.toString() + ") = ";
                                    }
                                }
                                Text += `${Sum.toString()}\n最终San值：${sp[1]} - ${Sum.toString()} = ${(skill - Sum).toString()}`;
                                Send(Text);
                            }
                        }
                    }
				}
				else if(ran <= skill){ //成功
                    Text += " 成功\nSanCheck检定：";
                    if (NumPatt.test(sl[0])) { //sc[sl0]/[sp0][/s][sp1]
                        var Int = parseInt(sl[0]);
                        var skill = parseInt(sp[1]);
                        Text += `${sl[0]}\n最终San值：${sp[1]} - ${sl[0]} = ${(skill - Int).toString()}`;
                        Send(Text);
                    }
                    else {
                        var ft = sl[0].split("d");
                        if (ft.length == 2) { //sc[ft0][ft1]/[sp0][/s][sp1]
                            if (NumPatt.test(ft[0]) && NumPatt.test(ft[1])) {
                                Text += sl[0] + " = (";
                                var diceNum = parseInt(ft[0]);
                                var diceMax = parseInt(ft[1]);
                                var Sum = 0;
                                var skill = parseInt(sp[1]);
                                for (let index = 0; index < diceNum; index++) {
                                    var ran = Math.floor(Math.random() * diceMax + 1);
                                    Sum += ran;
                                    if (index < diceNum - 1) {
                                        Text += `${ran.toString()} + `;
                                    }
                                    else if (index == diceNum - 1) {
                                        Text += `${ran.toString()} = `;
                                    }
                                }

                                Text += `${Sum.toString()}\n最终San值：${sp[1]} - ${Sum.toString()} = ${(skill - Sum).toString()}`;
                                Send(Text);
                            }
                        }
                    }
				}
			}
		}
	}
}

function COC7()
{
    var STR = BasePoint();
    var CON = BasePoint();
    var SIZ = BasePoint();
    var DEX = BasePoint();
    var APP = BasePoint();
    var INT = BasePoint();
    var POW = BasePoint();
    var EDU = BasePoint();
    Send(`${cmsg.author.username}的随机人物属性：\n力量STR：${STR}\n体质CON：${CON}\n体型SIZ：${SIZ}\n敏捷DEX：${DEX}\n外貌APP：${APP}\n智力INT：${INT}\n意志POW：${POW}\n教育EDU：${EDU}`);
}

function BasePoint()
{
    return (Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1)) * 5;
}

function Roll(i) {
    if (i != "") {
        var ft = new String(i).split("d");
        if (ft.length == 2) { //r[x]d[x] && r[x]d[x]+[x] && r[x]d[x][\s][x] && r[x]d[x]+[x][\s][x]
            if (ft[0] != '' && ft[1] != '') {
                //ft[0] 骰子数
                //ft[1] 待解析
                var ps = ft[1].split("+");
                if (ps.length == 1) { //r[x]d[x][/s][x] && r[x]d[x]
                    var sp = ps[0].split(" ");
                    if (sp.length == 1) { //r[ft0]d[ft1]
                        if (NumPatt.test(ft[0]) && NumPatt.test(ft[1])) { //验证是否二者均全为数字，到此为止完全成功的话，即代表符合r[x]d[x]格式
                            var diceNum = parseInt(ft[0]);
                            var diceMax = parseInt(ft[1]);
                            if (diceNum <= 1000 && diceMax <= 10000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                                var Sum = 0;
                                var Text = `${cmsg.author.username}投掷出了：(`;

                                for (let index = 0; index < diceNum; index++) {
                                    var ran = Math.floor(Math.random() * diceMax + 1);
                                    Sum += ran;
                                    if (index < diceNum - 1) {
                                        Text += `${ran.toString()} + `;
                                    }
                                    else if (index == diceNum - 1) {
                                        Text += `${ran.toString()})`;
                                    }
                                }

                                Text += ` =  ${Sum.toString()}`;

                                Send(Text);
                            }
                            else {
                                Send(`为避免服务器压力过大，一次最多只能投掷一千个骰子，每个骰子最多一万面\n当前设定的骰子数：${diceNum}\n当前设定的骰子面数：${diceMax}`);
                            }
                        }
                    }
                    else if (sp.length == 2) { //r[ft0]d[sp0][/s][sp1]
                        if (NumPatt.test(ft[0]) && NumPatt.test(sp[0]) && NumPatt.test(sp[1])) { //验证是否三者均全为数字，到此为止完全成功的话，即代表符合r[x]d[x][/s][x]格式
                            var diceNum = parseInt(ft[0]);
                            var diceMax = parseInt(sp[0]);
                            var skill = parseInt(sp[1]);
                            if (diceNum <= 1000 && diceMax <= 10000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                                var Sum = 0;
                                var Text = `${cmsg.author.username}投掷出了：(`;

                                for (let index = 0; index < diceNum; index++) {
                                    var ran = Math.floor(Math.random() * diceMax + 1);
                                    Sum += ran;
                                    if (index < diceNum - 1) {
                                        Text += `${ran.toString()} + `;
                                    }
                                    else if (index == diceNum - 1) {
                                        Text += `${ran.toString()})`;
                                    }
                                }

                                Text += ` =  ${Sum.toString()}`;

                                var Success = success_test(Sum, skill);

                                Send(`${Text}\n${Success}`);
                            }
                            else {
                                Send(`为避免服务器压力过大，一次最多只能投掷一千个骰子，每个骰子最多一万面\n当前设定的骰子数：${diceNum}\n当前设定的骰子面数：${diceMax}`);
                            }
                        }
                    }
                }
                else if (ps.length == 2) { //r[x]d[x]+[x] && r[x]d[x]+[x][\s][x]
                    var sp = ps[1].split(" ");
                    if (sp.length == 1) { //r[ft0]d[ps0]+[ps1]
                        if (NumPatt.test(ft[0]) && NumPatt.test(ps[0]) && NumPatt.test(ps[1])) { //验证是否二者均全为数字，到此为止完全成功的话，即代表符合r[x]d[x]格式
                            var diceNum = parseInt(ft[0]);
                            var diceMax = parseInt(ps[0]);
                            var plus = parseInt(ps[1]);
                            if (diceNum <= 1000 && diceMax <= 10000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                                var Sum = 0;
                                var Text = `${cmsg.author.username}投掷出了：(`;

                                for (let index = 0; index < diceNum; index++) {
                                    var ran = Math.floor(Math.random() * diceMax + 1);
                                    Sum += ran;
                                    if (index < diceNum - 1) {
                                        Text += `${ran.toString()} + `;
                                    }
                                    else if (index == diceNum - 1) {
                                        Text += `${ran.toString()})`;
                                    }
                                }

                                Text += ` + ${plus.toString()} = ${(Sum + plus).toString()}`;

                                Send(Text);
                            }
                            else {
                                Send(`为避免服务器压力过大，一次最多只能投掷一千个骰子，每个骰子最多一万面\n当前设定的骰子数：${diceNum}\n当前设定的骰子面数：${diceMax}`);
                            }
                        }
                    }
                    else if (sp.length == 2) { //r[ft0]d[ps0]+[sp0][/s][sp1]
                        if (NumPatt.test(ft[0]) && NumPatt.test(ps[0]) && NumPatt.test(sp[0]) && NumPatt.test(sp[1])) { //验证是否均全为数字
                            var diceNum = parseInt(ft[0]);
                            var diceMax = parseInt(ps[0]);
                            var plus = parseInt(sp[0]);
                            var skill = parseInt(sp[1]);
                            if (diceNum <= 1000 && diceMax <= 10000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                                var Sum = 0;
                                var Text = `${cmsg.author.username}投掷出了：(`;

                                for (let index = 0; index < diceNum; index++) {
                                    var ran = Math.floor(Math.random() * diceMax + 1);
                                    Sum += ran;
                                    if (index < diceNum - 1) {
                                        Text += `${ran.toString()} + `;
                                    }
                                    else if (index == diceNum - 1) {
                                        Text += `${ran.toString()})`;
                                    }
                                }

                                Text += ` + ${plus.toString()} = ${(Sum + plus).toString()}`;

                                Sum += plus;

                                var Success = success_test(Sum, skill);

                                Send(`${Text}\n${Success}`);
                            }
                            else {
                                Send(`为避免服务器压力过大，一次最多只能投掷一千个骰子，每个骰子最多一万面\n当前设定的骰子数：${diceNum}\n当前设定的骰子面数：${diceMax}`);
                            }
                        }
                    }
                }
            }
            else if (ft[0] == '' && ft[1] != '') {
                ft[0] = ft[1];
                var ps = ft[0].split("+");
                if (ps.length == 1) { //rd[x][/s][x] && rd[x]
                    var sp = ft[0].split(" ");
                    if (sp.length == 1) { //rd[x]
                        if (NumPatt.test(ft[0])) { //验证是否二者均全为数字，到此为止完全成功的话，即代表符合r[x]d[x]格式
                            var diceMax = parseInt(ft[0]);
                            if (diceMax <= 10000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                                var Sum = Math.floor(Math.random() * diceMax + 1);
                                var Text = `${cmsg.author.username}投掷出了：${Sum.toString()}`;
                                Send(Text);
                            }
                            else {
                                Send(`为避免服务器压力过大，一个骰子最多一万面\n当前设定的骰子面数：${diceMax}`);
                            }
                        }
                    }
                    else if (sp.length == 2) { //rd[x][/s][x]
                        if (NumPatt.test(sp[0]) && NumPatt.test(sp[1])) { //验证是否三者均全为数字，到此为止完全成功的话，即代表符合r[x]d[x][/s][x]格式
                            var diceMax = 100;
                            if (ps[0] != "") {
                                diceMax = parseInt(ps[0]);
                            }
                            var skill = parseInt(sp[1]);
                            if (diceMax <= 1000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                                var Sum = Math.floor(Math.random() * diceMax + 1);
                                var Text = `${cmsg.author.username}投掷出了：${Sum.toString()}`;

                                var Success = success_test(Sum, skill);

                                Send(`${Text}\n${Success}`);
                            }
                            else {
                                Send(`为避免服务器压力过大，一个骰子最多一万面\n当前设定的骰子面数：${diceMax}`);
                            }
                        }
                    }
                }
                else if (ps.length == 2) { //rd[x]+[x] && rd[x]+[x][\s][x]
                    var sp = ps[1].split(" ");
                    if (sp.length == 1) { //rd[ps0]+[ps1]
                        if (NumPatt.test(ps[0]) && NumPatt.test(ps[1])) { //验证是否二者均全为数字，到此为止完全成功的话，即代表符合r[x]d[x]格式
                            var diceMax = parseInt(ps[0]);
                            var plus = parseInt(ps[1]);
                            if (diceMax <= 10000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                                var Sum = Math.floor(Math.random() * diceMax + 1);
                                var Text = `${cmsg.author.username}投掷出了：${Sum.toString()}`;
                                Send(Text);
                            }
                            else {
                                Send(`为避免服务器压力过大，一个骰子最多一万面\n当前设定的骰子面数：${diceMax}`);
                            }
                        }
                    }
                    else if (sp.length == 2) { //rd[ps0]+[sp0][/s][sp1]
                        if (NumPatt.test(ps[0]) && NumPatt.test(sp[0]) && NumPatt.test(sp[1])) { //验证是否均全为数字
                            var diceMax = parseInt(ps[0]);
                            var plus = parseInt(sp[0]);
                            var skill = parseInt(sp[1]);
                            if (diceMax <= 10000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                                var Sum = Math.floor(Math.random() * diceMax + 1);
                                var Text = `${cmsg.author.username}投掷出了：${Sum.toString()}`;

                                Text += ` + ${plus.toString()} = ${(Sum + plus).toString()}`;

                                Sum += plus;

                                var Success = success_test(Sum, skill);

                                Send(`${Text}\n${Success}`);
                            }
                            else {
                                Send(`为避免服务器压力过大，一个骰子最多一万面\n当前设定的骰子面数：${diceMax}`);
                            }
                        }
                    }
                }
            }
        }
        else if (ft.length == 1) { //rd[x] && rd[x][/s][x] && rd[x]+[x][/s][x]
            var ps = ft[0].split("+");
            if (ps.length == 1) { //rd[x][/s][x] && rd[x]
                var sp = ft[0].split(" ");
                if (sp.length == 1) { //rd[x]
                    if (NumPatt.test(ft[0])) { //验证是否二者均全为数字，到此为止完全成功的话，即代表符合r[x]d[x]格式
                        var diceMax = parseInt(ft[0]);
                        if (diceMax <= 10000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                            var Sum = Math.floor(Math.random() * diceMax + 1);
                            var Text = `${cmsg.author.username}投掷出了：${Sum.toString()}`;
                            Send(Text);
                        }
                        else {
                            Send(`为避免服务器压力过大，一个骰子最多一万面\n当前设定的骰子面数：${diceMax}`);
                        }
                    }
                }
                else if (sp.length == 2) { //rd[x][/s][x]
                    if (NumPatt.test(sp[0]) && NumPatt.test(sp[1])) { //验证是否三者均全为数字，到此为止完全成功的话，即代表符合r[x]d[x][/s][x]格式
                        var diceMax = parseInt(sp[0]);
                        var skill = parseInt(sp[1]);
                        if (diceMax <= 1000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                            var Sum = Math.floor(Math.random() * diceMax + 1);
                            var Text = `${cmsg.author.username}投掷出了：${Sum.toString()}`;

                            var Success = success_test(Sum, skill);

                            Send(`${Text}\n${Success}`);
                        }
                        else {
                            Send(`为避免服务器压力过大，一个骰子最多一万面\n当前设定的骰子面数：${diceMax}`);
                        }
                    }
                }
            }
            else if (ps.length == 2) { //rd[x]+[x] && rd[x]+[x][\s][x]
                var sp = ps[1].split(" ");
                if (sp.length == 1) { //rd[ps0]+[ps1]
                    if (NumPatt.test(ps[0]) && NumPatt.test(ps[1])) { //验证是否二者均全为数字，到此为止完全成功的话，即代表符合r[x]d[x]格式
                        var diceMax = parseInt(ps[0]);
                        var plus = parseInt(ps[1]);
                        if (diceMax <= 10000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                            var Sum = Math.floor(Math.random() * diceMax + 1);
                            var Text = `${cmsg.author.username}投掷出了：${Sum.toString()}`;
                            Send(Text);
                        }
                        else {
                            Send(`为避免服务器压力过大，一个骰子最多一万面\n当前设定的骰子面数：${diceMax}`);
                        }
                    }
                }
                else if (sp.length == 2) { //rd[ps0]+[sp0][/s][sp1] //TODO
                    if (NumPatt.test(ps[0]) && NumPatt.test(sp[0]) && NumPatt.test(sp[1])) { //验证是否均全为数字
                        var diceMax = parseInt(ps[0]);
                        var plus = parseInt(sp[0]);
                        var skill = parseInt(sp[1]);
                        if (diceMax <= 10000) { //为避免服务器压力过大或被人爆破，限制一下dice的个数上限为一千个，dice的面数最多为一万面
                            var Sum = Math.floor(Math.random() * diceMax + 1);
                            var Text = `${cmsg.author.username}投掷出了：${Sum.toString()}`;

                            Text += ` + ${plus.toString()} = ${(Sum + plus).toString()}`;

                            Sum += plus;

                            var Success = success_test(Sum, skill);

                            Send(`${Text}\n${Success}`);
                        }
                        else {
                            Send(`为避免服务器压力过大，一个骰子最多一万面\n当前设定的骰子面数：${diceMax}`);
                        }
                    }
                }
            }
        }
    }
    else { //r
        var toudian = Math.floor(Math.random() * 100 + 1);
        Send(`${cmsg.author.username}投掷出了：${toudian}`);
    }
}

function success_test(Sum, skill)
{
    var Success = '';
    if (Sum > 95 && Sum > skill) {
        Success = "**巨大失败**";
    }
    else if (Sum > skill) {
        Success = "**普通失败**"
    }
    else if (Sum <= 5 && Sum <= skill) {
        Success = "**巨大成功**";
    }
    else if (Sum > skill / 2) {
        Success = "**普通成功**";
    }
    else if (Sum <= skill / 2 && Sum > skill / 5) {
        Success = "**困难成功**";
    }
    else if (Sum <= skill / 5) {
        Success = "**极难成功**";
    }
    return Success;
}

function ReadSendFile(filename) {
    fs.readFile(filename, (error, data) => {
        if (error)
            console.log(error);
	Send(data.toString());
    });
}

function Help()
{
    ReadSendFile("./Help.txt");
}

function About()
{
    ReadSendFile("./About.txt");
}

function SecretDice()
{
	Send("目前因为开黑啦不允许非官方机器人私聊，所以暗骰功能无法使用。\n暗骰代替方案：\n请在服务器内新建一个文字频道，并让该频道只能被kp和骰子娘看到，然后在频道内进行正常投点来代替暗骰")
}

function Send(s)
{
    if (cmsg != null) {
        bot.sendChannelMessage(types_1.MessageType.kmarkdown, cmsg.channelId, s, cmsg.msgId);
    }
}
