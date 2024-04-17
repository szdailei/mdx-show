import { useState, useEffect, type MouseEvent, type KeyboardEvent } from 'react';
import type { ReactElementWithhChildren } from './html-jsx-to-react/index.d';
import createPage from './create-page';
import { focusOnPrevious, focusOnNext } from './focus-utils';
import inspect from '../inspect';

function isEditing() {
  const { activeElement } = document;
  if (!activeElement) return false;

  switch (activeElement.tagName) {
    case 'INPUT':
    case 'TEXTAREA':
      return true;
    default:
      return false;
  }
}

function toggleFullScreen(event: KeyboardEvent) {
  event.preventDefault();
  if (!document.fullscreenEnabled) return;

  if (!document.fullscreenElement) {
    void document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    void document.exitFullscreen();
  }
}

function Article({ pages }: { pages: ReactElementWithhChildren[][] }) {
  const [currentPageNum, setCurrentPageNum] = useState(0);
  const [showFooterClock, setShowFooterClock] = useState(true);

  const { length } = pages;

  function toggleFooterClock(event: KeyboardEvent) {
    event.preventDefault();
    setShowFooterClock(!showFooterClock);
  }

  const previousPage = (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault();
    if (currentPageNum > 0) {
      setCurrentPageNum(currentPageNum - 1);
    }
  };

  const nextPage = (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault();
    if (currentPageNum < length - 1) {
      setCurrentPageNum(currentPageNum + 1);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (isEditing()) return;
    inspect({ keyboardEventCode: event.code });
    switch (event.code) {
      case 'KeyC':
        if (event.shiftKey) {
          toggleFooterClock(event);
        }
        break;
      case 'KeyF':
        toggleFullScreen(event);
        break;
      case 'Comma':
        focusOnPrevious(event);
        break;
      case 'Period':
        focusOnNext(event);
        break;
      case 'Tab':
        if (event.shiftKey) {
          focusOnPrevious(event);
        } else {
          focusOnNext(event);
        }
        break;
      case 'PageUp':
      case 'Numpad9':
        previousPage(event);
        break;
      case 'Space':
        if (event.shiftKey) {
          previousPage(event);
        } else {
          nextPage(event);
        }
        break;
      case 'PageDown':
      case 'Numpad3':
        nextPage(event);
        break;
      case 'Home':
      case 'Numpad7':
        event.preventDefault();
        setCurrentPageNum(0);
        break;
      case 'End':
      case 'Numpad1':
        event.preventDefault();
        setCurrentPageNum(length - 1);
        break;
      default:
        break;
    }
  };

  // The MouseEvent.button read-only property indicates which button was pressed on the mouse to trigger the event.
  // 0: Main button pressed, usually the left button or the un-initialized state
  // 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
  // 2: Secondary button pressed, usually the right button
  // 3: Fourth button, typically the Browser Back button
  // 4: Fifth button, typically the Browser Forward button
  const onPointerUp = (event: MouseEvent) => {
    switch (event.button) {
      case 3:
        previousPage(event);
        break;
      case 4:
        nextPage(event);
        break;
      default:
        break;
    }
  };

  const pageElements = pages[currentPageNum];

  useEffect(() => {
    function focusOnPresentation() {
      const articleElements = document.getElementsByTagName('ARTICLE') as HTMLCollectionOf<HTMLDivElement>;
      // There are role="presentation" and tabIndex={0} props, so article can be focused on
      articleElements[0].focus();
    }

    focusOnPresentation() as unknown;
  }, [currentPageNum]);

  return (
    <article
      role="presentation"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      className="prose max-w-none"
    >
      {createPage(pageElements, { currentPageNum, totalPageNum: length, showFooterClock })}
    </article>
  );
}

export default Article;
