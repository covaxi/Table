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

    export function getAll(startDate: Date, endDate: Date, callback: (ILineData) => any) {
        $.ajax({
            type: "GET",
            url: '/api/Values',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { startDate: startDate, endDate: endDate },
            success: callback,
        });
    }

    export function del(id: number, callback: (IApiResult) => any) {
        $.ajax({
            url: '/api/Values',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify([{ id: id, actionType: ActionType.Delete }]),
            success: callback,
        });
    }

    export function add(id: number, callback: (IApiResult) => any) {
        $.ajax({
            url: '/api/Values',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify([{ id: id, actionType: ActionType.Add }]),
            success: callback,
        });
    }

    export function modify(data: ILineData) {
        $.ajax({
            url: '/api/Values',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify([{ id: data.id, actionType: ActionType.Modify, text: data.text, date: data.date }]),
            success: function() {},
        });
    }
}