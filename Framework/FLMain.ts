/**
 * zengbinsi
 * 2017-12-01
 */



export class fl {
    private static _gameStartTime: number = Math.floor(Date.now() / 1000);
    /** 游戏开始时间 */
    public static get gameStartTime() {
        return fl._gameStartTime;
    }
    /** 游戏运行时长 */
    public static getRunTime() {
        return Math.floor(Date.now() / 1000) - fl._gameStartTime;
    }

    /** 框架版本号 */
    public static get version(): string {
        return '2.1.9.6';
    }
    
    /** 是否开启框架调试 */
    public static get isDebug(): boolean {
        return false;
    }

    private static _audioClips: cc.AudioClip[] = [];
    /** 音频剪辑对象 */
    public static get audioClips(): cc.AudioClip[] {
        return fl._audioClips;
    }
    public static set audioClips(audioClips: cc.AudioClip[]) {
        fl._audioClips = audioClips;
    }

    /**
     * 是否是空值（null|undefined）
     * @param value 要判空的值
     */
    public static isEmpty(value: any): boolean {
        return (value === undefined || value === null);
    }

    /**
     * 是否是空值（null|undefined|空字符串）
     * @param value 要判空的值
     */
    public static isEmptyString(value: any): boolean {
        return (fl.isEmpty(value) || value === '');
    };

    /**
     * 如果对象为null或者undefined就返回第二个参数的值
     * @param value 要判空的值
     * @param defaultValue 默认返回值
     */
    public static ifnull(value: any, defaultValue: any): any {
        if (value === undefined || value === null) {
            return defaultValue;
        } else {
            return value;
        }
    }
}

try {(window as any).fl = (window as any).fl || fl;} catch(ex) {}

/*=========监听游戏事件========='*/

// 游戏显示，使用这个事件我们可以监听游戏在Native平台上从后台被唤醒的事件，从而对游戏进行一些必要的处理。
if (cc.game && cc.game.on) {
    cc.game.on(cc.game.EVENT_SHOW, (data: any)=>{
        if (cc.systemEvent && cc.systemEvent.emit) {
            cc.systemEvent.emit(cc.game.EVENT_SHOW, data);
        }
    });
}


// 当游戏被挂起到后台时，Creator会分发游戏隐藏事件
if (cc.game && cc.game.on) {
    cc.game.on(cc.game.EVENT_HIDE, (data: any)=>{
        if (cc.systemEvent && cc.systemEvent.emit) {
            cc.systemEvent.emit(cc.game.EVENT_HIDE, data);
        }
    });
}


// 游戏初始化完成
if (cc.game && cc.game.on) {
    cc.game.on(cc.game.EVENT_ENGINE_INITED, (data: any)=>{
        if (cc.systemEvent && cc.systemEvent.emit) {
            cc.systemEvent.emit(cc.game.EVENT_ENGINE_INITED, data);
        }
    });
}


// 如果需要在渲染初始化完成时实现逻辑，可以通过EVENT_RENDERER_INITED事件来实现。
if (cc.game && cc.game.on) {
    cc.game.on(cc.game.EVENT_RENDERER_INITED, (data: any)=>{
        if (cc.systemEvent && cc.systemEvent.emit) {
            cc.systemEvent.emit(cc.game.EVENT_RENDERER_INITED, data);
        }
    });
}