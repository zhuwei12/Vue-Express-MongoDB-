# Vue-Express-MongoDB
第一次独立开发有一个完整功能的结伴交友旅行网站，前后端完全分离，响应式。

主要功能点：

注册登录

发布文章

评论

回复

私信

收藏

消息提醒

使用element-ui省了很多事，还有很多不足，后期慢慢改吧~

- [ ] **后期需优化的点**
    
    - [ ] 页面重构
    
    - [ ] 发布页表单验证
    
    - [x] <del>图片懒加载</del>
    
    - [ ] 上传完图片之后用户删除，服务器也要同步删除
    
    - [ ] 微信登录
    
    - [ ] 如果session登录状态失效，需验证登录状态并提示用户
    
    - [ ] 文章的出发时间已过期设置可查看但不可再评论
    
    - [x] <del>点击选择目的地之后会传参给后端调用接口，清空之后再次选择一个目的地会使blur事件和select事件同时触发调用两次接口，也就是说会先执行参数为空的请求，返回全部文章信息，然后参数为目的地，返回目的地信息。这样性能不好，需要优化。优化方法：使用@input方法调用一个函数，实时判断参数值是否为空，当监听到输入为空的时候就调用方法传参。</del>
    
    - [x] <del>首页滚动分页加载，每次取6条数据，滚动继续取6条，直到取完。加快访问速度。</del>
    
    - [ ] 在个人中心点击头像可更换用户头像
    
    - [ ] 点击用户头像可跳转至他的个人中心页（查看个人主页功能）
    
    - [ ] 如果是自己发表的评论显示可删除，如果是自己发布的文章可以删除底下的所有评论
    
    - [ ] 自己是否可以回复自己？若可以，什么逻辑？
    
    - [ ] 移动到用户头像出悬浮显示大图
    
    - [ ] 评论列底下设置成fix，滑动的时候只有评论滑动，留言的输入框不动
    
    - [ ] 删除私信功能
    
    - [ ] 私信页的时间格式
    
    - [x] <del>私信页显示最新的一条消息而不是对方发的最后一条消息</del>
    
    - [ ] 首页消息提示应该按时间排列（数据库设计的时候有问题，需要在提醒的列加上时间），且出现新消息会有提醒红点以及新消息显示背景色（这点需要后台将用户所点所看存起来，每次与后台相比较）
    
    - [ ] 个人首页的查询应该用到多表连接查询，根据用户表中的articleid找到article表中的article并返回这个文章的信息。（现在点击收藏文章的时候把评论也写死进去了，导致返回我的收藏的时候文章评论不会动态发生改变）也可以发布评论的时候把number值加1，不对不可以，如果其他用户评论呢？就不会自增，所以还是多表查询一次
