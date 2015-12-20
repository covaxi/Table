module api {

    export interface ILineData {
        id: number,
        text: string,
        date: Date
    }

    export function getAll(startDate: Date, endDate: Date, callback: (ILineData) => any) {
        $.get('api/Values', { startDate: startDate, endDate: endDate }, callback);
    }
}