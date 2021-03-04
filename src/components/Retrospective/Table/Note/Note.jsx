import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiLike, BiDislike } from 'react-icons/bi';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

import theme from '../../../../style/Theme.module.scss';
import styles from './Note.module.scss';
import DateService from '../../../../services/DateService';

const propTypes = {
    className: PropTypes.string,

    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    value: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    theme: PropTypes.string.isRequired,
    created_at: PropTypes.instanceOf(Date),
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

class Note extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            value: this.props.value,
            likes: this.props.likes,
            created_at: this.props.created_at,
            isInEditMode: false,
        };

        this.valueInputRef = React.createRef();

        this.switchMode = this.switchMode.bind(this);

        this.edit = this.edit.bind(this);

        this.editValue = this.editValue.bind(this);
        this.addLike = this.addLike.bind(this);
        this.removeLike = this.removeLike.bind(this);

        this.delete = this.delete.bind(this);

        this.renderEditView = this.renderEditView.bind(this);
        this.renderStaticView = this.renderStaticView.bind(this);
    }

    switchMode() {
        this.setState({
            isInEditMode: !this.state.isInEditMode,
        });
    }

    edit({ value, likes }) {
        this.props.onEdit(this.state.id, {
            value: typeof value !== 'undefined' ? value : this.state.value,
            likes: typeof likes !== 'undefined' ? likes : this.state.likes,
        });
    }

    editValue() {
        const value = this.valueInputRef.current.value;

        if(value) {
            this.switchMode();

            if (value !== this.state.value) {
                this.edit({
                    value,
                    isNew: null,
                });
            }
        }
    }

    addLike() {
        this.edit({
            likes: this.state.likes + 1,
        });
    }

    removeLike() {
        this.edit({
            likes: this.state.likes -1,
        });
    }

    delete() {
        this.props.onDelete(this.state.id)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            id: nextProps.id,
            value: nextProps.value,
            likes: nextProps.likes,
        });
    }

    renderEditView() {
        return <>
            <input
                className={styles['container__input']}
                type="text"
                defaultValue={this.state.value}
                ref={this.valueInputRef}
            />
            <div className={styles['container__controllers']}>
                <AiOutlineCheck
                    value={{ color: '#868D97', size: '50px' }}
                    onClick={this.editValue}
                    className={styles['container__btn']}/>
                <AiOutlineClose
                    value={{ color: '#868D97', size: '50px' }}
                    onClick={this.switchMode}
                    className={styles['container__btn']}/>
            </div>
        </>;
    }

    renderStaticView() {
        const date = DateService.getReadableFormat('en', this.state.created_at);
        
        return <>
            <div className={styles['container__main']} onClick={this.switchMode}>
                {this.state.value}
            </div>
            <div className={styles['container__bottom']}>
                <div className={styles['container__likes']}>
                    <div className={styles['container__likes-count']}>
                        {this.state.likes}
                    </div>
                    <BiDislike
                        className={styles['container__btn']}
                        onClick={this.removeLike}/>
                    <BiLike
                        className={styles['container__btn']}
                        onClick={this.addLike}/>
                </div>
                <RiDeleteBin6Line
                    className={styles['container__btn']}
                    onClick={this.delete} />
            </div>
            <div className={styles['container__details']}>
                {`${date.timeCode}, ${date.day}, ${date.date} ${date.month}, ${date.year}`}
            </div>
        </>;
    }

    render() {
        return <div 
            className={classNames(this.props.className, styles['container'], theme[`${this.props.theme}-bd-hover`])}>
            {this.state.isInEditMode ?
                this.renderEditView() : this.renderStaticView()}
        </div>;
    }
};

Note.propTypes = propTypes;

export default Note;
