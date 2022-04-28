import { DoneItem } from './types/share/DoneItem';

const isDev = process.env.NODE_ENV !== 'production';

// Debug Mode
export const dummyMotion = true;

// VALUE
export const MAX_MSGS = 500;

// Const
export const LOGIN_COOKIE = 'isLogin';
export const LARAVEL_SESSION = process.env.NEXT_PUBLIC_SESSION_KEY ?? 'mikolaravel_session';
export const USER_TICKET_COOKIE = 'userTicket';
export const categoryArray = ['J-POP', 'K-POP', '애니메이션', '재즈/소울', '밴드', '발라드'];
export const doneItem: DoneItem[] = [
  { name: 'ハート', price: 5000, id: 0 },
  { name: 'コンペート', price: 6000, id: 1 },
  { name: 'スター', price: 2500, id: 2 },
  { name: 'ギフト', price: 100000, id: 3 },
  { name: '日々', price: 75000, id: 4 },
  { name: 'キラキラ', price: 4000, id: 5 },
];

export const AVATAR_THEME_NAME = ['ミク', 'キラリ', 'タンジロ', 'サトル', 'AGU'];

export const chType = ['チャージ', 'チケット購入', 'SC送り', 'アイテム使用', 'グッズ購入', 'チケット販売', 'グッズ販売', 'SC受け', 'アイテム受け'];
export const chChargeIdx = 0;
export const chTicketBuyIdx = 1;
export const chSuperChatSendIdx = 2;
export const chDoneItemSendIdx = 3;
export const chGoodsBuyIdx = 4;
export const chTicketSoldIdx = 5;
export const chGoodsSoldIdx = 6;
export const chSuperChatSendedIdx = 7;
export const chSuperDoneItemSendedIdx = 8;

// image url은 전부 / 가 붙음.
export const IMAGE_DOMAIN = 'https://img.mikopj.live/';

export const MY_AVATAR_ID = 'myAvatar'; // 이거 변경하면 @src/components/viewing/GlobalModel.ts에 default value변경해야함

//  NOTE  process.env getter로만 접근 해야함.
// NOTE 백엔드 URL은 전부 /가 붙지 않음.
export const LARAVEL_URL = process.env.NEXT_PUBLIC_LARAVEL_URL ?? 'http://localhost:8080/api';
export const NEST_URL = process.env.NEXT_PUBLIC_NEST_URL ?? 'http://localhost:3001/api';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER ?? 'http://localhost:3001';

export const NEXT_URL = process.env.NEXT_PUBLIC_NEXT_URL ?? 'http://localhost:3000';

export const S3_IVS_URL = process.env.NEXT_PUBLIC_S3_IVS_URL ?? 'https://miko-ivs-bucket.s3.amazonaws.com';

// URL
export const URL_USER_TICKET = '/user_tickets';

// Interval
export const UPDATE_USERS_SCORE_TIME = 1000;

// web-push key
export const VapidServerKey = 'BNAgp0hyZG175VVckUdf-YGtg-dTmJjpaaunHi83G5LGWdwClOhbv6JMgsu9d-yAL2es-Y7V_YX060EUCXmsnoQ';
