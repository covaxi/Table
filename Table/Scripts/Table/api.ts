module api {

    export enum ActionType {
        Add,
        Delete,
        Modify
    }

    export interface ILineData {
        id: number;
        text?: string;
        date?: Date;
    }

    export interface IApiResult {
        oldId: number;
        newId: number;
    }

    var callback;
    var timer;

    export function registerCallback(cb) {
        callback = cb;
        timer = window.setInterval(timerHandler, 1000);
    }

    function restartTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(timerHandler, 1000);
    }

    interface IApiRequest {
        id: number;
        action: ActionType;
        text?: string;
        date?: Date
    }

    var queue = [];

    export function getAll(startDate: Date, endDate: Date, cb: (ILineData) => any) {
        timerHandler();
        $.get('/api/Values', {
            start: startDate ? startDate.toJSON() : null,
            end: endDate ? endDate.toJSON() : null
        }, cb);
    }

    function timerHandler() {
        if (queue.length) {
            $.ajax({
                url: '/api/Values',
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(queue),
                success: callback,
            });
        }
        queue = [];
    }

    export function del(id: number) {
        queue.push({ id: id, actionType: ActionType.Delete });
        restartTimer();
    }

    export function add(id: number) {
        queue.push({ id: id, actionType: ActionType.Add });
        restartTimer();
    }

    export function modify(data: ILineData) {
        queue.push({ id: data.id, actionType: ActionType.Modify, text: data.text, date: data.date });
        restartTimer();
    }
}