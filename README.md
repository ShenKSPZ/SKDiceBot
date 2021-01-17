# SKDiceBot
## 开黑啦环境配置
1. 跟开黑啦官方申请机器人
2. 安装NodeJS 14.x或更高
3. 打开kaiheila/BotRoot/config.json
4. 修改文件中的 key，token 和 verifyToken，这些数值都在你的开黑啦机器人的控制面板可以看到
```Json
{
  "mode": "webhook",
  "port": 8080,
  "key": "YOUR ENCRYPT KEY HERE",
  "token": "YOUR TOEKN HERE",
  "verifyToken": "YOUR VERIFY TOEKN HERE"
  "BotName": "素包子##1132416142"
}
```
5. 如果正确填写文件中的BotName，那么就可以处理你的机器人被@的情况。要正确获取DiceBot，请取消代码文件第34行的注释。
```JavaScript
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
            //console.log(e.content); //***************请通过删除这一行console之前的"//"来取消注释********************************
            cmsg = new types_1.TextMessage(e);
            Process(cmsg.content);
        });
        global.botInstance = bot
        console.log('DiceBot Start!');
    }
});
```
接着先继续执行接下来的步骤。

6. 确保你设备的防火墙允许8080端口的访问，你也可以修改port为其他端口，然后将你的防火墙给你设置的端口开放访问
7. 用NodeJS来运行“kaiheila/BotRoot/SKDiceBot.js”

如果是控制台的话，就运行:
```
node kaiheila/BotRoot/SKDiceBot.js
```

看到控制台提示“DiceBot Start!”就代表机器人启动成功了

8. 在开黑啦的控制面板的Callback URL填入："http://[你的IP或域名]:8080/?compress=0"

看到控制面板右下角提示“操作成功”，就代表机器人与开黑啦之间的通信没有问题了

9. 在开黑啦的控制面板点击机器人上线即可

10. 新建一个服务器，把机器人拉入。然后你就可以在服务器里进行测试了。输入".help"来获取机器人的使用帮助信息。

11. 如果你准备继续获取BotName，那么在你的测试服务器里，@一下机器人。你就会在控制台里看到你刚刚发送的消息。

格式应该类似"@素包子##1132416142"。就是"@[你机器人的名字]#[一长串数字]"

12. 将@符号之后的部分复制(注意，末尾可能有空格，空格不要复制上)，然后打开config.json。接着将里面BotName之后的项目替换成你刚刚复制的内容，然后保存。

13. 接着回到刚刚启动了机器人的控制台，如果是调试代码的软件，请停止机器人并重新启动。
如果是CMD或者Linux的终端，请直接按下ctrl+c键终止机器人进程。然后重新输入：
```
node kaiheila/BotRoot/SKDiceBot.js
```

14. 至此，你的机器人就可以正常工作了

## Discord环境配置
1. 申请获得一个Discord机器人
2. 安装NodeJS 10.x或更高
3. 打开discord/config.json
4. 修改文件中的 token，这个数值可以在你的Discord的开发者面板看到
```Json
{
    "token": "YOUR TOKEN HERE",
    "BotName": "<@!799809836400246805>"
}

```
5. 如果正确填写文件中的BotName，那么就可以处理你的机器人被@的情况。要正确获取DiceBot，请取消代码文件第27行的注释。
```JavaScript
fs.readFile("./config.json", (error, data) => {
  if (error) {
    console.log("未能成功读取到配置文件:\n");
    console.log(error);
  }
  else {
    BotConfig = JSON.parse(data.toString());
    bot.login(BotConfig.token);
    bot.on('ready', () => {
      console.info(`Logged in as ${bot.user.tag}!`);
    });
    bot.on('message', (msg) => {
      //console.log(msg.content); //***************请通过删除这一行console之前的"//"来取消注释********************************
      cmsg = msg;
      Process(cmsg.content);
    });
  }
});
```
接着先继续执行接下来的步骤。

6. 用NodeJS来运行“discord/SKDiceBot.js”

如果是控制台的话，就运行:
```
node discord/SKDiceBot.js
```

看到控制台提示“Logged in as [你的机器人的名字]”就代表机器人启动成功了

7. 新建一个服务器，把机器人拉入。然后你就可以在服务器里进行测试了。输入"-help"来获取机器人的使用帮助信息。

8. 如果你准备继续获取BotName，那么在你的测试服务器里，@一下机器人。你就会在控制台里看到你刚刚发送的消息。

格式类似于"<@!799809836400246805>"，也就是"<@![一长串数字]>"

9. 将这段文字复制，(注意不要带上空格)，然后打开config.json。接着将里面BotName之后的项替换成你刚刚复制的内容，然后保存。

10. 接着回到刚刚启动了机器人的控制台，如果是调试代码的软件，请停止机器人并重新启动。
如果是CMD或者Linux的终端，请直接按下ctrl+c键终止机器人进程。然后重新输入：
```
node discord/SKDiceBot.js
```

11. 至此，你的机器人就可以正常工作了
