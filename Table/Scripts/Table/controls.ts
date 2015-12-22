module controls {

    // ============================================================================================================

    interface IDatePickerProps extends React.Props<any>, React.HTMLAttributes {
        id: string,
        dateValue? : Date,
        onDateChanged: (d: Date) => any,
    }


    class DatePickerClass extends React.Component<IDatePickerProps, {}> {

        constructor(props) { super(props); }

        id_selector = () => "#" + this.props.id;

        render() { return React.DOM.input($.extend({ type: "text" }, this.props), null); }

        componentDidMount() { this._init(); }

        componentDidUpdate() { this._init(); }

        componentWillReceiveProps(props) { this._destroy(); }

        componentWillUnmount() { this._destroy(); }

        private _destroy() { $(this.id_selector()).datepicker('destroy') }

        private _init() {
            var dp = $(this.id_selector())
            dp.datepicker({
                constrainInput: true, 
                onSelect: function(d) {
                    this.props.onDateChanged($(this.id_selector()).datepicker('getDate'));
                }.bind(this),
            });
            if (this.props.dateValue) {
                dp.datepicker('setDate', new Date(this.props.dateValue.toString()));
            }
        }
    };

    export function DatePicker(props: IDatePickerProps) {
        return React.createElement(DatePickerClass, $.extend(props, { key: props.id }), {});
    }

    // ============================================================================================================
    class ColorPickerClass extends React.Component<React.Props<any>,  {}>{
        render() { return React.DOM.input($.extend({ type: "color" }, this.props), null); }
    }

    export function ColorPicker(props:any) {
        return React.createElement(ColorPickerClass, props, {});
    }
    // ============================================================================================================
    class FontPickerClass extends React.Component<React.Props<any>, {}> implements React.HTMLAttributes {
        render() {
            var fonts = ["Arial", "Serif", "Sans-Serif", "Tahoma", "Verdana", "Lucida Sans Unicode"].map(f => React.DOM.option({ key: f, id: f }, f));
            return React.DOM.select(this.props, fonts);
        }
    }

    export function FontPicker(props:any) {
        return React.createElement(FontPickerClass, props, {});
    }

    // ============================================================================================================

    interface ILineProps extends React.Props<any> {
        id: number;
        text?: string;
        date?: Date;
        onTextChanged: (id: number, text: string) => void;
        onDateChanged: (id: number, date: Date) => void;
        onDelete: (id: number) => void;
        font: string;
        color: string;
    }

    class LineClass extends React.Component<ILineProps, {}> {
        constructor(props?: ILineProps, context?:any) {
            super(props, context);
        }

        private _handleTextChange(event) { this.props.onTextChanged(this.props.id, event.target.value); }
        private _handleDelete(id) { this.props.onDelete(this.props.id); }

        render() {
            return React.DOM.tr({ key: this.props.id, className: "row" }, 
                React.DOM.td({ key: "line" + this.props.id }, React.DOM.div({}, DatePicker({
                    id: "line" + this.props.id,
                    dateValue: this.props.date,
                    className: "form-control square-border",
                    onDateChanged: function (d) {
                        this.props.onDateChanged(this.props.id, d);
                    }.bind(this)
                }))),
                React.DOM.td({ key: "text" }, React.DOM.div({}, React.DOM.input({
                    type: "text",
                    value: this.props.text,
                    className: "form-control square-border",
                    style: { fontFamily: this.props.font, color: this.props.color },
                    onChange: function (event) {
                        this.props.onTextChanged(this.props.id, event.target.value);
                    }.bind(this)
                }))),
                React.DOM.td({ key: "del" }, React.DOM.button({ key: "del", className: "btn btn-default square-border", type: "button", onClick: this._handleDelete.bind(this) },
                    React.DOM.i({ className: "glyphicon glyphicon-remove" }, null)))
            );
        }
    }

    function Line(props) {
        return React.createElement(LineClass, props);
    }

    // ============================================================================================================

    interface ILinesState {
        startDate: Date;
        endDate: Date;
        color: string;
        font: string; 
        data: api.ILineData[];
        hash: { [key: number]: api.ILineData };
    }

    class LinesClass extends React.Component<React.Props<any>, ILinesState> {
        constructor(props) {
            super(props);
            this.state = {
                startDate: null,
                endDate: null,
                data: [], 
                hash: {},
                color: "#000000",
                font: "Arial",
            };
        }

        _handleTextChange(id: number, text: string) {
            this.state.hash[id].text = text;
            this.setState(this.state);
            api.modify(this.state.hash[id]);
        }

        _handleDateChange(id: number, date: Date) {
            this.state.hash[id].date = date;
            this.setState(this.state);
            api.modify(this.state.hash[id]);
        }

        _handleStartDateChange(id: number, date: Date) {
            this.state.startDate = date;
            this.setState(this.state);
        }

        _handleEndDateChange(id: number, date: Date) {
            this.state.endDate = date;
            this.setState(this.state);
        }

        _handleDelete(id: number) {
            this.state.data = this.state.data.filter(d => d.id != id);
            this.setState(this.state);
            api.del(id, res => {
                console.log(res);
            });
        }

        _handlePopulateClick() {
            api.getAll(this.state.startDate, this.state.endDate, (d) => {
                this.state.data = d;
                this.state.hash = {};
                d.forEach(d => this.state.hash[d.id] = d);
                this.setState(this.state);
            });
        }

        _handleColorChange(e) {
            this.state.color = e.target.value;
            this.setState(this.state);
        }

        _handleFontChange(e) {
            this.state.font = e.target.value;
            this.setState(this.state);
        }

        _handleAdd(e) {
            var i = Math.min.apply(null, this.state.data.map(d => d.id)) - 1;
            if (i >= 0)
                i = -1;
            
            var obj = { id: i };
            this.state.data.push(obj);
            this.state.hash[i] = obj;
            this.setState(this.state);
            api.add(i, (r: api.IApiResult[]) => {
                r.forEach(x => {
                    this.state.hash[x.oldId] = this.state.hash[x.newId];
                    this.state.data.filter(d => d.id == x.oldId)[0].id = x.newId;
                })
                this.setState(this.state);
            });
        }

        render() {
            var child = null;
            if (this.state.data.length > 0) {
                child = [React.DOM.table({ key: "tbl", className: "container w800" },
                    React.DOM.thead({ key: "th" }, React.DOM.tr({ key: "tr", className: "row" },
                        React.DOM.th({ key: "date", className: "col-md-3" }, "Date"),
                        React.DOM.th({ key: "text", className: "col-md-8" }, "Text"),
                        React.DOM.th({ key: "del", className: "col-md-1" }, "")
                        )),

                    React.DOM.tbody({ key: "tb" }, this.state.data.map(row => {
                        return Line({
                            id: row.id,
                            key: row.id,
                            text: row.text,
                            date: row.date,
                            font: this.state.font,
                            color: this.state.color,
                            onTextChanged: this._handleTextChange.bind(this),
                            onDateChanged: this._handleDateChange.bind(this),
                            onDelete: this._handleDelete.bind(this),
                        })
                    }))
                    ),
                    React.DOM.button({ key: "add", className: "btn btn-default", type: "button", onClick: this._handleAdd.bind(this) }, "Add another line")];
            }
            return React.DOM.form({ className: "form-horizontal" },
                React.DOM.div({ key: "main", className: "container jumbotron w800", role: "form" },
                    React.DOM.div({ key: "start", className: "form-group" },
                        React.DOM.div({ key: "sd", className: "col-md-3" }, DatePicker({ id: "sd", className: "form-control", placeholder: "Start Date", onDateChanged: this._handleStartDateChange.bind(this) })),
                        React.DOM.div({ key: "ed", className: "col-md-3" }, DatePicker({ id: "ed", className: "form-control", placeholder: "End Date", onDateChanged: this._handleEndDateChange.bind(this) })),
                        React.DOM.div({ key: "fn", className: "col-md-2" }, FontPicker({ key: "fn", className: "form-control", value: this.state.font, onChange: this._handleFontChange.bind(this) })),
                        React.DOM.div({ key: "cl", className: "col-md-2" }, ColorPicker({ key: "cl", className: "form-control", value: this.state.color, onChange: this._handleColorChange.bind(this) } )),
                        React.DOM.button({
                            key: "go",
                            type: "button",
                            className: "btn btn-default",
                            onClick: this._handlePopulateClick.bind(this),
                        }, "Populate"))
                    ),
                child
            );
        }
    }

    export function Lines(props) {
        return React.createElement(LinesClass, props, {});
    }
}