import React, { Component } from 'react';
import PropTypes from 'prop-types';
// todo @ANKU @LOW @BUG_OUT @core-decorators - @debounce deprated - use lodash-decorators
// todo @ANKU @LOW - выпилить core-decorators на lodash-decorators
// import { autobind } from 'core-decorators';
import bind from 'lodash-decorators/bind';
import debounce from 'lodash-decorators/debounce';
import Scroll from 'react-scroll';
// import { getScrollParent } from 'react-scroll/modules/mixins/utils';

import { getScrollParent } from '@kmwork/front-core/lib/common/utils/dom-utils';

import getComponents from '../../get-components';

const {
  Icon,
} = getComponents();

require('./UpBottomButtons.scss');

export default class UpBottomButtons extends Component {
  static propTypes = {
    scrollContainerId: PropTypes.string,
    scrollContainer: PropTypes.any,
  };

  static defaultProps = {
  };

  state = {
    showUp: false,
    showBottom: false,
  };

  scrollContainerEl = null;
  elementEl = null;

  // ======================================================
  // LIFECYCLE
  // ======================================================
  componentDidMount() {
    const {
      scrollContainerId,
      scrollContainer,
    } = this.props;

    setTimeout(() => {
      if (scrollContainer) {
        this.scrollContainerEl = scrollContainer;
      } else if (scrollContainerId) {
        this.scrollContainerEl = document.getElementById(scrollContainerId);
      } else if (this.elementEl) {
        this.scrollContainerEl = getScrollParent(this.elementEl);
      }

      // todo @ANKU @LOW - при глобальном хот релоаде компонентов - теряет контейнер - пока отключили эту функциональность
      if (this.scrollContainerEl) {
        this.scrollContainerEl.addEventListener('scroll', this.handleScroll);
      }
      // нужно подождать пока все стили подцепятся и правильно определить родителя
    }, 1000);
  }
  componentWillUnmount() {
    if (this.scrollContainerEl) {
      this.scrollContainerEl.removeEventListener('scroll', this.handleScroll);
    }
  }

  // ======================================================
  // UTILS
  // ======================================================
  getScrollDom(event = null) {
    return this.scrollContainerEl === document
      ? document.documentElement
      : this.scrollContainerEl || event.target || event;
  }

  // ======================================================
  // HANDLERS
  // ======================================================
  @debounce(100)
  @bind()
  handleScroll(event) {
    const {
      target,
    } = event;
    const targetFinal = target === document ? document.documentElement : target;
    const {
      scrollHeight,
      scrollTop,
    } = targetFinal;

    const { clientHeight } = this.getScrollDom(targetFinal);

    const updatedState = {};
    if (scrollTop > scrollHeight / 3) {
      updatedState.showUp = true;
    }

    const hasScroll = scrollHeight > (clientHeight * 1.5);

    this.setState({
      showUp: hasScroll && (scrollTop >= (clientHeight / 3)),
      showBottom: hasScroll && (scrollHeight - scrollTop > clientHeight),
    });
  }

  @bind()
  handleToUp() {
    // todo @ANKU @LOW @BUG_OUT @react-scroll - если элемент fixed то он неправильно находит парент скролл
    // Scroll.animateScroll.scrollToTop(this.elementEl);
    Scroll.animateScroll.scrollToTop({
      container: this.getScrollDom(),
    });
  }
  @bind()
  handleToBottom() {
    Scroll.animateScroll.scrollToBottom({
      container: this.getScrollDom(),
    });
  }


  // ======================================================
  // RENDERS
  // ======================================================


  // ======================================================
  // MAIN RENDER
  // ======================================================
  render() {
    const {
      showUp,
      showBottom,
    } = this.state;

    return (
      <div
        className="UpBottomButtons"
        ref={ (elementNode) => this.elementEl = elementNode }
      >
        { showUp && (
          <div className="UpBottomButtons__up">
            <Icon
              name="angle double up"
              onClick={ this.handleToUp }
            />
          </div>
        )}

        {
          showBottom && (
            <div className="UpBottomButtons__down">
              <Icon
                name="angle double down"
                onClick={ this.handleToBottom }
              />
            </div>
          )
        }
      </div>
    );
  }
}
