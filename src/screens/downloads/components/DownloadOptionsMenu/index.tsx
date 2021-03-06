import React, { useMemo, useRef } from 'react';
import Menu, { MenuItem } from 'react-native-material-menu';
import OptionsButton from '@components/OptionsButton';
import { Download } from '@reducers/downloadsReducer';

interface Props {
  download: Download;
  onPause: (url: string) => void;
  onResume: (url: string) => void;
  onDelete: (download: Download) => void;
}

const DownloadOptionsMenu = ({ download, onPause, onResume, onDelete }: Props) => {
  const menu = useRef<Menu>(null);
  const { completed, isDownloading, url } = download;

  const showMenu = () => {
    !!menu.current && menu.current.show();
  };

  const button = useMemo(() => <OptionsButton onPress={showMenu} />, []);

  const onPress = item => {
    switch (item) {
      case '1':
        !!menu.current && menu.current.hide();
        isDownloading ? onPause(url) : onResume(url);
        break;
      case '2':
        // Not sure why, but without this, delete modal does not show on iOS.
        !!menu.current && menu.current.hide(() => onDelete(download));
        break;
      default:
        break;
    }
  };

  return (
    <Menu ref={menu} button={button}>
      {!completed && (
        <MenuItem onPress={() => onPress('1')}>{isDownloading ? 'Pause' : 'Resume'}</MenuItem>
      )}
      <MenuItem onPress={() => onPress('2')}>Delete</MenuItem>
    </Menu>
  );
};

export default DownloadOptionsMenu;
