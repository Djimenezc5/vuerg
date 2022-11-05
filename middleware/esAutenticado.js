export default function ({ $auth, redirect }) {
  const user = $auth.user

  if (user) {
    // let the user in
  } else {
    redirect('/login')
  }
}
