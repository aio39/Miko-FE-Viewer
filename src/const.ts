// Debug Mode
export const dummyMotion = true;

// Const
export const LOGIN_COOKIE = 'isLogin';
export const LARAVEL_SESSION = 'laravel_session';
export const USER_TICKET_COOKIE = 'userTicket';
export const categoryArray = ['J-POP', 'K-POP', '애니메이션', '재즈/소울', '밴드', '발라드'];

export const S3_URL = 'https://miko-image.s3.ap-northeast-2.amazonaws.com/';

export const MY_AVATAR_ID = 'kirari'; // 이거 변경하면 @src/components/viewing/GlobalModel.ts에 default value변경해야함

// Env
const ENV_PREFIX = 'NEXT_PUBLIC_';

export const LARAVEL_URL = process.env[ENV_PREFIX + 'LARAVEL_URL'] ?? 'http://localhost:8080/api';
export const NEST_URL = process.env[ENV_PREFIX + 'NEST_URL'] ?? 'http://localhost:3001/api';
export const SOCKET_URL = process.env[ENV_PREFIX + 'SOCKET_SERVER'] ?? 'http://localhost:3002';

export const NEXT_URL = process.env[ENV_PREFIX + 'NEXT_URL'] ?? 'http://localhost:3000';

// URL
export const URL_USER_TICKET = '/user_tickets';
