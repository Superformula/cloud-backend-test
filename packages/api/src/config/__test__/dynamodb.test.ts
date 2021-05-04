describe('when offline', () => {
  it('dynamoDbClient is initialized with local endpoint when offline', async () => {
    process.env.IS_OFFLINE = 'true';
    const dynamodb = import('../dynamodb');
    const { dynamodbClientOption } = await dynamodb;
    expect(dynamodbClientOption).toEqual(expect.objectContaining({
      endpoint: 'http://localhost:8100'
    }));
  });  
});
