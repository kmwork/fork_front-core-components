import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bind from 'lodash-decorators/bind';

import { toTranslitFromRu } from '@kmwork/front-core/lib/common/utils/pluralize-utils';

import i18n from '../../i18n';
import getComponents from '../../get-components';

const {
  Icon,
  Button,
} = getComponents();

require('./KeyValueList.scss');

export default class KeyValueList extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      value: PropTypes.string,
      name: PropTypes.string,
      // or
      label: PropTypes.string,
    })),

    className: PropTypes.string,
    readOnly: PropTypes.bool,
    editable: PropTypes.bool,
    alwaysShowControls: PropTypes.bool,
    withoutName: PropTypes.bool,

    onRemoveItem: PropTypes.func,
    onAdd: PropTypes.func,
    onDrop: PropTypes.func,

    dropText: PropTypes.string,
    orCreateText: PropTypes.string,
  };

  static defaultProps = {
    editable: true,
    dropText: i18n('components.KeyValueList.drag'),
    orCreateText: i18n('components.KeyValueList.orCreate'),
  };

  state = {
    name: '',
    value: '',
  };

  // ======================================================
  // LIFECYCLE
  // ======================================================
  // componentDidMount() {
  // }
  // componentWillReceiveProps(newProps) {
  // }


  // ======================================================
  // HANDLERS
  // ======================================================
  @bind()
  handleAdd() {
    const {
      name,
      value,
    } = this.state;
    // const id = toTranslitFromRu(name);
    const id = undefined;

    const result = this.props.onAdd(name, value, id);

    if (result === undefined || result === true) {
      this.setState({
        name: '',
        value: '',
      });
    }
  }

  @bind()
  handleChangeName(el) {
    this.setState({
      name: el.target.value,
    });
  }
  @bind()
  handleChangeValue(el) {
    this.setState({
      value: el.target.value,
    });
  }

  // ======================================================
  // RENDERS
  // ======================================================
  renderActionAdd() {
    const {
      readOnly,
      withoutName,
    } = this.props;

    const {
      name,
      value,
    } = this.state;

    return (
      <Button
        className="KeyValueListAdd__actionAdd"
        onClick={ this.handleAdd }
        disabled={ !value || (!withoutName && !name) || readOnly }
      >
        { i18n('components.KeyValueList.actionAdd') }
      </Button>
    );
  }

  // ======================================================
  // MAIN RENDER
  // ======================================================
  render() {
    const {
      data,
      readOnly,
      editable,
      alwaysShowControls,
      onRemoveItem,
      onAdd,
      onDrop,
      dropText,
      orCreateText,
      className,
      withoutName,
    } = this.props;

    const {
      name,
      value,
    } = this.state;

    return (
      <div className={ `KeyValueList ${className || ''}` }>
        {
          data.map(({ id, label, name: itemName, value: dataItemValue }) => (
            <div
              key={ id || label || itemName }
              className="KeyValueList__item KeyValueListItem"
            >
              <div className="KeyValueListItem__name">{ label || itemName || id}</div>
              <div className="KeyValueListItem__value">{dataItemValue}</div>
              {
                !readOnly && onRemoveItem && (
                  <Icon
                    className="KeyValueListItem__removeIcon"
                    name="remove"
                    onClick={ () => onRemoveItem(id || label || itemName) }
                  />
                )
              }
            </div>
          ))
        }

        {
          !readOnly && editable && onDrop && (
            <div className="KeyValueList__drag">
              { dropText }
            </div>
          )
        }

        {
          onAdd && editable && (!readOnly || alwaysShowControls) && (
            <div className="KeyValueList__add KeyValueListAdd">
              {
                onDrop && (
                  <span className="KeyValueListAdd__createText">
                    { orCreateText }
                  </span>
                )
              }

              <div className="KeyValueListAdd__controls KeyValueListControls">
                {
                  !withoutName && (
                    <input
                      className="KeyValueListControls__input"
                      value={ name }
                      onChange={ this.handleChangeName }
                      placeholder={ i18n('components.KeyValueList.inputName.placeholder') }
                      readOnly={ readOnly }
                    />
                  )
                }
                <input
                  className="KeyValueListControls__input"
                  value={ value }
                  onChange={ this.handleChangeValue }
                  placeholder={ i18n('components.KeyValueList.inputValue.placeholder') }
                  readOnly={ readOnly }
                />
                {
                  withoutName && this.renderActionAdd()
                }
              </div>

              {
                !withoutName && (
                  <div className="KeyValueListAdd__actions">
                    { this.renderActionAdd() }
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    );
  }
}
