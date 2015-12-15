module controls {
    interface IDatePickerProps extends React.Props<any> {
    }

    interface IDatePickerState {
    }

    class DatePicker extends React.Component<IDatePickerProps, IDatePickerState> {
        render() {
            return React.DOM.input({ type: "text" }, null);
        }

        componentDidMount() {
            this._init();
        }

        componentDidUpdate() {
            this._init();
        }

        componentWillReceiveProps(props) {
            this._destroy();
        }

        componentWillUnmount() {
            this._destroy();
        }


        private _destroy() {
            var element = ReactDOM.findDOMNode(this);
            $(element).datepicker('destroy');
        }

        private _init() {
            var element = ReactDOM.findDOMNode(this);
            $(element).datepicker(this.props);
        }
    };

    export var Picker = React.createElement(DatePicker, {});
}