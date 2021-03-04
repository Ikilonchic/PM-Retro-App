import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Table.module.scss';

import Note from './Note/Note';
import NoteCreateForm from './NoteCreateForm/NoteCreateForm';

const propTypes = {
    className: PropTypes.string,

    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    title: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired,
    comments: PropTypes.shape({
        value: PropTypes.array,
        lastId: PropTypes.number,
    }),
};

class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            title: this.props.title,
            theme: this.props.theme,
            comments: this.props.comments || {
                value: [],
                lastId: 0,
            },
            isInAddMode: false,
        };

        this.switchMode = this.switchMode.bind(this);

        this.addNote = this.addNote.bind(this);
        this.editNote = this.editNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);

        this.renderNoteList = this.renderNoteList.bind(this);
    }

    switchMode() {
        this.setState({
            isInAddMode: !this.state.isInAddMode,
        });
    }

    addNote({ value }) {
        const lastId = this.state.comments.lastId || 0;

        this.setState({
            comments: {
                value: [...this.state.comments.value, {
                    id: lastId,
                    value,
                    likes: 0,
                    created_at: new Date(),
                }],
                lastId: lastId + 1,
            },
        });
    }

    editNote(id, { value, likes }) {
        const editedCommentIndex = this.state.comments.value.findIndex(elem => elem.id === id);

        if (editedCommentIndex !== -1) {
            this.setState({
                comments: {
                    value: this.state.comments.value.map((elem, index) => {
                        return index !== editedCommentIndex ? elem : {
                            ...elem,
                            value,
                            likes,
                        };
                    }),
                    lastId: this.state.comments.lastId,
                },
            });
        }
    }

    deleteNote(id) {
        this.setState({
            comments: {
                value: this.state.comments.value.filter(elem => elem.id !== id),
            }
        });
    }

    renderNoteList() {
        return <div className={styles['container__list']}>
            {this.state.comments.value.sort((a, b) => b.likes - a.likes).map(elem => {
                return <Note
                            className={classNames(styles['container__note'])}
                            key={elem.id} {...elem}
                            theme={this.state.theme}
                            onEdit={this.editNote}
                            onDelete={this.deleteNote}/>;
            })}
        </div>
    }

    render() {
        return <div className={classNames(this.props.className, styles['container'])}>
            <div className={styles['container__top']}>
                <div className={styles['container__title']}>
                    {this.state.title}
                </div>
                <div className={styles['container__comments-count']}>
                    {this.state.comments.value.length}
                </div>
            </div>
            {this.state.isInAddMode ? 
                <NoteCreateForm
                    className={styles['container__add-form']}
                    onSubmit={this.addNote}
                    onCancel={this.switchMode} 
                    theme={this.state.theme}/> :
                <button className={styles['container__add-btn']} onClick={this.switchMode}>
                    + Write note
                </button>}
            {this.state.comments.value.length ? this.renderNoteList() : ''}
        </div>;
    }
};

Table.propTypes = propTypes;

export default Table;
