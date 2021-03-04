import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import theme from '../../../../style/Theme.module.scss';
import styles from './NoteCreateForm.module.scss';

const propTypes = {
    className: PropTypes.string,

    theme: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

class NoteCreateForm extends React.Component {
    constructor(props) {
        super(props);

        this.valueInputRef = React.createRef();

        this.submit = this.submit.bind(this);
    }

    submit() {
        const value = this.valueInputRef.current.value;

        if(value) {
            this.props.onSubmit({
                value,
            });
            this.props.onCancel();
        }
    }

    componentDidMount() {
        this.valueInputRef.current.select();
    }

    render() {
        return <div className={classNames(this.props.className, styles['container'])}>
            <input 
                className={classNames(styles['container__input'], theme[`${this.props.theme}-bd-focus`])}
                type="text"
                ref={this.valueInputRef}
            />
            <div className={styles['container__controllers']}>
                <button
                    className={classNames(styles['container__btn'], theme[`${this.props.theme}-bg`])}
                    type="button"
                    onClick={this.submit}>Add note</button>
                <button
                    className={classNames(styles['container__btn'], theme[`${this.props.theme}-bg`])}
                    type="button"
                    onClick={this.props.onCancel}>Cancel</button>
            </div>
        </div>;
    }
};

NoteCreateForm.propTypes = propTypes;

export default NoteCreateForm;