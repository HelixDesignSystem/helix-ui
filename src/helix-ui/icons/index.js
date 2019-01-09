import _account from './account.svg';
import _angleBottom from './angle-bottom.svg';
import _angleDown from './angle-down.svg';
import _angleEnd from './angle-end.svg';
import _angleLeft from './angle-left.svg';
import _angleRight from './angle-right.svg';
import _angleStart from './angle-start.svg';
import _angleTop from './angle-top.svg';
import _angleUp from './angle-up.svg';
import _bell from './bell.svg';
import _billing from './billing.svg';
import _calendar from './calendar.svg';
import _checkmark from './checkmark.svg';
import _checkmarkCircle from './checkmark-circle.svg';
import _clock from './clock.svg';
import _cog from './cog.svg';
import _copy from './copy.svg';
import _download from './download.svg';
import _envelope from './envelope.svg';
import _exclamationCircle from './exclamation-circle.svg';
import _exclamationDiamond from './exclamation-diamond.svg';
import _exclamationTriangle from './exclamation-triangle.svg';
import _externalLink from './external-link.svg';
import _file from './file.svg';
import _filter from './filter.svg';
import _flag from './flag.svg';
import _globe from './globe.svg';
import _helpCircle from './help-circle.svg';
import _infoCircle from './info-circle.svg';
import _inputFile from './input-file.svg';
import _kbdArrowDown from './kbd-arrow-down.svg';
import _kbdArrowLeft from './kbd-arrow-left.svg';
import _kbdArrowRight from './kbd-arrow-right.svg';
import _kbdArrowUp from './kbd-arrow-up.svg';
import _kbdCapslock from './kbd-capslock.svg';
import _kbdCmd from './kbd-command.svg';
import _kbdDelete from './kbd-delete.svg';
import _kbdEject from './kbd-eject.svg';
import _kbdOption from './kbd-option.svg';
import _kbdReturn from './kbd-return.svg';
import _kbdShift from './kbd-shift.svg';
import _kbdSpace from './kbd-space.svg';
import _kbdTab from './kbd-tab.svg';
import _key from './key.svg';
import _lock from './lock.svg';
import _mimeArchive from './mime-archive.svg';
import _mimeAudio from './mime-audio.svg';
import _mimeCode from './mime-code.svg';
import _mimeData from './mime-data.svg';
import _mimeImage from './mime-image.svg';
import _mimeSystem from './mime-system.svg';
import _mimeText from './mime-text.svg';
import _mimeVideo from './mime-video.svg';
import _minus from './minus.svg';
import _minusCircle from './minus-circle.svg';
import _monitoring from './monitoring.svg';
import _paperclip from './paperclip.svg';
import _payment from './payment.svg';
import _pencil from './pencil.svg';
import _phone from './phone.svg';
import _plus from './plus.svg';
import _plusOrMinus from './plus-or-minus.svg';
import _redo from './redo.svg';
import _search from './search.svg';
import _server from './server.svg';
import _serverConfig from './server-config.svg';
import _serverIncident from './server-incident.svg';
import _sort from './sort.svg';
import _sortDown from './sort-down.svg';
import _sortUp from './sort-up.svg';
import _support from './support.svg';
import _tag from './tag.svg';
import _ticketing from './ticketing.svg';
import _times from './times.svg';
import _timesCircle from './times-circle.svg';
import _trash from './trash.svg';
import _undo from './undo.svg';
import _upload from './upload.svg';
import _user from './user.svg';

const MAP = {
    'account': _account,
    'angle-bottom': _angleBottom,
    'angle-down': _angleDown,
    'angle-end': _angleEnd,
    'angle-left': _angleLeft,
    'angle-right': _angleRight,
    'angle-start': _angleStart,
    'angle-top': _angleTop,
    'angle-up': _angleUp,
    'bell': _bell,
    'billing': _billing,
    'calendar': _calendar,
    'checkmark': _checkmark,
    'checkmark-circle': _checkmarkCircle,
    'clock': _clock,
    'cog': _cog,
    'copy': _copy,
    'download': _download,
    'envelope': _envelope,
    'exclamation-circle': _exclamationCircle,
    'exclamation-diamond': _exclamationDiamond,
    'exclamation-triangle': _exclamationTriangle,
    'external-link': _externalLink,
    'file': _file,
    'filter': _filter,
    'flag': _flag,
    'globe': _globe,
    'help-circle': _helpCircle,
    'info-circle': _infoCircle,
    'input-file': _inputFile,
    'kbd-arrow-down': _kbdArrowDown,
    'kbd-arrow-left': _kbdArrowLeft,
    'kbd-arrow-right': _kbdArrowRight,
    'kbd-arrow-up': _kbdArrowUp,
    'kbd-capslock': _kbdCapslock,
    'kbd-command': _kbdCmd,
    'kbd-delete': _kbdDelete,
    'kbd-eject': _kbdEject,
    'kbd-option': _kbdOption,
    'kbd-return': _kbdReturn,
    'kbd-shift': _kbdShift,
    'kbd-space': _kbdSpace,
    'kbd-tab': _kbdTab,
    'key': _key,
    'lock': _lock,
    'mime-archive': _mimeArchive,
    'mime-audio': _mimeAudio,
    'mime-code': _mimeCode,
    'mime-data': _mimeData,
    'mime-image': _mimeImage,
    'mime-system': _mimeSystem,
    'mime-text': _mimeText,
    'mime-video': _mimeVideo,
    'minus': _minus,
    'minus-circle': _minusCircle,
    'monitoring': _monitoring,
    'paperclip': _paperclip,
    'payment': _payment,
    'pencil': _pencil,
    'phone': _phone,
    'plus': _plus,
    'plus-or-minus': _plusOrMinus,
    'redo': _redo,
    'search': _search,
    'server': _server,
    'server-config': _serverConfig,
    'server-incident': _serverIncident,
    'sort': _sort,
    'sort-down': _sortDown,
    'sort-up': _sortUp,
    'support': _support,
    'tag': _tag,
    'ticketing': _ticketing,
    'times': _times,
    'times-circle': _timesCircle,
    'trash': _trash,
    'undo': _undo,
    'upload': _upload,
    'user': _user,
};

// DEPRECATED: remove in v1.0.0
MAP['export'] = MAP['upload'];
MAP['input-url'] = MAP['globe'];
MAP['technical-change'] = MAP['server-config'];
MAP['technical-incident'] = MAP['server-incident'];
MAP['input-time'] = MAP['clock'];

export default MAP;
