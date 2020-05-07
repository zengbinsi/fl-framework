/**
 * zengbinsi
 * 2018-09-20
 */

// 优化getChildByName的性能
cc.Node.__flGetChildByName = cc.Node.getChildByName;
cc.Node.getChildByName = function(name) {
    this.__childCaches = this.__childCaches || {};
    if (this.__childCaches[name]) {
        return this.__childCaches[name];
    }

    this.__childCaches[name] = this.__flGetChildByName(name);
    return this.__childCaches[name];
};


/** 日志级别 */
let EFLLogLevel = cc.Enum({
    // 禁用
    DISABLE: 0,
    // 错误
    ERROR: 1,
    // 警告
    WARN: 2,
    // 框架普通日志输出
    FRAMEWORK: 3,
    // 输出信息
    INFO: 4,
    // 普通
    LOG: 5,
    // 所有日志
    ALL: 6,
});


/** 是否启用全局单点 */
let isEnabledGlobalTouch = true;


let FLBehavior = cc.Class({
    name: 'FLBehavior',
    extends: cc.Component,
    
    properties: {
        logLevel: {
            default: EFLLogLevel.DISABLE,
            type: EFLLogLevel,
            tooltip: `日志级别:
            
            当日志级别低于某个级别时，该级别日志将被隐藏。

            【级别从低到高顺序如下】

            DISABLE: 禁用所有日志,
            ERROR: 输出错误,
            WARN: 输出警告和错误,
            FRAMEWORK: 输出框架日志,
            INFO: 输出调试信息,
            LOG: 输出普通日志,
            ALL: 输出所有级别日志
            `,
            visible() {
                return this.isOpenLog;
            }
        },
        isOpenLog: {
            default: false,
            tooltip: '是否开启调试日志输出',
        },
        allEvents: {
            default: {},
            visible: false
        }
    },

    // 节点事件
    // allEvents: {},

    // =======================================
    // cc.Component 生命周期
    // =======================================
    onEnable: function() {
        let events;
        for (const key in this.allEvents) {
            events = this.allEvents[key];
            events && events.map(eventInfo=>{
                if (eventInfo.isRegisted) {return;}
                cc.systemEvent.on(eventInfo.eventName, eventInfo.callback, eventInfo.target);
                eventInfo.isRegisted = !0;
            });
        }

        this.onEnabled && this.onEnabled();
    },

    onDisable: function() {
        let events;
        for (const key in this.allEvents) {
            events = this.allEvents[key];
            events && events.map(eventInfo=>{
                if (!eventInfo.isRegisted || eventInfo.isResident) {return;}
                cc.systemEvent.off(eventInfo.eventName, eventInfo.callback, eventInfo.target);
                eventInfo.isRegisted = !1;
            });
        }

        this.onDisabled && this.onDisabled();
    },

    onLoad: function() {
        this.onBindEvents && this.onBindEvents();
        this.onLoadConfig && this.onLoadConfig();
        this.onLoaded && this.onLoaded();
    },

    start: function() {
        this.onStart && this.onStart();
    },

    update(dt) {
        if (this.onUpdate) {
            this.update = this.onUpdate;
            this.onUpdate(dt);
        } else {
            this.update = (dt)=>{};
        }
    },

    lateUpdate: function(dt) {
        if (this.onLateUpdate) {
            this.lateUpdate = this.onLateUpdate;
            this.onLateUpdate(dt);
        } else {
            this.lateUpdate = (dt)=>{};
        }
    },

    // onEnable: function() {
        
    // },

    // onDisable: function() {
        
    // },

    onDestroy: function() {
        if (!0) {
            // 注销驻留的函数
            let events;
            for (const key in this.allEvents) {
                events = this.allEvents[key];
                events && events.map(eventInfo=>{
                    if (!eventInfo.isRegisted) {return;}
                    cc.systemEvent.off(eventInfo.eventName, eventInfo.callback, eventInfo.target);
                    eventInfo.isRegisted = !1;
                });
            }
        }

        this.onRemoveEvents && this.onRemoveEvents();
        this.onDestroyed && this.onDestroyed();
    },


    // =======================================
    // 模板方法
    // =======================================
    onBindEvents: function() {
        // toucu事件
        if (this.onTouchStart || this.onTouchEnded) {
            this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this);
        }
        if (this.onTouchMoved) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        }
        this.onAddEvents && this.onAddEvents();
    },
    /** 注册事件 */
    // onAddEvents: function() {

    // },

    /** 取消事件注册 */
    // onRemoveEvents: function() {

    // },

    /** 初始化配置 */
    // onLoadConfig: function() {

    // },

    /** onLoad结束的回调 */
    // onLoaded: function() {

    // },

    /** 在组件第一次update前调用，做一些初始化逻辑 */
    // onStart: function() {

    // },

    /**
     * 场景动画更新前回调
     * @param dt 游戏帧时长
     */
    // onUpdate: function(dt) {

    // },

    /** 场景动画更新后回调 */
    // onLateUpdate: function(dt) {

    // },

    /** 销毁组件 */
    // onDestroyed: function() {

    // },


    // =======================================
    // 功能方法
    // =======================================

    _onTouchStart: function(event) {
        if (isEnabledGlobalTouch && this._getTouchId(event) > 0) {return;}
        this.onTouchStart && this.onTouchStart(event);
    },
    _onTouchMoved: function(event) {
        if (isEnabledGlobalTouch && this._getTouchId(event) > 0) {return;}
        this.onTouchMoved && this.onTouchMoved(event);
    },
    _onTouchEnded: function(event) {
        if (isEnabledGlobalTouch && this._getTouchId(event) > 0) {return;}
        this.onTouchEnded && this.onTouchEnded(event);
    },
    _onTouchCancelled: function(event) {
        if (isEnabledGlobalTouch && this._getTouchId(event) > 0) {return;}
        
        if (this.onTouchCancelled) {
            this.onTouchCancelled(event);
        } else if (this.onTouchEnded) {
            this.onTouchEnded(event);
        }
    },

    _getTouchId: function(event) {
        const touchs = event.getTouches();
        return touchs.indexOf(event.touch);
    },



    // =======================================
    // 功能方法
    // =======================================

    /** 注册事件 */
    registerEvent: function(eventName, callback, target, isResident) {
        isResident = !!isResident;
        this.allEvents[eventName] = this.allEvents[eventName] || [];
        let isRegisted = !1;
        // 如果节点已启用，直接注册事件
        if (this.enabled) {
            cc.systemEvent.on(eventName, callback, target);
            isRegisted = !0;
        }
        this.allEvents[eventName].push({eventName, callback, target, isResident, isRegisted});
    },

    /**
     * 设置是否启用单点
     * @param {*} isEnabled 
     */
    setEnableTouchOneByOne(isEnabled) {
        isEnabledGlobalTouch = !!isEnabled;
    },
    

    /**
     * 判断变量是否为空，如果是返回默认值，否则返回原值
     * @param value 变量
     * @param defaultValue 默认值
     */
    ifnull: function(value, defaultValue) {
        if (value === undefined || value === null) {
            return defaultValue;
        }

        return value;
    },

    /**
     * 判断变量是否为空
     * @param value 变量
     */
    isEmpty: function(value) {
        return value === undefined || value === null;
    },

    /**
     * 判断字符串是否为空或者空字符串
     * @param value 字符串
     */
    isEmptyString: function(value) {
        return value === undefined || value === null || value === '';
    },


    // =======================================
    // 调试方法
    // =======================================
    /**
     * 调试日志输出
     * @param logMethod 日志输出
     * @param args 参数列表
     */
    debugLog: function(logMethod, ...args) {
        if (!logMethod || logMethod === 'info') {
            logMethod = 'log';
        }
        if (!this.isOpenLog) {
            return;
        }
        try {
            throw new Error();
        } catch (e) {
            const info = e.stack.replace(/Error\n/).split(/\n/)[2];
            const infos = info.split(' ');
            const callInfo = infos[5];
            const fileInfo = (infos[6] || infos[5]).split('assets')[1];

            if (cc[logMethod]) {
                // cc[logMethod](`【(${fileInfo}】-> on ${callInfo}:`, ...args);
                cc[logMethod](`【(${fileInfo}】:`, ...args);
            } else {
                // cc.log(`【(${fileInfo}】 -> on ${callInfo}:`, ...args);
                cc.log(`【(${fileInfo}】:`, ...args);
            }
        }
    },

    /**
     * 输出一个错误日志
     * @param args 日志参数
     */
    error(...args) {
        if (this.logLevel < EFLLogLevel.ERROR) {
            return;
        }

        this.debugLog('error', ...args);
    },

    /**
     * 输出一个警告日志
     * @param args 日志参数
     */
    warn(...args) {
        if (this.logLevel < EFLLogLevel.WARN) {
            return;
        }

        this.debugLog('warn', ...args);
    },

    /**
     * 输出一个框架日志，框架专用
     * @param args 日志参数
     */
    frameLog(...args) {
        if (this.logLevel < EFLLogLevel.FRAMEWORK) {
            return;
        }

        this.debugLog('info', ...args);
    },

    /**
     * 输出调试信息，产品开发专用
     * @param args 日志参数
     */
    info(...args) {
        if (this.logLevel < EFLLogLevel.INFO) {
            return;
        }

        this.debugLog('info', ...args);
    },

    /**
     * 输出日志
     * @param args 日志参数
     */
    log(...args) {
        if (this.logLevel < EFLLogLevel.LOG) {
            return;
        }

        this.debugLog('log', ...args);
    },


    /**
     * 打印当前函数的调用堆栈
     */
    logCallStack() {
        if (!this.isOpenLog) {
            return;
        }

        try {
            throw new Error();
        } catch (e) {
            let infos = e.stack.replace(/Error\n/).split(/\n/);
            let logContent = `Method call on:\n`;

            for (let i = 1; i < infos.length; ++i) {
                logContent += `    ${infos[i]}\n`;
            }

            cc.log(logContent);
        }
    },
});

window.FLBehavior = FLBehavior;
// module.exports = FLBehavior;








/** 层级 */
let EZIndex = cc.Enum({
    // 默认面板
    NORMAL: 100,
    // 挂件
    WIDGET: 5000,
    // 一级弹窗
    WINDOW: 10000,
    // 二级弹窗
    DIALOG: 15000,
    // 顶层提示
    TIP: cc.macro.MAX_ZINDEX - 1000,
    // 超顶层UI
    MAX: cc.macro.MAX_ZINDEX - 100
});

let FLUIPanel = cc.Class({
    name: 'FLUIPanel',
    extends: FLBehavior,
    
    properties: {
        zIndex: {
            default: EZIndex.NORMAL,
            type: EZIndex,
            tooltip: `层级管理
            NORMAL：默认面板
            WIDGET：挂件
            WINDOW：一级弹窗
            DIALOG：二级弹窗
            TIP：顶层提示
            MAX：超顶层UI`
        },
        parentUIName: {
            default: '',
            tooltip: '父节点UI名称，默认添加到Canvas节点上'
        }
    }
});

window.FLUIPanel = FLUIPanel;