<!--@description: 消息左侧列表
	@author: 王跃飞
	@update: 王跃飞(2019-09-11 16:16)-->
<template>
	<div class="newMessage-container">
		<div v-if="invitationTeamInfoName != ''||adminInfo.companyName!==''">
			<template v-for="(item,index) in showNoticeDate" >
				<div class="opera-container" ref="operaPanal"
					 v-show="JSON.parse(item.content.content).rightMouseEvent">
					<div @click.stop="setDialogueTop(item, index)">设为置顶</div>
					<div @click.stop="deletDialogue(item, index)">删除对话</div>
					<div @click.stop="DontDisturb(item, index)">对话免打扰</div>
				</div>
				<div class="newMessage-item clear" @click.stop="turnToPage(item, index)"
					 @contextmenu.prevent="operaPanalHandle($event,item, index)" v-show="showNoticeDate.length>0">
					<div class="newMessage-icon">
						<img :src=" JSON.parse(item.content.content).companyLogoUrl!==''&&JSON.parse(item.content.content).companyLogoUrl"
							 v-if="item.content.extra === '2'"
							 :style="backImg[1]">
						<img :src=" JSON.parse(item.content.content).companyLogoUrl!==''&&JSON.parse(item.content.content).companyLogoUrl"
							 v-else-if="item.content.extra ==='3'"
							 :style="backImg[2]">
						<img :src=" JSON.parse(item.content.content).companyLogoUrl!==''&&JSON.parse(item.content.content).companyLogoUrl"
							 v-else-if="item.content.extra ==='1'"
							 :style="backImg[0]">
						<img :src=" JSON.parse(item.content.content).companyLogoUrl!==''&&JSON.parse(item.content.content).companyLogoUrl"
							 v-else-if="item.content.extra ==='7'"
							 :style="backImg[6]">
						<img :src="JSON.parse(item.content.content).companyLogoUrl!==''&&JSON.parse(item.content.content).companyLogoUrl"
							 v-else-if="item.content.extra ==='5'"
							 :style="backImg[5]">
						<img :src="JSON.parse(item.content.content).companyLogoUrl!==''&&JSON.parse(item.content.content).companyLogoUrl "
							 v-else-if="item.content.extra ==='6'"
							 :style="backImg[4]">
						<img :src="JSON.parse(item.content.content).companyLogoUrl!==''&&JSON.parse(item.content.content).companyLogoUrl"
							 v-else-if="item.content.extra ==='4'"
							 :style="backImg[3]">
					</div>
					<div class="newMessage-info">
						<h1><span>{{JSON.parse(item.content.content).noticeTitle}}</span><span>{{item.sentTime | format}}</span>
						</h1>
						<p><span>{{JSON.parse(item.content.content).noticeContent}}</span><span
							:class="[item.unreadMessageCount===0?'threeClass':item.unreadMessageCount>0&&item.unreadMessageCount<100?'oneClass':'twoClass']"
							ref="numPrompt" v-show="item.unreadMessageCount>0">{{item.unreadMessageCount}}</span>
						</p>
					</div>

				</div>
			</template>
		</div>


		<!--		<div class="newMessage-item clear" @click.stop="()=>{$router.push({name:'teamInvitation'})}"-->
		<!--			 v-if="invitationTeamInfoName != ''">-->
		<!--			<div class="newMessage-icon"><img src="../images/jiarutuandui@2x.png"></div>-->
		<!--			<div class="newMessage-info">-->
		<!--				<h1><span>邀请加入团队邀请通知</span><span>{{invitationTime}}</span></h1>-->
		<!--				<p><span>{{invitationTeamInfoName}}</span><span>10</span></p>-->
		<!--			</div>-->
		<!--		</div>-->
		<div v-else class="no_content">
			暂无消息
		</div>
		<!--		<div class="rong-show-box">-->
		<!--			<h3>初始化以及消息接收:</h3>-->
		<!--			&lt;!&ndash;			<p v-for="data in showWorkDatas" v-bind:key="data">&ndash;&gt;-->
		<!--			&lt;!&ndash;				{{data}}&ndash;&gt;-->
		<!--			&lt;!&ndash;			</p>&ndash;&gt;-->
	</div>
</template>
<script>
	import '@/modules/common.js'
	import bus from '../../../../modules/bus'

	var RongIMLib = require('../../../../../static/js/RongIMLib-2.5.0.js')
	var Protobuf = require('../../../../../static/js/protobuf-2.3.5.min.js')
	// var RongIMEmoji = require('../../../../../static/js/RongEmoji-2.2.7.js')
	var RongIMClient = RongIMLib.RongIMClient
	export default {
		data() {
			return {
				orgManager: 'orgManager',
				ssoManager: 'ssoManager',
				adminInfo: JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
				invitationList: [],
				invitationTeamInfoName: '',
				invitationTime: new Date().Format('hh:mm'),
				webToken: window.sessionStorage.getItem('token'),	// 登陆云创的token
				// conversationType: RongIMLib.ConversationType.SYSTEM,				// 会话类型
				createRongYunFlag: false,										// 初始化建立一次融云连接的开关
				operaPanalFlag: false,											// 鼠标右击弹窗开关
				num: '100',														// 消息数
				params: {},    													// 初始化init中的参数
				appkey: '',														// 唯一融云账户key
				token: '',														// 唯一融云账户token
				navi: '',														// 默认空字符
				portraitUri: '',												// 用户头像
				userId: '',														// 用户id
				name: '',														// 用户姓名
				showApplyJoinComDatas: [], 										// 展示的申请加入企业数据
				showJoinTeamDatas: [], 											// 展示的加入团队数据
				showRefuseInvitaDatas: [], 										// 展示的拒绝邀请数据
				showInvitaJoinTeamDatas: [],									// 展示的邀请加入团队数据
				showWorkDatas: [],												// 展示的工作数据
				showAgreeInvitaDatas: [],										// 接收同意邀请通知
				showComNumData: [],												// 公司号通知
				msg: {},														// 接收每个类型的最后一条消息
				acceptNoticeUrl: 'messageManager',								// 接收消息的协议和端口号
				showNoticeDate: [],												// 接收一级展示消息
				storageFlag: false,												// 开启消息提醒展示模块持久化的开关
				newsNoticeNumIndex: '',											// 存储数量数据
				timestrap: null,												// 默认传 null, 若从头开始获取历史消息, 请赋值为 0
				count: 20,														// 默认融云每秒获取的最大条数限制
				noticeFlag: false,												// 一层列表盒子接收消息的开关
				trunWorkFlag:false,												// 跳转工作页面的开关

				backImg: [
					{
						background: "url(" + require("../images/jiarutuandui@2x(1).png") + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "100%",
					},
					{
						background: "url(" + require("../images/shenqingtixing@2x.png") + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "100%",
					}, {
						background: "url(" + require("../images/jujue@2x.png") + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "100%",
					}, {
						background: "url(" + require("../images/jiarutuandui@2x.png") + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "100%",
					},
					{
						background: "url(" + require("../images/gongzuo@2x.png") + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "100%",
					},
					{
						background: "url(" + require("../images/tongyi@2x.png") + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "100%",
					},
					{
						background: "url(" + require("../images/GrouGongsihao.png") + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "100%",
					}]
			}


		},
		filters: {
			format: function (value) {
				const timeX = new Date().getTime()
				const cx = Math.abs(timeX - value)
				if (cx > new Date(new Date().toLocaleDateString()).getTime() && cx < new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 * 60 * 1000)) {
					return new Date(value).Format('hh:mm')
				} else {
					return new Date(value).Format('yyyy-MM-dd hh:mm')
				}
			}
		},
		methods: {
			//初始化融云连接
			init(params, addPromptInfo) {
				var _that = this
				var timestrap = null; // 默认传 null, 若从头开始获取历史消息, 请赋值为 0
				var count = 20;
				var appkey = params.appkey
				var token = params.token
				var navi = params.navi
				var callback = {
					onSuccess: function (userId) {
						console.log('Reconnect successfully. ' + userId);
					},
					onTokenIncorrect: function () {
						console.log('token无效');
					},
					onError: function (errorCode) {
						console.log(errorcode);
					}
				};
				var config1 = {
					// 默认 false, true 启用自动重连，启用则为必选参数
					auto: true,
					// 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
					url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
					// 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
					rate: [100, 1000, 3000, 6000, 10000]
				};
				var config = {
					protobuf: Protobuf
				}
				if (navi) {
					config.navi = navi
				}
				RongIMClient.init(appkey, null, config)
				RongIMClient.setConnectionStatusListener({
					onChanged: function (status) {
						switch (status) {
							case RongIMLib.ConnectionStatus['CONNECTED']:
							case 0:
								console.log('连接成功')
								break
							case RongIMLib.ConnectionStatus['CONNECTING']:
							case 1:
								console.log('连接中')
								break
							case RongIMLib.ConnectionStatus['DISCONNECTED']:
							case 2:
								console.log('当前用户主动断开链接')
								break
							case RongIMLib.ConnectionStatus['NETWORK_UNAVAILABLE']:
							case 3:
								console.log('网络不可用')
								break
							case RongIMLib.ConnectionStatus['CONNECTION_CLOSED']:
							case 4:
								console.log('未知原因，连接关闭')
								break
							case RongIMLib.ConnectionStatus['KICKED_OFFLINE_BY_OTHER_CLIENT']:
							case 6:
								console.log('用户账户在其他设备登录，本机会被踢掉线')
								break
							case RongIMLib.ConnectionStatus['DOMAIN_INCORRECT']:
							case 12:
								console.log('当前运行域名错误，请检查安全域名配置')
								break
						}
					}
				})
				// 消息监听器 接收响应信息
				RongIMClient.setOnReceiveMessageListener({
					// 接收到的消息
					onReceived: function (message) {
						// 判断消息类型
						switch (message.messageType) {
							// latestMessage
							case RongIMClient.MessageType.TextMessage:
								console.log('asds')
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getInitConversation()
								// _that.getNowNews(message)

								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// message.content.content => 文字内容
								break;
							case RongIMClient.MessageType.VoiceMessage:
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getInitConversation()

								// _that.getNowNews(message)

								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// message.content.content => 格式为 AMR 的音频 base64
								break;
							case RongIMClient.MessageType.ImageMessage:
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getInitConversation()

								// _that.getNowNews(message)

								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// message.content.content => 图片缩略图 base64
								// message.content.imageUri => 原图 URL
								break;
							case RongIMClient.MessageType.LocationMessage:
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getInitConversation()

								// _that.getNowNews(message)

								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// message.content.latiude => 纬度
								// message.content.longitude => 经度
								// message.content.content => 位置图片 base64
								break;
							case RongIMClient.MessageType.RichContentMessage:
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getInitConversation()

								// _that.getNowNews(message)
								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// message.content.content => 文本消息内容
								// message.content.imageUri => 图片 base64
								// message.content.url => 原图 URL
								break;
							case RongIMClient.MessageType.InformationNotificationMessage:
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getInitConversation()

								// _that.getNowNews(message)
								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// do something
								break;
							case RongIMClient.MessageType.ContactNotificationMessage:
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getInitConversation()

								// _that.getNowNews(message)

								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// do something
								break;
							case RongIMClient.MessageType.ProfileNotificationMessage:
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getInitConversation()

								// _that.getNowNews(message)

								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// do something
								break;
							case RongIMClient.MessageType.CommandNotificationMessage:
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getInitConversation()

								// _that.getNowNews(message)

								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// do something
								break;
							case RongIMClient.MessageType.CommandMessage:
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getInitConversation()

								// _that.getNowNews(message)

								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// do something
								break;
							case RongIMClient.MessageType.UnknownMessage:
								console.log(message)
								_that.getUnreadCount(message.conversationType, message.targetId, function (count) {
									message.unreadMessageCount = count
								})
								_that.getTotalUnreadCount()

								// _that.getNowNews(message)

								// _that.getConversationList(_that.getNowNews(message))
								_that.getTotalUnreadCount()
								// do something
								break;
							default:
							// do something
						}
					}
				})
				//融云监听链接
				RongIMClient.connect(token, {
					onSuccess: function (userId) {
						addPromptInfo('链接成功，用户id：' + userId)
						_that.getInitConversation()
						_that.getTotalUnreadCount()
						_that.getHistory(RongIMLib.ConversationType.PRIVATE, "1568094369530064", null, 10)
					},
					onTokenIncorrect: function () {
						addPromptInfo('token无效')
						RongIMClient.reconnect(callback, config1);
					},
					onError: function (errorCode) {
						addPromptInfo(errorCode)
						RongIMClient.reconnect(callback, config1);

					}
				}, null)
			},
			// 获取所有回话总未读消息数
			getTotalUnreadCount() {
				/*
                    阅读时间戳缓存在 localStorage 中，消息状态根据发送时间和阅读时间戳对比判断
                    每次接受新消息后通过重新调用此方法计算
                 */
				var start = new Date().getTime();
				var _that = this
				RongIMClient.getInstance().getTotalUnreadCount({
					onSuccess: function (count) {
						RongIMClient.getInstance().getConversationList({
							onSuccess: function (list) {
								if (list && list.length > 0) {
									list.forEach(item => {
										if (item.latestMessage.content.content === '聊天界面的内容') {
											count = count - 1
										}
									})
									bus.$emit('msgCount', count)

								}
								// list => 会话列表集合
							},
							onError: function (error) {
								// do something
							}
						}, null);

						// sessionStorage.setItem('msgCount', count)
						//count 大于0 的时候触发
						console.log("获取总未读数成功", count, start);
					},
					onError: function (error) {
						console.log("获取总未读数失败", error, start);
					}
				});
			},
			//获取指定未读消息数
			getUnreadCount(conversationType, targetId, callback) {
				RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
					onSuccess: function (count) {
						console.log(count)
						callback(count)
						// count => 指定会话的总未读数
					},
					onError: function () {
						// error => 获取指定会话未读数错误码
					}
				});
			},
			// 获取历史消息
			getHistory(conversationType, targetId, timestrap, count) {
				var _that = this
				RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
					onSuccess: function (list, hasMsg) {
						if (list.length > 0) {
							_that.msg.lastMessageSendTime = list[list.length - 1].sentTime
						}
						/*
                            list: 获取的历史消息列表
                            hasMsg: 是否还有历史消息可以获取
                          */
						if (hasMsg) {
							_that.getHistory(conversationType, targetId, timestrap, count)
						}
						// console.log('获取历史消息成功', list, hasMsg);

					},
					onError: function (error) {
						// 请排查：单群聊消息云存储是否开通
						console.log('获取历史消息失败', error);
					}
				})
			},
			// 初始化获取会话列表
			getInitConversation(callback) {
				var _that = this
				RongIMClient.getInstance().getConversationList({
					onSuccess: function (list) {
						callback
						console.log(list)
						if (list && list.length > 0) {
							for (var i = 0; i < list.length; i++) {
								if (list[i].latestMessage.conversationType === 1 && list[i].latestMessage.content && list[i].latestMessage.content.extra) {
									if (list[i].latestMessage.content.extra !== undefined || list[i].latestMessage.content.extra !== '') {
										if (list[i].latestMessage.content.extra === '1') {
											list[i].latestMessage.unreadMessageCount = list[i].unreadMessageCount
											_that.showJoinTeamDatas.push(list[i].latestMessage)
										}
										if (list[i].latestMessage.content.extra === '2') {
											list[i].latestMessage.unreadMessageCount = list[i].unreadMessageCount
											_that.showApplyJoinComDatas.push(list[i].latestMessage)
										}
										if (list[i].latestMessage.content.extra === '3') {
											list[i].latestMessage.unreadMessageCount = list[i].unreadMessageCount
											_that.showRefuseInvitaDatas.push(list[i].latestMessage)
										}
										if (list[i].latestMessage.content.extra === '4') {
											list[i].latestMessage.unreadMessageCount = list[i].unreadMessageCount
											_that.showInvitaJoinTeamDatas.push(list[i].latestMessage)
										}
										if (list[i].latestMessage.content.extra === '5') {
											list[i].latestMessage.unreadMessageCount = list[i].unreadMessageCount
											_that.showAgreeInvitaDatas.push(list[i].latestMessage)
										}
										if (list[i].latestMessage.content.extra === '6') {
											list[i].latestMessage.unreadMessageCount = list[i].unreadMessageCount
											_that.showWorkDatas.push(list[i].latestMessage)
										}
										if (list[i].latestMessage.content.extra === '7') {
											list[i].latestMessage.unreadMessageCount = list[i].unreadMessageCount
											_that.showComNumData.push(list[i].latestMessage)
										}
									}
								}
							}
							this.noticeFlag = true
						}
						if (this.noticeFlag) {
							_that.showNoticeDate = []
							console.log(_that.showApplyJoinComDatas)
							console.log(_that.showJoinTeamDatas)
							console.log(_that.showRefuseInvitaDatas)
							console.log(_that.showInvitaJoinTeamDatas)
							console.log(_that.showAgreeInvitaDatas)
							console.log(_that.showComNumData)
							console.log(_that.showWorkDatas)
							if (_that.showJoinTeamDatas.length > 0) _that.showNoticeDate.push(_that.showJoinTeamDatas[0])
							if (_that.showApplyJoinComDatas.length > 0) _that.showNoticeDate.push(_that.showApplyJoinComDatas[0])
							if (_that.showRefuseInvitaDatas.length > 0) _that.showNoticeDate.push(_that.showRefuseInvitaDatas[0])
							if (_that.showInvitaJoinTeamDatas.length > 0) {
								console.log(1)
								_that.showNoticeDate.push(_that.showInvitaJoinTeamDatas[0])
							}
							if (_that.showAgreeInvitaDatas.length > 0) _that.showNoticeDate.push(_that.showAgreeInvitaDatas[0])
							if (_that.showComNumData.length > 0) _that.showNoticeDate.push(_that.showComNumData[0])
							if (_that.showWorkDatas && _that.showWorkDatas.length > 0) {
								for (var i = 0; i < _that.showWorkDatas.length; i++) {
									_that.showNoticeDate.push(_that.showWorkDatas[i])
								}
							}
						}
						console.log(_that.showNoticeDate)
						// list => 会话列表集合
					},
					onError: function (error) {
						// do something
					}
				}, null);
			},
			// 获取数据填充盒子
			handleArrayData(value, data) {
				value = []
				var _that = this
				console.log(_that.showNoticeDate)
				if (_that.showNoticeDate.length === 0) {
					value = data
					_that.showNoticeDate.push(value[0])
				} else if (_that.showNoticeDate.length > 0) {
					value.push(data)
					_that.showNoticeDate.forEach((item, index) => {
						if (item.content.extra === data.content.extra) {
							_that.showNoticeDate[index] = data
						}
					})
				}
			},
			//实时获取消息。填充数据
			getNowNews(data) {
				var _that = this
				if (data && data.conversationType === 1 && data.content.content) {
					if (data.content.extra !== undefined || data.content.extra !== '') {
						if (data.content.extra === '1') {
							_that.handleArrayData(_that.showJoinTeamDatas, data)
						}
						if (data.content.extra === '2') {
							_that.handleArrayData(_that.showJoinTeamDatas, data)
						}
						if (data.content.extra === '3') {
							_that.handleArrayData(_that.showRefuseInvitaDatas, data)
						}
						if (data.content.extra === '4') {
							_that.handleArrayData(_that.showInvitaJoinTeamDatas, data)
						}
						if (data.content.extra === '5') {
							_that.handleArrayData(_that.showAgreeInvitaDatas, data)
						}
						if (data.content.extra === '7') {
							_that.handleArrayData(_that.showComNumData, data)
						}
						if (data.content.extra === '6') {
							// _that.showWorkDatas = []
							if (_that.showNoticeDate.length === 0) {
								_that.showWorkDatas.push(data)
								_that.showNoticeDate.push(_that.showWorkDatas[_that.showWorkDatas.length-1])
							}
							if (_that.showNoticeDate.length > 0) {
								_that.showNoticeDate.forEach((item, index) => {
									if (item.targetId === data.targetId && item.content.extra === '6') {
										return item = data
									}
									if (item.targetId !== data.targetId && item.content.extra === '6') {
										return _that.showNoticeDate.push(data)
									}
								})

							}

						}
					}
				}
				console.log(_that.showApplyJoinComDatas)
				console.log(_that.showJoinTeamDatas)
				console.log(_that.showRefuseInvitaDatas)
				console.log(_that.showInvitaJoinTeamDatas)
				console.log(_that.showAgreeInvitaDatas)
				console.log(_that.showComNumData)
				console.log(_that.showWorkDatas)
				console.log(_that.showNoticeDate)


			},
			// 删除会话
			removeConversation(conversationType, targetId, callback) {
				var _that = this
				RongIMClient.getInstance().removeConversation(conversationType, targetId, {
					onSuccess: function (bool) {
						//  这里应该是要获取所有的会话
						callback
						// 删除会话成功
					},
					onError: function (error) {
						// error => 删除会话的错误码
					}
				});
			},
			//清除指定会话的未读消息数
			clearUnreadCount(conversationType, targetId, callback) {
				var _that = this
				var clearUnreadCount = RongIMClient.getInstance().clearUnreadCount
				clearUnreadCount(conversationType, targetId, {
					onSuccess: function () {
						callback //这里这样定义来使用相应的方法， 以及参数
						// 从消息里获取服务器端时间，以最近一条已读 message 为准
						var msg = new RongIMLib.SyncReadStatusMessage(_that.msg)
						var sendSyncStutus = RongIMClient.getInstance().sendMessage
						// sendSyncStutus(conversationType, targetId, msg, {
						// 	onSuccess: function () {
						// 		console.log('同步成功')
						// 	},
						// 	onError: function () {
						// 		console.log('err')
						// 	}
						// });
					},
					onError: function (errorCode) {
					}
				});
			},
			//置顶功能
			setDialogueTop(item, index) {
				item.rightMouseEvent = false
				//===发请求，重新排序，把当条设置为第一条，其他往下排
			},
			//删除本条
			deletDialogue(item, index) {
				var _that = this
				_that.showNoticeDate.splice(index, 1)
				_that.clearUnreadCount(item.conversationType, item.targetId)
				_that.removeConversation(item.conversationType, item.targetId)
				_that.getTotalUnreadCount()
				this.$refs.operaPanal[index].style.display = 'none'
				//===发请求，重新排序，删除本条保持状态，并且融云中不在包含删除的但没有新消息的通知类型
			},
			//免打扰==目前消息数设置为灰
			DontDisturb(itemc, index) {
				var conversationTypes = [RongIMLib.ConversationType.SYSTEM];
				RongIMClient.getInstance().clearConversations({
					onSuccess: function(){
						console.log('ok')
						// 清除会话成功
					},
					onError: function(error){
						// error => 清除会话错误码
					}
				}, conversationTypes);
				console.log(itemc)
				this.$http({
					method: 'POST',
					url: 'http://api-cn.ronghub.com/conversation/notification/get.json',
					data: {
						conversationType: itemc.conversationType,
						requestId: itemc.targetId,
						targetId: this.adminInfo.id,
						isMuted:0
					},
					headers: {
						'App-Key': 'Y1W2MeFwwwRxa0',
						'Nonce': 14314,
						'Timestamp': 1408710653491,
						'Signature': '30be0bbca9c9b2e27578701e9fda2358a814c88f',
						// "Content-Type": "multipart/form-data",
						"Content-Type": "application/x-www-form-urlencoded",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				}).then(res => {
					console.log(res)
				})
				// const turnLink = JSON.parse(itemc.content.content)
				// turnLink.rightMouseEvent = true
				this.$refs.numPrompt.forEach((item, index) => {
					item.style.background = '#F56C6C'
				})
				this.$refs.numPrompt[index].style.background = '#D8D8D8'
				this.$refs.operaPanal[index].style.display = 'none'
			},
			turnToPage: function (item, index) {
				console.log(item)
				const turnLink = JSON.parse(item.content.content)
				if (turnLink && turnLink.noticeType === 1) {
					this.$router.push({name: 'addTeam'})
				} else if (turnLink.noticeType === 2) {
					this.$router.push({name: 'applyJoinCom'})
				} else if (turnLink.noticeType === 3) {
					this.$router.push({name: 'refuseInvita'})
				} else if (turnLink.noticeType === 4) {
					this.$router.push({name: 'teamInvitation'})
				} else if (turnLink.noticeType === 5) {
					this.$router.push({name: 'agreeInvita'})
				} else if (turnLink.noticeType === 6) {
					this.$router.replace({name: 'workNotice', query: {a: turnLink.companyName, i: turnLink.companyId, t:Date.now()}})
				} else if (turnLink.noticeType === 7) {
					this.$router.push({name: 'comNumReportNew'})
				}
				// this.removeConversation(this.conversationType, "1567388046400031", this.clearUnreadCount(this.conversationType, "1567388046400031"))
				var _that = this
				//清空展示的消息数
				// _that.getHistory(item.conversationType, item.targetId, _that.timestrap, _that.count)
				_that.clearUnreadCount(item.conversationType, item.targetId)
				_that.getUnreadCount(item.conversationType, item.targetId, function (count) {
					item.unreadMessageCount = count
					_that.$set(_that.showNoticeDate[index], 'unreadMessageCount', count)
				})
				this.getTotalUnreadCount()
			},
			//获取签名
			getSign(param) {
				var appKey = this.appkey;
				var nonce = Math.random(); // 获取随机数。
				// var securityKey = "2019sbkjCarWebBEIJINGsbkj"
				var timeStamp = new Date().getTime();
				// 判断是否有参数
				if (param != null && param.length > 0) {
					param = "appKey=" + appKey + "&timeStamp=" + timeStamp + "&nonce=" + nonce+"&" + param
				} else {
					param = "appKey=" + appKey + "&timeStamp=" + timeStamp + "&nonce=" + nonce
				}
				// return "?appKey=" + appKey + "&timeStamp=" + timeStamp + "&sign=" + this.calculateSign(param);
				return "?appKey=" + appKey + "&timeStamp=" + timeStamp + "&nonce=" + nonce + "&sign=" ;
			},

			//鼠标放置在操作面板外，面板消失
			hideOperaPanal(e) {
				if (this.$refs.operaPanal && this.$refs.operaPanal.length > 0) {
					this.$refs.operaPanal.forEach((item, index) => {
						if (!item.contains(e.target)) {
							item.style.display = 'none'
						}
					})
				}
			},
			//鼠标右键展示面板
			operaPanalHandle(MouseEvent, item, index) {
				this.$refs.operaPanal.forEach((item, index) => {
					item.style.display = 'none'
				})
				// mousFlag.msgTypeRemark = true
				this.$refs.operaPanal[index].style.display = 'block'
				this.$refs.operaPanal[index].style.left = MouseEvent.clientX + 'px'
				this.$refs.operaPanal[index].style.top = MouseEvent.clientY + 'px'

			},
			//获取用户注册融云的token
			getToken() {
				this.$http({
					method: 'POST',
					url: 'http://api-cn.ronghub.com/user/getToken.json',
					data: {
						userId: 1231,
						name: '王鑫',
						portraitUri: ''
					},
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				}).then(res => {
					console.log(res)
				})
			},
			//接收不同类型的通知。  =========要考虑到不同公司的同类型工作通知
			addPromptInfo: function (prompt) {
				if (prompt.type === 0) {
					this.showWorkDatas.push(prompt)
				}
				if (prompt.type === 1) {
					this.showWorkDatas.push(prompt)
				}
				if (prompt.type === 2) {
					this.showWorkDatas.push(prompt)
				}
				if (prompt.type === 3) {
					this.showWorkDatas.push(prompt)
				}
				if (prompt.type === 4) {
					this.showWorkDatas.push(prompt)
				}
				if (prompt.type === 5) {
					this.showWorkDatas.push(prompt)
				}
				// console.log(prompt)
			},
			// initStart: function () {
			// 	var appkey = this.appkey
			// 	var token = this.token
			// 	if (!appkey || !token) {
			// 		alert('appkey 和 token 不能为空')
			// 	} else {
			// 		this.init({
			// 			appkey: appkey,
			// 			token: token,
			// 			navi: this.navi
			// 		}, this.addPromptInfo)
			// 	}
			// },
			//初始化没有团队展示的页面
			getUserInfoJoinApplyByEmployee() {
				this.$http({
					method: 'GET',
					url: this.ssoManager + '/v1/oa/userInfoJoinApply/getUserInfoJoinApplyByEmployee',
					params: {
						employeeId: this.adminInfo.employeeId
					}
				}).then(res => {
					if (res.data.code == 200) {
						// console.log(res.data)
						this.invitationList = res.data.data
						var str = ''
						res.data.data.forEach(item => {
							if (item.applyType == 1) {
								str += item.teamInfoName + '、'
							}
						})
						this.invitationTeamInfoName = str.slice(0, -1)
					}
				})
			}
		},
		// watch: {
		// 	'$route'() {
		// 		if (this.$route.path === 'workNotice') {
		// 			this.getInitConversation()
		// 			// this.$router.go(0)
		// 		}
		// 	}
		// },
			created() {
			this.getUserInfoJoinApplyByEmployee()
			// this.appkey = window.localStorage.getItem('rong_appId')
			this.appkey = '25wehl3u2gxnw'
			this.token = JSON.parse(window.sessionStorage.getItem('rongCloudToken'))
			this.showNoticeDate = []
			bus.$on('newsNoticeNum', msg => {
				this.newsNoticeNum = msg
			})
			// this.showNoticeDate = this.$store.state.model.showNoticeDate || []
			this.$nextTick(() => {
				this.init({
					appkey: this.appkey,
					token: this.token,
					navi: this.navi
				}, this.addPromptInfo)
			})
		},
		mounted() {
			if (window.addEventListener) {
				document.addEventListener('click', this.hideOperaPanal)
			} else if (window.attachEvent) {
				document.attachEvent('onclick', this.hideOperaPanal)
			}
			if (navigator.userAgent.indexOf("MSIE 9") != -1) {
				window.WEB_XHR_POLLING = true;
			}

		},

		beforeDestroy() {
			if (window.removeEventListener) {
				document.removeEventListener('click', this.hideOperaPanal)
			} else if (window.detachEvent) {
				document.detachEvent('onclick', this.hideOperaPanal)
			}
		},


	}
</script>
<style lang="scss" scoped>
	@import "../../../../stylesheets/main";


	.rong-input span {
		display: inline-block;
		width: 60px;
	}

	.rong-show-box {
		border: 1px solid lightgray;
		padding: 10px;
	}

	.rong-show-box h3, .rong-show-box p {
		margin: 5px 0;
	}

	.newMessage-container {
		.opera-container {
			position: fixed;
			z-index: 999;
			display: inline-block;
			overflow: hidden;
			background: #EDEDED;
			box-shadow: 1px 1px 4px 0 rgba(191, 194, 204, 0.7);
			border-radius: 3px;
			width: 153px;

			& > div {
				padding-left: 30px;
				width: 100%;
				height: 47px;
				line-height: 47px;
				font-size: 14px;
				color: #303133;

				&:hover {
					background: #D8D8D8;
				}
			}
		}

		.no_content {
			text-align: center;
			color: #909399;
			margin-top: 300px;
		}

		.newMessage-item {
			position: relative;
			@include box-sizing;
			padding: 10px 0 10px 15px;
			border-bottom: 1px solid #eee;
			font-size: 0;
			cursor: default;

			.newMessage-icon {
				display: inline-block;
				width: 44px;
				height: 44px;
				margin-right: 10px;
				vertical-align: top;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.newMessage-info {
				display: inline-block;
				width: 290px;
				height: 44px;
				@include box-sizing;
				padding-right: 17px;

				h1 {
					display: flex;
					display: -webkit-flex;
					justify-content: space-between;
					height: 50%;
					line-height: 21px;

					span:first-child {
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-weight: 600;
						font-size: 14px;
						color: #303133;
					}

					span:last-child {
						white-space:nowrap;
						font-size: 12px;
						color: #909399;
					}
				}

				p {
					display: flex;
					display: -webkit-flex;
					justify-content: space-between;
					height: 50%;
					line-height: 25px;

					span {
						height: 100%;

						&:first-child {
							width: 245px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							margin-right: 10px;
							font-size: 14px;
							color: #909399;
						}

						&.oneClass {
							border-radius: 50% !important;
							color: #fff !important;
						}

						&.threeClass {
							display: none !important;
						}

						&.twoClass {
							border-radius: 9px !important;
							color: #fff !important;
						}

						&:last-child {
							display: inline-block;
							background: #FF6565;
							-webkit-box-sizing: border-box;
							-moz-box-sizing: border-box;
							box-sizing: border-box;
							padding: 3px;
							margin-top: 5px;
							color: #fff;
							min-width: 17px;
							height: 17px;
							font-size: 12px;
							text-align: center;
							line-height: 10px;
							border-radius: 50%;
							background: #FF6565;
						}
					}
				}
			}
		}
	}
</style>
