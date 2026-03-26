// lib/event-emitter.ts - Shared event system
import { EventEmitter } from "events";

export interface GroupUpdate {
  groupId: string;
  status: string;
  timestamp: Date;
}

class GroupEventEmitter extends EventEmitter {
  private static instance: GroupEventEmitter;

  static getInstance(): GroupEventEmitter {
    if (!GroupEventEmitter.instance) {
      GroupEventEmitter.instance = new GroupEventEmitter();
    }
    return GroupEventEmitter.instance;
  }

  emitGroupUpdate(update: GroupUpdate) {
    this.emit("group_update", update);
  }
}

export const groupEvents = GroupEventEmitter.getInstance();
