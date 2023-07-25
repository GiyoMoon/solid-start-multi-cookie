import { createCookieSessionStorage } from 'solid-start';
import { createServerAction$, redirect } from 'solid-start/server';

const cookieOneStorage = createCookieSessionStorage({
  cookie: {
    name: 'cookie-1',
    secure: false,
    sameSite: true,
    path: '/',
    maxAge: 60 * 60 * 1,
    httpOnly: true,
  },
})

const cookieTwoStorage = createCookieSessionStorage({
  cookie: {
    name: 'cookie-2',
    secure: false,
    sameSite: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  },
})

export default function Home() {
  const [_, act] = createServerAction$(async (_, { request }) => {
    const responseHeaders = new Headers()
    const cookieOneSession = await cookieOneStorage.getSession(
      request.headers.get('Cookie'),
    )
    const cookieTwoSession = await cookieTwoStorage.getSession(
      request.headers.get('Cookie'),
    )
    cookieOneSession.set('cookie-1', 'This is the value of cookie 1')
    cookieTwoSession.set('cookie-2', 'This is the value of cookie 2')


    responseHeaders.append(
      'Set-Cookie',
      await cookieOneStorage.commitSession(cookieOneSession),
    )
    responseHeaders.append(
      'Set-Cookie',
      await cookieTwoStorage.commitSession(cookieTwoSession),
    )

    return redirect('/', {
      headers: responseHeaders
    })
  });

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <p>This calls a server actions and tries to set two cookies called <code>cookie-1</code> and <code>cookie-2</code></p>
      <button onClick={() => act()}>Set cookies</button>
    </main>
  );
}
