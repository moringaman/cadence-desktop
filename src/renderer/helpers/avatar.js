
export default function avatarMaker(username) {
  let genderArray = ['male', 'female']
  let gender = genderArray[Math.round(Math.random())]
    let avatarUrl = `https://avatars.dicebear.com/v2/${gender}/${username}.svg`
  return avatarUrl;         
}
