import onChange from 'on-change';

export const observerModel = (model) => onChange(model, (path, value) => {
  // console.log('Object changed:', ++index);
  // console.log('this:', this);
  // console.log('path:', path);
  // console.log('value:', value);
  // console.log('previousValue:', previousValue);
  // console.log('applyData:', applyData);
});
