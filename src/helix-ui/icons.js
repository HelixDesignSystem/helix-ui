import _account from './icons/account.svg';
import _angleBottom from './icons/angle-bottom.svg';
import _angleDown from './icons/angle-down.svg';
import _angleEnd from './icons/angle-end.svg';
import _angleLeft from './icons/angle-left.svg';
import _angleRight from './icons/angle-right.svg';
import _angleStart from './icons/angle-start.svg';
import _angleTop from './icons/angle-top.svg';
import _angleUp from './icons/angle-up.svg';
import _bell from './icons/bell.svg';
import _billing from './icons/billing.svg';
import _calendar from './icons/calendar.svg';
import _checkmark from './icons/checkmark.svg';
import _checkmarkCircle from './icons/checkmark-circle.svg';
import _cog from './icons/cog.svg';
import _copy from './icons/copy.svg';
import _download from './icons/download.svg';
import _envelope from './icons/envelope.svg';
import _exclamationCircle from './icons/exclamation-circle.svg';
import _exclamationDiamond from './icons/exclamation-diamond.svg';
import _exclamationTriangle from './icons/exclamation-triangle.svg';
import _externalLink from './icons/external-link.svg';
import _file from './icons/file.svg';
import _filter from './icons/filter.svg';
import _flag from './icons/flag.svg';
import _globe from './icons/globe.svg';
import _helpCircle from './icons/help-circle.svg';
import _infoCircle from './icons/info-circle.svg';
import _inputFile from './icons/input-file.svg';
import _inputTime from './icons/input-time.svg';
import _kbdArrowDown from './icons/kbd-arrow-down.svg';
import _kbdArrowLeft from './icons/kbd-arrow-left.svg';
import _kbdArrowRight from './icons/kbd-arrow-right.svg';
import _kbdArrowUp from './icons/kbd-arrow-up.svg';
import _kbdCapslock from './icons/kbd-capslock.svg';
import _kbdCmd from './icons/kbd-command.svg';
import _kbdDelete from './icons/kbd-delete.svg';
import _kbdEject from './icons/kbd-eject.svg';
import _kbdOption from './icons/kbd-option.svg';
import _kbdReturn from './icons/kbd-return.svg';
import _kbdShift from './icons/kbd-shift.svg';
import _kbdSpace from './icons/kbd-space.svg';
import _kbdTab from './icons/kbd-tab.svg';
import _key from './icons/key.svg';
import _lock from './icons/lock.svg';
import _mimeArchive from './icons/mime-archive.svg';
import _mimeAudio from './icons/mime-audio.svg';
import _mimeCode from './icons/mime-code.svg';
import _mimeData from './icons/mime-data.svg';
import _mimeImage from './icons/mime-image.svg';
import _mimeSystem from './icons/mime-system.svg';
import _mimeText from './icons/mime-text.svg';
import _mimeVideo from './icons/mime-video.svg';
import _minus from './icons/minus.svg';
import _minusCircle from './icons/minus-circle.svg';
import _monitoring from './icons/monitoring.svg';
import _paperclip from './icons/paperclip.svg';
import _payment from './icons/payment.svg';
import _pencil from './icons/pencil.svg';
import _phone from './icons/phone.svg';
import _plus from './icons/plus.svg';
import _plusOrMinus from './icons/plus-or-minus.svg';
import _search from './icons/search.svg';
import _server from './icons/server.svg';
import _serverConfig from './icons/server-config.svg';
import _serverIncident from './icons/server-incident.svg';
import _sort from './icons/sort.svg';
import _sortDown from './icons/sort-down.svg';
import _sortUp from './icons/sort-up.svg';
import _support from './icons/support.svg';
import _tag from './icons/tag.svg';
import _ticketing from './icons/ticketing.svg';
import _times from './icons/times.svg';
import _timesCircle from './icons/times-circle.svg';
import _trash from './icons/trash.svg';
import _upload from './icons/upload.svg';
import _user from './icons/user.svg';

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
    'input-time': _inputTime,
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
    'upload': _upload,
    'user': _user,
};

// DEPRECATED: remove in v1.0.0
MAP['export'] = MAP['upload'];
MAP['input-url'] = MAP['globe'];
MAP['technical-change'] = MAP['server-config'];
MAP['technical-incident'] = MAP['server-incident'];

export default MAP;
