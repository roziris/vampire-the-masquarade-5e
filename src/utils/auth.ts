export interface Account {
  id: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

const ACCOUNTS_KEY = 'vampire_accounts';
const CURRENT_ACCOUNT_KEY = 'vampire_current_account';

function readAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) as Account[] : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function getCurrentAccount(): Account | null {
  try {
    const raw = localStorage.getItem(CURRENT_ACCOUNT_KEY);
    if (!raw) return null;
    const account = JSON.parse(raw) as Account;
    return account && account.id && account.username ? account : null;
  } catch {
    return null;
  }
}

export function setCurrentAccount(account: Account | null) {
  if (!account) {
    localStorage.removeItem(CURRENT_ACCOUNT_KEY);
    return;
  }

  localStorage.setItem(CURRENT_ACCOUNT_KEY, JSON.stringify(account));
}

export function logoutAccount() {
  setCurrentAccount(null);
}

export function registerAccount(username: string, password: string): { ok: boolean; account?: Account; message?: string } {
  const cleanName = username.trim();
  if (!cleanName || !password.trim()) {
    return { ok: false, message: 'Введіть ім’я користувача та пароль.' };
  }

  const accounts = readAccounts();
  const normalized = normalizeUsername(cleanName);

  if (accounts.some(account => normalizeUsername(account.username) === normalized)) {
    return { ok: false, message: 'Користувач з таким логіном уже існує.' };
  }

  const now = new Date().toISOString();
  const account: Account = {
    id: crypto.randomUUID(),
    username: cleanName,
    password,
    createdAt: now,
    updatedAt: now,
  };

  accounts.push(account);
  writeAccounts(accounts);
  setCurrentAccount(account);

  return { ok: true, account };
}

export function loginAccount(username: string, password: string): { ok: boolean; account?: Account; message?: string } {
  const cleanName = username.trim();
  if (!cleanName || !password.trim()) {
    return { ok: false, message: 'Введіть ім’я користувача та пароль.' };
  }

  const account = readAccounts().find(item => {
    return normalizeUsername(item.username) === normalizeUsername(cleanName) && item.password === password;
  });

  if (!account) {
    return { ok: false, message: 'Невірний логін або пароль.' };
  }

  const updatedAccount = { ...account, updatedAt: new Date().toISOString() };
  const accounts = readAccounts().map(item => item.id === account.id ? updatedAccount : item);
  writeAccounts(accounts);
  setCurrentAccount(updatedAccount);

  return { ok: true, account: updatedAccount };
}
