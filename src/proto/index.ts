import * as protobuf from 'protobufjs';

interface ProtobufWebSocketConfig {
  wsUrl: string;
  protoFiles: string[];
  msgType: string;
  anyTypeUrl: string;
}

interface SendOptions {
  id?: string;
  refId?: string;
  token?: string;
  noticeType: number;
}

class ProtobufWebSocket {
  private socket: WebSocket | null = null;
  private root: protobuf.Root | null = null;
  private MsgType: protobuf.Type | null = null;
  private AnyType: protobuf.Type | null = null;
  private InnerType: protobuf.Type | null = null;
  private isRunning = false;
  private config: ProtobufWebSocketConfig;

  // 事件回调
  public onOpen: (() => void) | null = null;
  public onClose: (() => void) | null = null;
  public onError: ((error: Event) => void) | null = null;
  public onMessage: ((decodedMsg: any) => void) | null = null;
  public onInnerMessage: ((decodedData: any) => void) | null = null;

  constructor(config: ProtobufWebSocketConfig) {
    this.config = config;
  }

  // 初始化Protobuf
  async init(): Promise<void> {
    try {
      this.root = await protobuf.load(this.config.protoFiles);
      this.MsgType = this.root.lookupType(this.config.msgType);
      this.AnyType = this.root.lookupType('google.protobuf.Any');
      this.InnerType = this.root.lookupType(this.config.anyTypeUrl);
    } catch (err) {
      throw new Error(`Protobuf初始化失败: ${err}`);
    }
  }

  // 连接WebSocket
  connect(): void {
    if (!this.MsgType || !this.AnyType || !this.InnerType) {
      throw new Error('请先调用init()初始化');
    }

    this.socket = new WebSocket(this.config.wsUrl);
    this.socket.binaryType = 'arraybuffer';

    this.socket.onopen = () => {
      console.log('WebSocket连接已建立');
      this.onOpen?.();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      this.handleMessage(event.data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket连接已关闭');
      this.onClose?.();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket错误:', error);
      this.onError?.(error);
    };
  }

  // 处理接收到的消息
  private handleMessage(data: ArrayBuffer): void {
    if (!this.MsgType || !this.AnyType || !this.InnerType) return;

    try {
      const buffer = new Uint8Array(data);
      const decodedMsg = this.MsgType.decode(buffer);
      this.onMessage?.(decodedMsg);

      // 解码内层数据
      const anyData = decodedMsg.data;
      if (anyData.type_url === this.config.anyTypeUrl) {
        const decodedData = this.InnerType.decode(anyData.value);
        this.onInnerMessage?.(decodedData);
      }
    } catch (err) {
      console.error('消息解码失败:', err);
    }
  }

  // 发送消息
  send(innerData: any, options: SendOptions): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket未连接');
    }

    if (!this.MsgType || !this.AnyType || !this.InnerType) {
      throw new Error('Protobuf未初始化');
    }

    try {
      // 编码业务数据
      const innerBuffer = this.InnerType.encode(innerData).finish();

      // 封装Any类型
      const anyPayload = {
        type_url: this.config.anyTypeUrl,
        value: innerBuffer
      };

      // 构造外层消息
      const msgPayload = {
        id: options.id || Date.now().toString(),
        refId: options.refId || '',
        token: options.token || '',
        noticeType: options.noticeType,
        data: anyPayload
      };

      // 编码并发送
      const msgBuffer = this.MsgType.encode(msgPayload).finish();
      this.socket.send(msgBuffer);
    } catch (err) {
      console.error('消息编码失败:', err);
      throw new Error(`消息发送失败: ${err}`);
    }
  }

  // 批量发送
  startBatch(innerData: any, options: SendOptions, count: number): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.sendBatch(innerData, options, count);
  }

  private sendBatch(innerData: any, options: SendOptions, count: number): void {
    if (!this.isRunning) return;

    const batchSize = Math.min(count, 100); // 每次最多发送100条
    const promises = Array.from({ length: batchSize }, () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          try {
            this.send(innerData, options);
            resolve();
          } catch {
            resolve(); // 即使出错也继续
          }
        }, 0);
      });
    });

    Promise.all(promises).then(() => {
      const remaining = count - batchSize;
      if (remaining > 0) {
        setTimeout(() => this.sendBatch(innerData, options, remaining), 0);
      } else {
        this.isRunning = false;
      }
    });
  }

  // 停止批量发送
  stopBatch(): void {
    this.isRunning = false;
  }

  // 关闭连接
  disconnect(): void {
    this.stopBatch();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default ProtobufWebSocket;