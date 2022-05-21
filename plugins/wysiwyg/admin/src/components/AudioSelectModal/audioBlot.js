import ReactQuill, { Quill } from 'react-quill'

const BlockEmbed = Quill.import('blots/block/embed')

class ObservableAudioSourceBlot extends BlockEmbed {
  static create(data) {
    let node = super.create();
    node.setAttribute('audio-data-src', data.src);
    if (data.region) {
      const segmentStart = data.region.start;
      const segmentEnd = data.region.end;
      node.setAttribute('audio-data-segment-start', segmentStart.toString());
      node.setAttribute('audio-data-segment-end', segmentEnd.toString());
      if(data.region.id) {
        node.setAttribute('audio-data-segment-id', data.region.id);
      }

      const title = document.createElement('div');
      title.textContent = data.src + " сегмент с  " + segmentStart + " по " + segmentEnd;
      title.setAttribute("style", "border: 1px solid red;");

      const sound  = document.createElement('audio');
      sound.controls = 'controls';
      sound.src      = data.src;
      sound.type     = 'audio/mpeg';
      sound.max =  data.region.end;
      sound.currentTime = segmentStart;
      sound.addEventListener('timeupdate', function (){
        if (segmentEnd && sound.currentTime >= segmentEnd) {
          sound.pause();
        }
      }, false);
      node.appendChild(title);
      node.appendChild(sound);
    }




    node.classList.add('observable-audio-source');
    return node;
  }

  static value(node) {
    const src = node.getAttribute('audio-data-src');
    const start = node.getAttribute('audio-data-segment-start');
    const end = node.getAttribute('audio-data-segment-end');
    const id = node.getAttribute('audio-data-segment-id');
    if (start && end) {
      let region = {start, end};
      if(id) {
        region.id = id;
      }
      return {src, region};
    }
    return {src};
  }
}

ObservableAudioSourceBlot.blotName = 'observableAudioSource';
ObservableAudioSourceBlot.tagName = 'div';

export default ObservableAudioSourceBlot;
export {ObservableAudioSourceBlot};
