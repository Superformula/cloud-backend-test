import { StorageDataSource } from '../storage/StorageDataSource';
import { ModelEnum } from '../../../common/globalModel';
import { ApolloError } from 'apollo-server-lambda';


//#region Mocks


const mock = {
  db: {
    scan: jest.fn(),
    put:  jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

const mockedDocumentId = "test_id";

const mockedCreateInputArgs = {
  attributes: {
    name: 'Mario 23',
    bob: 'test',
    address: {
      place: 'Buenos Aires',
      latitude: 121212,
      longitude: 353434653
    },
    description: 'test',
    imageUrl: 'test.com'
  }
};

const mockedCreateResponse = {
  id: mockedDocumentId,
  ...mockedCreateInputArgs.attributes
};

const mockedUpdateInputArgs = {
  id: 'fa8d7da0-af85-11eb-9859-577507baa6d7',
  attributes: {
    name: 'New name',
    description: 'new desc'
  }
};

const mockedUpdateResponse = {
  Attributes: {
    name: 'New name',
    description: 'new desc',
    address: { place: 'Buenos Aires', latitude: 121212, longitude: 353434653 },
    id: 'fa8d7da0-af85-11eb-9859-577507baa6d7',
    imageUrl: 'test.com'
  }
  
};

const mockedReadByIdInputArgs = {
  id: 'fa8d7da0-af85-11eb-9859-577507baa6d7',
};

const mockedReadByIdDbResponse = {
  Items: [
    {
      name: 'New name',
      description: 'new desc',
      id: 'fa8d7da0-af85-11eb-9859-577507baa6d7',
      imageUrl: 'test.com'
    }
  ],
  Count: 1,
  ScannedCount: 21
};

const mockedReadByResponse = {
  items: [
    {
      name: 'New name',
      description: 'new desc',
      id: 'fa8d7da0-af85-11eb-9859-577507baa6d7',
      imageUrl: 'test.com'
    }
  ],
  count: 1,
  lastEvaluatedKey: undefined
};

const mockedReadLimitedListInputArgs = {
  limit: 3
};

const mockedReadLimitedListDbResponse = {
  Items: [
    {
      name: 'New name',
      description: 'new desc',
      id: 'fa8d7da0-af85-11eb-9859-577507baa6d7',
      imageUrl: 'test.com'
    },
    {
      name: 'Mario 23',
      description: 'test',
      id: '2dedaa80-aff9-11eb-aa79-17512b3bfb2c',
      imageUrl: 'test.com'
    },
    {
      name: 'Mario 20',
      description: 'test',
      id: '071a61a0-af86-11eb-acd0-7790705c88db',
      imageUrl: 'test.com'
    }
  ],
  Count: 3,
  ScannedCount: 3,
  LastEvaluatedKey: { id: '071a61a0-af86-11eb-acd0-7790705c88db' }
};

const mockedReadLimitedListResponse = {
  items: [
    {
      name: 'New name',
      description: 'new desc',
      id: 'fa8d7da0-af85-11eb-9859-577507baa6d7',
      imageUrl: 'test.com'
    },
    {
      name: 'Mario 23',
      description: 'test',
      id: '2dedaa80-aff9-11eb-aa79-17512b3bfb2c',
      imageUrl: 'test.com'
    },
    {
      name: 'Mario 20',
      description: 'test',
      id: '071a61a0-af86-11eb-acd0-7790705c88db',
      imageUrl: 'test.com'
    }
  ],
  count: 3,
  lastEvaluatedKey: '071a61a0-af86-11eb-acd0-7790705c88db'
};



//#endregion Mocks

//#region Initializations

const dataStorage = new StorageDataSource(mock.db);

//#endregion Initializations

describe('Unit', () => {
  describe('[DataSource - Storage]', () => {

    describe('read service', () => {
      it('read one by Id - success', async () => {
        mock.db.scan.mockReturnValueOnce({
          promise: () => Promise.resolve(mockedReadByIdDbResponse)
        });

        const getNewId = jest.fn().mockImplementation(() => mockedDocumentId);
        dataStorage.getNewId = getNewId.bind(dataStorage); 

        await expect(dataStorage.read(ModelEnum.user, mockedReadByIdInputArgs)).resolves.toEqual(mockedReadByResponse);
      });

      it('read one by Id - failure', async () => {
        mock.db.put.mockReturnValueOnce({
          promise: () => Promise.reject(new Error("read failed"))
        });

        await expect(dataStorage.create(ModelEnum.user, mockedReadByIdInputArgs)).rejects.toEqual(new ApolloError("read failed"));
      });

      it('read limited list - success', async () => {
        mock.db.scan.mockReturnValueOnce({
          promise: () => Promise.resolve(mockedReadLimitedListDbResponse)
        });

        await expect(dataStorage.read(ModelEnum.user, mockedReadLimitedListInputArgs)).resolves.toEqual(mockedReadLimitedListResponse);
      });

      it('read limited list - failure', async () => {
        mock.db.put.mockReturnValueOnce({
          promise: () => Promise.reject(new Error("read failed"))
        });

        await expect(dataStorage.create(ModelEnum.user, mockedReadLimitedListInputArgs)).rejects.toEqual(new ApolloError("read failed"));
      });
    });
    
    describe('create service', () => {
      it('success', async () => {
        mock.db.put.mockReturnValueOnce({
          promise: () => Promise.resolve()
        });

        await expect(dataStorage.create(ModelEnum.user, mockedCreateInputArgs)).resolves.toEqual(mockedCreateResponse);
      });

      it('failure', async () => {
        mock.db.put.mockReturnValueOnce({
          promise: () => Promise.reject(new Error("creation failed"))
        });

        await expect(dataStorage.create(ModelEnum.user, mockedCreateInputArgs)).rejects.toEqual(new ApolloError("creation failed"));
      });
    });

    describe('update service', () => {
      it('success', async () => {
        mock.db.update.mockReturnValueOnce({
          promise: () => Promise.resolve(mockedUpdateResponse)
        });

        await expect(dataStorage.update(ModelEnum.user, mockedUpdateInputArgs)).resolves.toEqual(mockedUpdateResponse.Attributes);
      });

      it('failure', async () => {
        mock.db.update.mockReturnValueOnce({
          promise: () => Promise.reject(new Error("Document not found"))
        });

        await expect(dataStorage.update(ModelEnum.user, mockedUpdateInputArgs)).rejects.toEqual(new ApolloError("Document not found"));
      });
    });

    describe('delete service', () => {

      it('Unexisting id', async () => {
        mock.db.delete.mockReturnValueOnce({
          promise: () => Promise.reject()
        });

        await expect(dataStorage.delete(ModelEnum.user, { id: "Non_Existing" })).rejects.toEqual(new ApolloError("Document not found", "404"));
      });

      it('Existing id', async () => {
        mock.db.delete.mockReturnValueOnce({
          promise: () => Promise.resolve()
        });

        await expect(dataStorage.delete(ModelEnum.user, { id: "Non_Existing" })).resolves.toBe(true);
      });
    });
  });

});

