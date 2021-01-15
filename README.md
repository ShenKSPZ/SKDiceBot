# SKDiceBot
## 环境配置
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
}
```
5. 确保你设备的防火墙允许8080端口的访问，你也可以修改port为其他端口，然后将你的防火墙给你设置的端口开放访问
6. 用NodeJS来运行“kaiheila/BotRoot/SKDiceBot.js”

如果是控制台的话，就运行:
```
node kaiheila/BotRoot/SKDiceBot.js
```

看到控制台提示“机器人启动完成！”就代表机器人启动成功了

7. 在开黑啦的控制面板的Callback URL填入："http://[你的IP或域名]:8080/?compress=0"

看到控制面板右下角提示“操作成功”，就代表机器人与开黑啦之间的通信没有问题了

8. 在开黑啦的控制面板点击机器人上线即可
