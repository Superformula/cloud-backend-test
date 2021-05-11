const users = `query users($name: String){
    users(searchCriteria: {
      name: $name
    }) {
        id
        name
        dob
        address
        description
    }
}`

const user = `query user($id: String!){
  user(id: $id) {
      id
      name
      dob
      address
      description
      createdAt
      updatedAt
      imageUrl
  }
}`

const createUser = `mutation createUser($name: String!, $dob: String! $address: String!, $description: String) {
  createUser(data: {
    name: $name,
    dob: $dob,
    address: $address,
    description: $description
  }) {
    id
    name
    dob
    address
    description
    createdAt
  }
}`

const createUserWithImage = ({
  name, dob, address, description
}) => {
  return `mutation createUser($image: Upload!) {
    createUser(data: {
      name: "${name}",
      dob: "${dob}",
      address: "${address}",
      description: "${description}",
      image: $image
    }) {
      id
      name
      dob
      address
      description
      createdAt
      updatedAt
      imageUrl
    }
  }`
}

const updateUser = `mutation updateUser($id: String!, $name: String!, $dob: String! $address: String!, $description: String) {
  updateUser(data: {
    id: $id,
    name: $name,
    dob: $dob,
    address: $address,
    description: $description
  }) {
    id
    name
    dob
    address
    description
    createdAt
    imageUrl
  }
}`

const updateUserWithImage = ({
  id, name, dob, address, description
}) => {
  return `mutation updateUser($image: Upload!) {
    updateUser(data: {
      id: "${id}",
      name: "${name}",
      dob: "${dob}",
      address: "${address}",
      description: "${description}",
      image: $image
    }) {
      id
      name
      dob
      address
      description
      createdAt
      imageUrl
    }
  }`
}

const deleteUser = `mutation deleteUser($id: String!){
  deleteUser(id: $id)
}`


// to prevent from getting 'Your test must contain at least one test' error when running --coverage
test.skip('skip', () => {})

export default {
  users,
  user,
  createUser,
  createUserWithImage,
  updateUser,
  updateUserWithImage,
  deleteUser
}
