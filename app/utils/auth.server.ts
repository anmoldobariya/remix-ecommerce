import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { getDb } from './db.server';
import { ObjectId } from 'mongodb';
import type { User } from '~/models';

const SESSION_SECRET = process.env.SESSION_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is not set');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax',
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production'
  }
});

export async function createUser(
  userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>
) {
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const user = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const db = await getDb();
  const result = await db.collection('users').insertOne(user);
  return result.insertedId.toString();
}

export async function verifyLogin(email: string, password: string) {
  const db = await getDb();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;
  return { ...userWithoutPassword, _id: user._id.toString() };
}

export async function getUserById(id: string) {
  try {
    const db = await getDb();
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(id) });
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: user._id.toString() };
  } catch {
    return null;
  }
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session)
    }
  });
}

export async function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null;
  }

  try {
    const user = await getUserById(userId);
    return user;
  } catch {
    throw await logout(request);
  }
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  if (!user) {
    throw await logout(request);
  }
  return user;
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);
  if ((user as any).role !== 'admin') {
    throw new Response('Unauthorized', { status: 403 });
  }
  return user;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}
