import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import bind from 'lodash-decorators/bind';

// import i18n from '../../utils/i18n';

import {
  MENU_PROP_TYPE,
  MENU_ITEM_TYPE,
} from '@kmwork/front-core/lib/modules/feature-ui-basic/common/subModule/model-ui-menu';

// ======================================================
// MODULE
// ======================================================
import { getSidebarContext } from '../../redux-selectors-sidebar';
import { actions } from '../../redux-sidebar';

import getComponents from '../../get-components';

const { Menu, Icon, Sidebar } = getComponents();

require('./AppSidebar.scss');

@connect(
  globalState => ({
    sidebarContext: getSidebarContext(globalState),
  }),
  {
    ...actions,
  },
)
export default class AppSidebar extends PureComponent {
  static propTypes = {
    menu: MENU_PROP_TYPE,
    children: PropTypes.node,
    className: PropTypes.string,
    sidebarProps: PropTypes.shape(Sidebar.propTypes),

    onClose: PropTypes.func,

    currentPath: PropTypes.string,
    onGoTo: PropTypes.func,

    // ======================================================
    // @connect
    // ======================================================
    sidebarContext: PropTypes.object,
    actionChangeSidebarContext: PropTypes.func,
    actionCloseSidebar: PropTypes.func,
  };

  @bind()
  renderSidebarMenuItem(menuItem, index) {
    const {
      onGoTo,
      currentPath,
      onClose,
      actionCloseSidebar,
      sidebarProps: { alwaysVisible = false, hideOnMenuClick = true } = {},
    } = this.props;

    const {
      key,
      type,
      name,
      path,
      to,
      icon,
      isLink,
      content,
      onClick,
      className,
    } = menuItem;

    const isDelimiter =
      name === MENU_ITEM_TYPE.DELIMITER || type === MENU_ITEM_TYPE.DELIMITER;

    const keyFinal =
      key || (isDelimiter ? `${MENU_ITEM_TYPE.DELIMITER}_${index}` : name);
    return (
      <Menu.Item
        key={ keyFinal }
        className={ `AppSidebar__menuItem ${
          isDelimiter ? 'AppSidebar__menuItemDelimiter' : ''
        } ${className || ''}` }
        name={ name }
        path={ path }
        onClick={ async event => {
          let stopClosing;
          if (onClick && !alwaysVisible) {
            stopClosing = await onClick(event);
          } else if (onGoTo && (path || to)) {
            await onGoTo(path || to);
          }
          if (!hideOnMenuClick) {
            stopClosing = true;
          }
          if (stopClosing !== true && onClose && !alwaysVisible) {
            stopClosing = await onClose();
          }
          if (stopClosing !== true && !alwaysVisible) {
            stopClosing = await actionCloseSidebar();
          }
          return stopClosing;
        } }
        link={
          typeof isLink !== 'undefined'
            ? isLink
            : isDelimiter
            ? false
            : !!(path || onClick)
        }
        active={ currentPath && currentPath.indexOf(path || to) >= 0 }
      >
        {icon && <Icon name={ icon } />}
        {content || name}
      </Menu.Item>
    );
  }

  // ======================================================
  // MAIN RENDER
  // ======================================================
  render() {
    const { menu, className, sidebarProps, children } = this.props;
    return (
      <Sidebar
        className={ `AppSidebar ${className || ''}` }
        as={ Menu }
        animation="overlay"
        width="thin"
        visible={ true }
        icon="labeled"
        vertical={ true }
        inverted={ true }
        { ...sidebarProps }
      >
        {menu && menu.map(this.renderSidebarMenuItem)}
        {children}
      </Sidebar>
    );
  }
}
