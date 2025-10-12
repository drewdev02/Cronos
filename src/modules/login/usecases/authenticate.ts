// A tiny fake authenticate use case. Replace with real API call later.
export default async function authenticate(email: string, password: string) {
  // simulate network
  await new Promise((res) => setTimeout(res, 500))

  if (!email.includes('@') || password.length < 4) {
    throw new Error('Invalid credentials')
  }

  // return a fake token
  return { token: 'fake-token', user: { email } }
}
