import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import PropTypes from 'prop-types';
import {HeaderModal, HeaderModalTitle, Modal, ModalBody, ModalFooter, useGlobalContext,} from 'strapi-helper-plugin';
import {FormattedMessage} from 'react-intl';
import {Button} from '@buffetjs/core';
import {getTrad} from '../../utils/getTrad';
import pluginId from '../../pluginId';
// import
import "./styles.css";
import {Region, WaveForm, WaveSurfer} from "wavesurfer-react";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import MediaLib from "../MediaLib";

const SelectAudioModal = ({
                            isOpen,
                            onChange,
                            onToggle
                          }) => {
  const [lastLoadedUrl, setLastLoadedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortController = new AbortController();

  const plugins = useMemo(() => {
    return [
      {
        plugin: RegionsPlugin,
        options: {dragSelection: true}
      }
    ].filter(Boolean);
  }, []);
  const [regions, setRegions] = useState([]);
  const regionsRef = useRef(regions);
  useEffect(() => {
    regionsRef.current = regions;
  }, [regions]);
  const regionCreatedHandler = useCallback(
    region => {
      wavesurferRef.current.regions.clear();
      if (region.data.systemRegionId) return;

      setRegions([
        ...regionsRef.current,
        {...region, data: {...region.data, systemRegionId: -1}}
      ]);
    },
    [regionsRef]
  );

  const regionUpdatedHandler = useCallback(
    region => {
      console.log("region-updated --> region:", region);
      if (region.data.systemRegionId) return;
      setRegions([
        {...region, data: {...region.data, systemRegionId: -1}}
      ]);
    },
    [regionsRef]
  );

  const playSelectedRegion = useCallback(() => {
    const regionsList = wavesurferRef.current.regions.list;
    const firstKey = Object.keys(regionsList)[0];
    if(wavesurferRef.current.isPlaying()) {
      wavesurferRef.current.pause();
    }
    wavesurferRef.current.regions.list[firstKey].play()
  }, [regions]);

  const wavesurferRef = useRef();
  const handleWSMount = useCallback(
    waveSurfer => {
      wavesurferRef.current = waveSurfer;
      if (wavesurferRef.current) {
        // wavesurferRef.current.load("/uploads/07. Toccata.mp3");

        wavesurferRef.current.on("region-created", regionCreatedHandler);
        wavesurferRef.current.on("region-update-end", regionUpdatedHandler);

        wavesurferRef.current.on("ready", (data) => {
          generateRegion();
        });

        wavesurferRef.current.on("region-removed", region => {
          console.log("region-removed --> ", region);
        });

        wavesurferRef.current.on("region-dblclick", region => {
          region.play();
          console.log("region-played --> ", region);
        });


        wavesurferRef.current.on("loading", data => {
          console.log("loading --> ", data);
        });

        if (window) {
          window.surferidze = wavesurferRef.current;
        }
      }
    },
    [regionCreatedHandler]
  );

  const generateRegion = useCallback(() => {
    if (!wavesurferRef.current) return;
    const minTimestampInSeconds = 0;
    const maxTimestampInSeconds = wavesurferRef.current.getDuration();
    //         id: "from-"+minTimestampInSeconds+"to"+maxTimestampInSeconds,
    setRegions([
      {
        start: minTimestampInSeconds,
        end: maxTimestampInSeconds,
        color: `rgba(0, 0, 0, 0.5)`
      }
    ]);
  }, [regions, wavesurferRef]);
  const handleRegionUpdate = useCallback((region, smth) => {
    setRegions([region]);
  }, []);

  const [isMediaLibOpen, setIMediaLibOpen] = useState(false);
  const handleMediaLibToggle = () => setIMediaLibOpen((prev) => !prev);
  const handleMediaLibChange = (data) => {
    setLastLoadedUrl(data.url);
    wavesurferRef.current.load(data.url);
  }

  const onSubmit = useCallback(() => {
    wavesurferRef.current.pause();
    wavesurferRef.current.destroy();
    if (regions[0]) {
       onChange({region: regions[0], track: lastLoadedUrl});
    }
    onToggle();
  }, [regions]);

  useEffect(() => {
    if (isOpen) {
      // setUrl(isObject(value) && value.url ? value.url : '');

      // Focus on the input
      setTimeout(() => {
        const input = document.getElementById('oembed-form-url');
        if (input) {
          input.focus();
        }
      }, 150);
    }

    return () => {
      // Abort the endpoint call if we close the modal
      abortController.abort();
    };
  }, [isOpen]);

  // Submit when we hit enter on the input
  const keyPress = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  return (
    <Modal isOpen={isOpen} onToggle={onToggle} style={{width: '50rem'}}>
      <HeaderModal>
        <section>
          <HeaderModalTitle style={{textTransform: 'none'}}>
            Add Audio-insert
          </HeaderModalTitle>
        </section>
      </HeaderModal>
      <ModalBody>
        <WaveSurfer plugins={plugins} onMount={handleWSMount}>
          <WaveForm id="waveform">
            {regions.map(regionProps => (
              <Region
                onUpdateEnd={handleRegionUpdate}
                key={regionProps.id}
                {...regionProps}
              />
            ))}
          </WaveForm>
        </WaveSurfer>
      </ModalBody>
      <ModalFooter>
        <section>
          <Button onClick={onToggle} color="cancel">
            Cancel
          </Button>
          <Button color="primary" onClick={handleMediaLibToggle}>
            Open
          </Button>
          <Button color="primary" onClick={playSelectedRegion}>
            Play/Stop
          </Button>
          <Button color="success" isLoading={isLoading} onClick={onSubmit}>
            Finish
          </Button>
        </section>
      </ModalFooter>
      <MediaLib
        onToggle={handleMediaLibToggle}
        isOpen={isMediaLibOpen}
        onChange={handleMediaLibChange}
      />
    </Modal>
  );
};


SelectAudioModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default SelectAudioModal;