import * as AWS from 'aws-sdk'

const TABLE_NAME = process.env.TABLE_NAME || ''
const PRIMARY_KEY = process.env.PRIMARY_KEY || ''

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
  DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`

const db = new AWS.DynamoDB.DocumentClient()

interface ApiError {
  code: string
  message: string
}

export const handler = async (event: any = {}): Promise<any> => {
  const editedUser: any =
    typeof event.arguments?.user == 'object' ? event.arguments.user : JSON.parse(event.arguments.user)

  const userId = event.arguments?.user?.id
  if (!userId) {
    return {
      error: {
        message: 'The user id is required',
        type: 'ValidationError',
      },
    }
  }

  delete editedUser.id
  editedUser['updatedAt'] = new Date().toISOString()
  let editedUserProps = Object.keys(editedUser)
  if (!editedUser || editedUserProps.length < 2) {
    return {
      error: {
        message: 'No properties to update provided',
        type: 'ValidationError',
      },
    }
  }

  const firstProperty = editedUserProps.splice(0, 1)
  const params: any = {
    TableName: TABLE_NAME,
    Key: {
      [PRIMARY_KEY]: userId,
    },
    UpdateExpression: `set ${firstProperty} = :${firstProperty}`,
    ExpressionAttributeValues: {},
    ReturnValues: 'ALL_NEW',
  }
  params.ExpressionAttributeValues[`:${firstProperty}`] = editedUser[`${firstProperty}`]

  editedUserProps.forEach((property) => {
    params.UpdateExpression += `, ${property} = :${property}`
    params.ExpressionAttributeValues[`:${property}`] = editedUser[property]
  })

  try {
    let updatedUser = await db.update(params).promise()
    return updatedUser.Attributes
  } catch (dbError) {
    const customMessage =
      (dbError as ApiError).code === 'ValidationException' && (dbError as ApiError).message.includes('reserved keyword')
        ? RESERVED_RESPONSE
        : DYNAMODB_EXECUTION_ERROR
    return {
      error: {
        message: customMessage,
        type: (dbError as ApiError).code,
      },
    }
  }
}
