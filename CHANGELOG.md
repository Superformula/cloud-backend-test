# [0.2.0](https://github.com/DiegoSalas27/cloud-backend-test/compare/v0.1.0...v0.2.0) (2022-08-09)


### Features

* add formatError pipeline to handle errors gracefully ([8a08ae0](https://github.com/DiegoSalas27/cloud-backend-test/commit/8a08ae03a76025f95768ec9ab9746536c9c18c97))
* add status code on thrown exepcetions ([6773890](https://github.com/DiegoSalas27/cloud-backend-test/commit/67738902702fc0fe6e74ccb4a772b081b1ed08b3))
* ensure ApolloServer returns checkErrorExists false on non matching error name ([c6d84a1](https://github.com/DiegoSalas27/cloud-backend-test/commit/c6d84a1c11fefdc34c93a24db29946a1d8466143))
* ensure ApolloServerResolverAdapter adds agrs to request body ([b768c4d](https://github.com/DiegoSalas27/cloud-backend-test/commit/b768c4d6f132220ba6f96d847d293dd18015fc1a))
* ensure ApolloServerResolverAdapter throws ApolloError on 500 error ([4c99f0b](https://github.com/DiegoSalas27/cloud-backend-test/commit/4c99f0b4f89ba196e1382762a409a90128fc8d46))
* ensure ApolloServerResolverAdapter throws UserInputError on 400 error ([2082509](https://github.com/DiegoSalas27/cloud-backend-test/commit/20825093f1e12cd5b6b6a61444318882d2864910))
* ensure DbRetrieveCoordinatesFactory returns DbRetrieveCoordinates instance ([c41d73d](https://github.com/DiegoSalas27/cloud-backend-test/commit/c41d73d3583315c11ce9f1ae0ee6c83ee1a22b42))
* ensure ErrorHandlerMiddleware calls sendErrorDev when in development environment ([83b0fb6](https://github.com/DiegoSalas27/cloud-backend-test/commit/83b0fb687adb889a5b4b2a1403af425263dd15e3))
* ensure ErrorMiddleware logs error on production environemnt ([64f5acb](https://github.com/DiegoSalas27/cloud-backend-test/commit/64f5acb702c429d1299325430f36903774673bf8))
* ensure ErrorMiddleware returns developerError on development environment ([b30f4d4](https://github.com/DiegoSalas27/cloud-backend-test/commit/b30f4d4b1e1d160ef1a6a580a6ba962b90bcd826))
* ensure ErrorMiddleware returns userError with default error message on INTERNAL_SERVER_ERROR ([c95235f](https://github.com/DiegoSalas27/cloud-backend-test/commit/c95235f836ca8e5c9b2141949874c1b680b1d86e))
* ensure LogControllerDecorator calls controller handle with correct arguments ([bea1d56](https://github.com/DiegoSalas27/cloud-backend-test/commit/bea1d5671a10f9aac45547751127f5da46d18e5f))
* ensure LogControllerDecorator returns httpResponse from controller ([531c3cc](https://github.com/DiegoSalas27/cloud-backend-test/commit/531c3cc58eb0a0ad4be04279f070393f24f3e8cf))
* ensure LogControllerDecoratorFactory returns a LogControllerDecorator instance ([3feaeb8](https://github.com/DiegoSalas27/cloud-backend-test/commit/3feaeb8c0bf3e2c50cb5d1d81e2bc4bbf8a6c6e7))
* ensure RetrieveCoordinateControllerFactory returns a LogControllerDecorator instance ([b6de2b0](https://github.com/DiegoSalas27/cloud-backend-test/commit/b6de2b0afab32f9a33804f27770bd76d9edf0425))



# [0.1.0](https://github.com/DiegoSalas27/cloud-backend-test/compare/7b0ba1c0b2bfedc36703c745ed341ba2b7794acb...v0.1.0) (2022-08-08)


### Bug Fixes

* add argument type ([7fdd30f](https://github.com/DiegoSalas27/cloud-backend-test/commit/7fdd30f9759e5e0b5ea21d8fc2e8a668a45de680))
* change order coordinates ([c6979a0](https://github.com/DiegoSalas27/cloud-backend-test/commit/c6979a0c982b68274cfd9475beb0f34565d384e8))


### Features

* add adaptResolver for GraphQL resolvers ([fda378d](https://github.com/DiegoSalas27/cloud-backend-test/commit/fda378db2e4678701065aea5efa39cb39880285e))
* add apollo server initial configuration ([3911452](https://github.com/DiegoSalas27/cloud-backend-test/commit/3911452a3e4e0762aad77ae91fd7c59e6f9500a8))
* add BadRequest error ([11df888](https://github.com/DiegoSalas27/cloud-backend-test/commit/11df888a2b805c071cfdc1e178dcc43208697377))
* add BusinessError class for fine-grained error treatment ([2671813](https://github.com/DiegoSalas27/cloud-backend-test/commit/26718138a4628fa898063644dae09bd10719a731))
* add coordinate model ([7b0ba1c](https://github.com/DiegoSalas27/cloud-backend-test/commit/7b0ba1c0b2bfedc36703c745ed341ba2b7794acb))
* add CoordinateResolver ([4ecf837](https://github.com/DiegoSalas27/cloud-backend-test/commit/4ecf8378ee719498f66182e2326cd49abcd17dbe))
* add CoordinateResolver to buildSchema ([e32db0f](https://github.com/DiegoSalas27/cloud-backend-test/commit/e32db0fc46e522ea1b3f3c1b0586e4fa75f7d291))
* add CoordinateType entity ([0cdc39e](https://github.com/DiegoSalas27/cloud-backend-test/commit/0cdc39eb047281cfed478831effc163669b1a9f7))
* add DbRetrieveCoordinates usecase implementation ([662b4ed](https://github.com/DiegoSalas27/cloud-backend-test/commit/662b4edfc5907edebce0f4428c0cca3a8e847f71))
* add express app with apollo server integration ([aaa7dd6](https://github.com/DiegoSalas27/cloud-backend-test/commit/aaa7dd67c27c9f97c1de2b23ace8d6387e0531ea))
* add MapBoxHttpClientAdapter production class ([8bf221d](https://github.com/DiegoSalas27/cloud-backend-test/commit/8bf221d8024aa1aebf31769aa25119ff4726af74))
* add node-fetch to support import statem,nt ([659b9b4](https://github.com/DiegoSalas27/cloud-backend-test/commit/659b9b479ee8ba1dbe8dad53d0b22fa9346ba00b))
* add protocols for controllers ([756a2f8](https://github.com/DiegoSalas27/cloud-backend-test/commit/756a2f8a5e46b45a2c172aa5e485b50ee38a5ad6))
* add RetrieveCoordinateController production class ([be6fa7c](https://github.com/DiegoSalas27/cloud-backend-test/commit/be6fa7ccc1176ba22a43ba499c329e7dc3a91e2f))
* add RetrieveCoordinatesController factory method ([3fbddf7](https://github.com/DiegoSalas27/cloud-backend-test/commit/3fbddf79e0ce7c0cc3771da998c465b4d3065767))
* ensure DbRetrieveCoordinates calls RetrieveCoordinatesRepository with correct address ([e13523e](https://github.com/DiegoSalas27/cloud-backend-test/commit/e13523ea59bc812e97f35ee535c59e2a2639a2dc))
* ensure DbRetrieveCoordinates throws BadRequestError if RetrieveCoordinatesRepository returns null ([b6e6ef6](https://github.com/DiegoSalas27/cloud-backend-test/commit/b6e6ef6d646e0c7407bf4ccadb096329dc0a0ae7))
* ensure MapBoxHttpClientAdapter calls fetch method with correct values ([ff3f49c](https://github.com/DiegoSalas27/cloud-backend-test/commit/ff3f49c28b10d430b507de0367b6ce6a707b55f8))
* ensure MapBoxHttpClientAdapter returns BadRequest error if given address is incorrect ([78b7be3](https://github.com/DiegoSalas27/cloud-backend-test/commit/78b7be3b90ba75366261e17f60cff177378ce592))
* ensure MapBoxHttpClientAdapter returns latitude and longitude if feature list is not empty ([f52f16c](https://github.com/DiegoSalas27/cloud-backend-test/commit/f52f16cf64a8edc9d74ff942efc8163770721d89))
* ensure RetrieveCoordinatesController calls RetrieveCoordinates with correct address ([0cd6582](https://github.com/DiegoSalas27/cloud-backend-test/commit/0cd658288bba52760971ca72306862f3705c5380))
* ensure RetrieveCoordinatesController returns catchError if RetrieveCoordinates throws ([33bae1e](https://github.com/DiegoSalas27/cloud-backend-test/commit/33bae1ea74cd922bc48595ff9d2149d9e6f3e500))
* ensure RetrieveCoordinatesController returns coordinates on success ([2cb5c8d](https://github.com/DiegoSalas27/cloud-backend-test/commit/2cb5c8d1c9c9558c71b1073569476eff1d69a688))



