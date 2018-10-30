# detect
Detection of violation system 
监控系统

- 项目模块
  项目分为三个部分：
  - 用户模块(user)
  - 违规模块(warn)
  - 直播模块(live)
- 后台部分(detect_project)
  语言：Python
  框架：Django
  
  模块划分：
  
                  	----------   warn
          	        |
  	apps  ----------|--------    user
                  	|
                   	---------    live
  
  各模块由url、view、model组成：
  - view.py：后端逻辑实现
  - urls.py : 与view对应的url
  - model.py:  数据表设计



- 其他部分（utils目录下）
  - 人体检测
    - utils/detection
  - 身份证检测
    两种方式
    - utils/monitor/ID_detect/ID_cloud （调用API）
    - utils/monitor/ID_detect/presentation_OCR （自己实现）
  - 安检人员检测（安全带）
    - utils/monitor/safety_belt
  - 安全帽检测
    - utils/monitor/safety_helmet
  - 吸烟检测
    - utils/monitor/smoke
  - 人脸检测
    - utils/face_verify_group/face_verify_group.py
  - 作业票
    - utils/job_slip
    



微信小程序(detect)

- 未签到信息： pages/warn/absence   
- 违规消息：     pages/warn/index
- 添加违规消息： pages/warn/send/create
- 身份证扫描： pages/scan/id
- 登录、注册：pages/user
  

使用步骤

- 登录/注册：
  - 用户 ---> 个人中心 ---> 登录 / 注册 / 退出登录
- 扫描身份证：
  - 扫描 ---> 身份证录入 --->  拍摄身份证
- 未签到人员：
  - 违规 ---> 未签到人员名单
- 违规警告：
  - 违规 ---> 违规警告
    - 上方可选择“未处理”、“已处理”查看违规信息
- 添加违规消息：
  - 违规 ---> 违规警告 ---> '+'



web前端部分

- 框架：AmazeUI
- template:
  - 未签到人员：admin-absence.html
  - 违规消息： admin-warninfo.html
  - 上传人脸照片：admin-uploadface.html
  - 直播： html5-dash-hls-rtmp-master/Play-RTMP-HLS-Stream/play6.html
    - 引用github：https://github.com/Tinywan/html5-dash-hls-rtmp
  - 登录： login.html






