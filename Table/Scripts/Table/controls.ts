module controls {

    // ============================================================================================================

    interface IDatePickerProps extends React.Props<any> {
        id: string,
        value? : Date,
        onDateChanged: (d: Date) => any
    }


    class DatePickerClass extends React.Component<IDatePickerProps, {}> {

        constructor(props) { super(props); }

        id_selector = () => "#" + this.props.id;

        render() { return React.DOM.input({ type: "text", id: this.props.id }, null); }

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
            if (this.props.value) {
                dp.datepicker('setDate', new Date(this.props.value.toString()));
            }
        }
    };

    export function DatePicker(props: IDatePickerProps) {
        return React.createElement(DatePickerClass, $.extend(props, { key: props.id }), {});
    }

    // ============================================================================================================

    interface ILineProps extends React.Props<any> {
        id: number;
        text?: string;
        date?: Date;
        onTextChanged: (id: number, text: string) => void
        onDateChanged: (id:number, date: Date) => void
    }

    class LineClass extends React.Component<ILineProps, {}> {
        constructor(props?: ILineProps, context?:any) {
            super(props, context);
        }

        private _handleTextChange(event) { this.props.onTextChanged(this.props.id, event.target.value); }

        render() {
            return React.DOM.tr({ key: this.props.id }, [
                React.DOM.td({ key: "date" }, DatePicker({
                    id: "line" + this.props.id,
                    value: this.props.date,
                    onDateChanged: function (d) {
                        this.props.onDateChanged(this.props.id, d);
                    }.bind(this)
                })),
                React.DOM.td({ key: "desc" }, React.DOM.input({
                    key: "text",
                    type: "text",
                    value: this.props.text,
                    onChange: function (event) {
                        this.props.onTextChanged(this.props.id, event.target.value);
                    }.bind(this),
                }, null)),
            ]);
        }
    }

    function Line(props) {
        return React.createElement(LineClass, props);
    }

    // ============================================================================================================

    interface ILinesProps extends React.Props<any> {
    }



    interface ILinesState {
        startDate: Date;
        endDate: Date;
        color: number;
        font: number; 
        data: api.ILineData[];
        hash: { [key: number]: api.ILineData };
    }

    class LinesClass extends React.Component<ILinesProps, ILinesState> {
        constructor(props) {
            super(props);
            this.state = {
                startDate: null,
                endDate: null,
                color: 0,
                font: 0,
                data: [], 
                hash: {},
            };
        }

        _handleTextChange(id: number, text: string) {
            this.state.hash[id].text = text;
            this.setState(this.state);
        }

        _handleDateChange(id: number, date: Date) {
            this.state.hash[id].date = date;
            this.setState(this.state);
        }

        _handleClick() {
            api.getAll(this.state.startDate, this.state.endDate, (d) => {
                this.state.data = d;
                this.state.hash = {};
                d.forEach(d => this.state.hash[d.id] = d);
                this.setState(this.state);
            });
        }

        render() {
            return React.DOM.div({ key: "div" }, [
                DatePicker({ id: "dpStart", onDateChanged: this._handleDateChange.bind(this) }),
                DatePicker({ id: "dpEnd", onDateChanged: this._handleDateChange.bind(this) }),
                React.DOM.span({ key: "span" }, "color" ),
                React.DOM.span({ key: "span2" }, "text" ),
                React.DOM.button({
                    key: "go",
                    onClick: this._handleClick.bind(this),
                }),
                React.DOM.table({ key: "table" }, React.DOM.tbody({ key: "tbody" },
                    this.state.data.map(row => {
                        console.log(row.date);
                        return Line({
                            id: row.id,
                            key: row.id,
                            text: row.text,
                            date: row.date,
                            onTextChanged: this._handleTextChange.bind(this),
                            onDateChanged: this._handleDateChange.bind(this),
                        });
                    })
                ))
            ]);
        }
    }

    export function Lines(props) {
        return React.createElement(LinesClass, props, {});
    }
}