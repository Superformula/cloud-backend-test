import * as AWS from 'aws-sdk'

const TABLE_NAME = process.env.TABLE_NAME || ''
const PRIMARY_KEY = process.env.PRIMARY_KEY || ''

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
  DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`

const db = new AWS.DynamoDB.DocumentClient()

export const handler = async (event: any = {}): Promise<any> => {
  const editedUser: any =
    typeof event.arguments?.user == 'object' ? event.arguments.user : JSON.parse(event.arguments.user)

  const userId = event.arguments?.user?.id
  if (!userId) {
    return { statusCode: 400, body: 'invalid request, you are missing the user.id argument' }
  }

  delete editedUser.id
  let editedUserProps = Object.keys(editedUser)
  if (!editedUser || editedUserProps.length < 1) {
    return { statusCode: 400, body: 'invalid request, no arguments provided' }
  }

  const firstProperty = editedUserProps.splice(0, 1)
  const params: any = {
    TableName: TABLE_NAME,
    Key: {
      [PRIMARY_KEY]: userId,
    },
    UpdateExpression: `set ${firstProperty} = :${firstProperty}`,
    ExpressionAttributeValues: {},
    ReturnValues: 'UPDATED_NEW',
  }
  params.ExpressionAttributeValues[`:${firstProperty}`] = editedUser[`${firstProperty}`]

  // TODO timestamp updatedAt

  editedUserProps.forEach((property) => {
    params.UpdateExpression += `, ${property} = :${property}`
    params.ExpressionAttributeValues[`:${property}`] = editedUser[property]
  })

  try {
    console.log(`params in db.update`)
    console.log(params)
    await db.update(params).promise()
    // TODO Get updated user from DB, the mutation might ask for other properties
    return { statusCode: 204, user: event.arguments.user }
  } catch (dbError: any) {
    const errorResponse =
      dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword')
        ? RESERVED_RESPONSE
        : DYNAMODB_EXECUTION_ERROR
    return { statusCode: 500, body: errorResponse, error: dbError.message }
  }
}
