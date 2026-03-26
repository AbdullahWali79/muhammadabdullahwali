// Utility function to preserve scroll position and focus during input changes
export const preserveScrollAndFocus = (inputElement) => {
  // Save current scroll position
  const scrollPosition = window.scrollY || window.pageYOffset;
  
  // Save current cursor position if it's a text input
  let cursorPosition = null;
  if (inputElement && (inputElement.tagName === 'INPUT' || inputElement.tagName === 'TEXTAREA')) {
    cursorPosition = inputElement.selectionStart;
  }
  
  // Return a function to restore scroll and focus
  return () => {
    requestAnimationFrame(() => {
      // Restore scroll position
      if (scrollPosition !== undefined) {
        window.scrollTo(0, scrollPosition);
      }
      
      // Restore focus and cursor position
      if (inputElement && document.activeElement !== inputElement) {
        inputElement.focus();
        if (cursorPosition !== null && (inputElement.tagName === 'INPUT' || inputElement.tagName === 'TEXTAREA')) {
          inputElement.setSelectionRange(cursorPosition, cursorPosition);
        }
      }
    });
  };
};

