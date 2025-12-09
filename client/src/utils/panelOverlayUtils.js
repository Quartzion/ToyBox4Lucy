export default function togglePanelOverlay(isOpen, setOpen) {
  setOpen(!isOpen);

  if (!isOpen) {
    document.body.classList.add('panel-overlay-open');
  } else {
    document.body.classList.remove('panel-overlay-open');
  }
}
